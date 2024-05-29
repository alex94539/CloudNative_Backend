import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Room } from './Room.schema';
import { User } from './User.schema';
import { TimeSlot } from './TimeSlot.schema';

export type MeetingDocument = HydratedDocument<Meeting>;

@Schema()
export class Meeting {
    @Prop({ default: new Types.ObjectId() })
    _id: Types.ObjectId

    @Prop({ required: true })
    rDate: string;

    @Prop({ required: true })
    title: string;

    @Prop({ required: false })
    desc: string;

    @Prop()
    attendants: Types.ObjectId[];

    @Prop({ type: Types.ObjectId, ref: Room.name, required: true })
    roomId: Room;

    @Prop({ type: Types.ObjectId, ref: User.name, required: true })
    userId: User;
}

export const MeetingSchema = SchemaFactory.createForClass(Meeting);
