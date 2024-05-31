import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { sha256 } from 'js-sha256';
import { Model, Types } from 'mongoose';
import { CreateUserDto } from 'src/interfaces/dtos/CreateUser.dto';
import { User } from 'src/interfaces/schemas/User.schema';


@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>
    ) { }

    async newUser(user: CreateUserDto): Promise<User | undefined> {

        const createdUser = new this.userModel({
            _id: new Types.ObjectId(),
            ...user
        });
        return createdUser.save();
    }

    async findById(userId: string): Promise<User | undefined> {
        return this.userModel.findById(Types.ObjectId.createFromHexString(userId), { password: 0 });
    }

    async findAll(): Promise<User[] | undefined> {
        return this.userModel.find({}, { password: 0 });
    }

    async findUser(username: string): Promise<User | undefined> {
        return this.userModel.findOne({ username: username });
    }
}
