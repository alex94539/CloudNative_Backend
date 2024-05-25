import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';

export type RoomDocument = HydratedDocument<Room>;

@Schema()
export class Room {
    @Prop({ required: true })
    @ApiProperty()
    name: string;

    @Prop({ required: true })
    @ApiProperty()
    building: string;

    @Prop({ required: true })
    @ApiProperty()
    capacity: number;

    @Prop({ required: true })
    @ApiProperty()
    area: number;

    @Prop({ required: true, default: true })
    @ApiProperty()
    eating: boolean

}

export const RoomSchema = SchemaFactory.createForClass(Room);
