import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/User.schema';
import { UserController } from './user.controller';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '../authenticate/authenticate.guard';

@Module({
    controllers: [UserController],
    providers: [
        UserService,
        {
            provide: APP_GUARD,
            useClass: AuthGuard
        }
    ],
    imports: [
        MongooseModule.forFeature([{
            name: User.name, schema: UserSchema
        }])
    ],
    exports: [UserService]
})
export class UserModule { }
