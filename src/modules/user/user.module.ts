import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/interfaces/schemas/User.schema';
import { UserController } from './user.controller';

@Module({
    controllers: [UserController],
    providers: [
        UserService,
    ],
    imports: [
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema }
        ])
    ],
    exports: [UserService]
})
export class UserModule { }
