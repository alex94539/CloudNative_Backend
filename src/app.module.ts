import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InfoModule } from './modules/info/info.module';
import { AuthenticateModule } from './modules/authenticate/authenticate.module';
import { UserModule } from './modules/user/user.module';
import { JwtModule } from '@nestjs/jwt';

import { jwtConstants } from './constants';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './modules/authenticate/authenticate.guard';
import { Room, RoomSchema } from './interfaces/schemas/Room.schema';
import { User, UserSchema } from './interfaces/schemas/User.schema';
import { Meeting, MeetingSchema } from './interfaces/schemas/Meeting.schema';
import { TimeSlot, TimeSlotSchema } from './interfaces/schemas/TimeSlot.schema';

@Module({
  imports: [
    InfoModule,
    UserModule,
    AuthenticateModule,
    //MongooseModule.forRoot('mongodb://localhost/meeting_center'),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '30d' },
    }),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard
    }
  ],
})
export class AppModule { }
