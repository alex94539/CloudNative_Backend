import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InfoModule } from './modules/info/info.module';
import { AuthenticateModule } from './modules/authenticate/authenticate.module';
import { UserModule } from './modules/user/user.module';
import { JwtModule } from '@nestjs/jwt';

import { jwtConstants } from './constants';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './modules/authenticate/authenticate.guard';
import { RoomSchema } from './schemas/Room.schema';
import { UserSchema } from './schemas/User.schema';
import { ReserveModule } from './modules/reserve/reserve.module';

@Module({
  imports: [
    InfoModule,
    UserModule,
    ReserveModule,
    AuthenticateModule,
    //MongooseModule.forRoot('mongodb://localhost/meeting_center'),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    MongooseModule.forFeature([
      { name: 'Room', schema: RoomSchema },
      { name: 'User', schema: UserSchema }
    ]),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [],
  providers: [

  ],
})
export class AppModule { }
