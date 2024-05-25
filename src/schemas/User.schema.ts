import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
    @Prop()
    @ApiProperty()
    firstName: string;

    @Prop()
    @ApiProperty()
    lastName: string;

    @Prop()
    @ApiProperty()
    email: string;

    @Prop()
    @ApiProperty()
    username: string;

    @Prop()
    @ApiProperty()
    password: string;

    @Prop()
    @ApiProperty({enum: ['Admin', 'User']})
    role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
