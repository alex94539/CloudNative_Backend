import { Module } from '@nestjs/common';
import { AuthenticateService } from './authenticate.service';
import { AuthenticateController } from './authenticate.controller';
import { UserService } from '../user/user.service';
import { UserModule } from '../user/user.module';
import { User, UserSchema } from 'src/schemas/User.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([{
      name: User.name, schema: UserSchema
    }])
  ],
  providers: [AuthenticateService, UserService],
  controllers: [AuthenticateController]
})
export class AuthenticateModule {}
