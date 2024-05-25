import { Module } from '@nestjs/common';
import { InfoController } from './info.controller';
import { InfoService } from './info.service';
import { APP_GUARD } from '@nestjs/core/constants';
import { AuthGuard } from '../authenticate/authenticate.guard';
import { MongooseModule } from '@nestjs/mongoose';
import { Room, RoomSchema } from 'src/schemas/Room.schema';

@Module({
  controllers: [InfoController],
  providers: [
    InfoService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard
    }
  ],
  imports: [
    MongooseModule.forFeature([{
      name: Room.name, schema: RoomSchema
    }])
  ]
})
export class InfoModule { }
