import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument, Types } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
    @Prop({ default: new Types.ObjectId() })
    _id: Types.ObjectId

    @Prop()
    @ApiProperty()
    firstName: string;

    @Prop()
    @ApiProperty()
    lastName: string;

    @Prop()
    @ApiProperty()
    email: string;

    @Prop({ unique: true })
    @ApiProperty()
    username: string;

    @Prop()
    @ApiProperty()
    password: string;

    @Prop()
    @ApiProperty({ enum: ['Admin', 'User'] })
    role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
