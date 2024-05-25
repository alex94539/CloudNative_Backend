import { Module } from '@nestjs/common';
import { AuthenticateService } from './authenticate.service';
import { AuthenticateController } from './authenticate.controller';
import { UserService } from '../user/user.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  providers: [AuthenticateService, UserService],
  controllers: [AuthenticateController]
})
export class AuthenticateModule {}
