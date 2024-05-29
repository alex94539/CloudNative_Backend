import { Module } from '@nestjs/common';
import { InfoController } from './info.controller';
import { InfoService } from './info.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Room, RoomSchema } from 'src/interfaces/schemas/Room.schema';
import { Meeting, MeetingSchema } from 'src/interfaces/schemas/Meeting.schema';
import { User, UserSchema } from 'src/interfaces/schemas/User.schema';
import { UserService } from '../user/user.service';
import { TimeSlot, TimeSlotSchema } from 'src/interfaces/schemas/TimeSlot.schema';

@Module({
  controllers: [InfoController],
  providers: [
    InfoService,
    UserService
  ],
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Room.name, schema: RoomSchema },
      { name: Meeting.name, schema: MeetingSchema },
      { name: TimeSlot.name, schema: TimeSlotSchema }
    ])
  ]
})
export class InfoModule { }
