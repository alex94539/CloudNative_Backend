import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateMeetingDto, UpdateMeetingDto } from 'src/interfaces/dtos/CreateMeeting.dto';
import { CreateRoomDto, UpdateRoomDto } from 'src/interfaces/dtos/CreateRoom.dto';
import { Meeting } from 'src/interfaces/schemas/Meeting.schema';
import { Room } from 'src/interfaces/schemas/Room.schema';
import { TimeSlot } from 'src/interfaces/schemas/TimeSlot.schema';
import { User } from 'src/interfaces/schemas/User.schema';

@Injectable()
export class InfoService {
    constructor(
        @InjectModel(Room.name) private roomModel: Model<Room>,
        @InjectModel(Meeting.name) private meetingModel: Model<Meeting>,
        @InjectModel(TimeSlot.name) private timeslotModel: Model<TimeSlot>,
        @InjectModel(User.name) private userModel: Model<User>
    ) { }

    async getRooms(): Promise<Room[]> {
        return this.roomModel.find({}, { _id: 1, name: 1, building: 1 }).exec();
    }

    async getRoom(id: string): Promise<Room> {
        return this.roomModel.findOne({ _id: Types.ObjectId.createFromHexString(id) }).exec();
    }

    async newRoom(createRoom: CreateRoomDto) {
        const createdRoom = new this.roomModel({
            _id: new Types.ObjectId(),
            ...createRoom
        });
        return createdRoom.save();
    }

    async updateRoom(roomId: string, uRoom: UpdateRoomDto) {
        return this.roomModel.findByIdAndUpdate(Types.ObjectId.createFromHexString(roomId), uRoom).exec();
    }

    async checkOwnerShip(userId: string, meetId: string) {
        return this.meetingModel.countDocuments({
            _id: Types.ObjectId.createFromHexString(meetId),
            userId: Types.ObjectId.createFromHexString(userId)
        }).exec();
    }

    async deleteReservations(meetId: string) {
        this.timeslotModel.deleteMany({
            meeting: Types.ObjectId.createFromHexString(meetId)
        }).exec();


        return this.meetingModel.deleteOne({
            _id: Types.ObjectId.createFromHexString(meetId)
        }).exec()
    }

    async getReservations(id: string) {
        return this.meetingModel.find(
            { userId: Types.ObjectId.createFromHexString(id) },
            { rDate: 1, title: 1, roomId: 1 }
        ).exec();
    }

    async getReservation(id: string) {
        return this.meetingModel.findById(Types.ObjectId.createFromHexString(id)).exec();
    }

    async checkReservation(r: CreateMeetingDto) {
        return this.timeslotModel.countDocuments(
            {
                $and: [
                    {
                        $or: String(r.timeSlot).split(",").map(i => { return { timeSlot: i } })
                    },
                    {
                        rDate: r.rDate,
                        roomId: Types.ObjectId.createFromHexString(r.roomId)
                    }
                ]
            }
        ).exec();
    }

    async makeReservation(c: CreateMeetingDto) {
        const m_id = new Types.ObjectId();

        for (const i of String(c.timeSlot).split(',')) {
            const s_id = new Types.ObjectId();
            const t = new this.timeslotModel({
                _id: s_id,
                meeting: m_id,
                roomId: new Types.ObjectId(c.roomId),
                timeSlot: i,
                rDate: c.rDate
            });
            t.save();
        }
        const createdMeeting = await new this.meetingModel({
            _id: m_id,
            rDate: c.rDate,
            title: c.title,
            desc: c.desc,
            timeSlots: String(c.timeSlot).split(','),
            attendants: String(c.attendants).split(',').map(i => { return new Types.ObjectId(i) }),
            roomId: new Types.ObjectId(c.roomId),
            userId: new Types.ObjectId(c.userId)
        }).save();
        return createdMeeting;
    }

    async updateReservation(u: UpdateMeetingDto, r: Meeting) {
        if (u.timeSlot) {
            await this.timeslotModel.deleteMany({ meeting: r._id }).exec();
            await this.timeslotModel.insertMany(
                u.timeSlot.map(i => {
                    return {
                        meeting: r._id,
                        roomId: r.roomId,
                        timeSlot: i,
                        rDate: r.rDate
                    }
                })
            );
        }
        return this.meetingModel.findByIdAndUpdate(r._id, u).exec();
    }

    async getMeetings(uId: string) {
        const today = new Date();
        return this.meetingModel.find({
            $and: [
                {
                    attendants: Types.ObjectId.createFromHexString(uId)
                },
                {
                    rDate: {
                        $gte: `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${(today.getDate()).toString().padStart(2, '0') }`
                    }
                }
            ]
        }).exec();
    }

    async getMeeting(uId: string, mId: string) {
        return this.meetingModel.findOne({
            _id: Types.ObjectId.createFromHexString(mId),
            attendants: Types.ObjectId.createFromHexString(uId)
        }).exec();
    }

    async getOccupiedSlot(roomId: string, rDate: string): Promise<TimeSlot[]> {
        return this.timeslotModel.find({
            roomId: Types.ObjectId.createFromHexString(roomId),
            rDate: rDate
        }).exec()
    }
}
