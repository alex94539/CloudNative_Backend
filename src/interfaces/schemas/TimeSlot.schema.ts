import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Room } from './Room.schema';
import { Meeting } from './Meeting.schema';

export type TimeSlotDocument = HydratedDocument<TimeSlot>;

@Schema()
export class TimeSlot {
    @Prop({ type: Types.ObjectId, ref: Meeting.name, required: true })
    meeting: Meeting;

    @Prop({ type: Types.ObjectId, ref: Room.name, required: true })
    roomId: Room;

    @Prop({ required: true })
    timeSlot: number;

    @Prop({ required: true })
    rDate: string;
}

export const TimeSlotSchema = SchemaFactory.createForClass(TimeSlot);