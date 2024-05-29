import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { sha256 } from 'js-sha256';
import { Model, Types } from 'mongoose';
import { User } from 'src/interfaces/schemas/User.schema';


@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>
    ) { }

    async newUser(user: User): Promise<User | undefined> {
        user.password = sha256(user.password);
        const createdUser = new this.userModel(user);
        return createdUser.save();
    }

    async findById(userId: string): Promise<User | undefined> {
        return this.userModel.findById(Types.ObjectId.createFromHexString(userId));
    }

    async findUser(username: string): Promise<User | undefined> {
        return this.userModel.findOne({ username: username });
    }
}
