import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Room } from 'src/schemas/Room.schema';

@Injectable()
export class InfoService {
    constructor(@InjectModel(Room.name) private roomModel: Model<Room>) { }
    readonly rooms: Room[] = [
        {
            name: '315會議室',
            building: "工程三館",
            area: 40,
            capacity: 20,
            eating: true,
        },
        {
            name: '427會議室',
            building: "工程三館",
            area: 40,
            capacity: 20,
            eating: true,
        }
    ]

    async getRooms(): Promise<Room[]> {

        return this.roomModel.find().exec();
    }

    async newRoom(createRoom: Room) {
        const createdRoom = new this.roomModel(createRoom);
        return createdRoom.save();
    }
}
