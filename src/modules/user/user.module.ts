import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { APP_GUARD } from '@nestjs/core/constants';
import { AuthGuard } from '../authenticate/authenticate.guard';

@Module({
    providers: [
        UserService
    ],
    exports: [UserService]
})
export class UserModule { }
