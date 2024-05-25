import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { InfoService } from './info.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Room } from 'src/schemas/Room.schema';

@Controller('info')
@ApiTags('info')
@ApiBearerAuth("token")
export class InfoController {
    constructor(private infoService: InfoService) { }

    @Get('roomList')
    @ApiOperation({ summary: 'get room list' })
    @ApiResponse({ status: 200, description: 'No error.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @HttpCode(200)
    async getRoomList() {
        return this.infoService.getRooms();
    }

    @Post('newRoom')
    @ApiOperation({ summary: 'Add new meeting room info.' })
    @ApiResponse({ status: 200, description: 'No error.' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async newRoom(@Body() newRoom: Room) {
        return this.infoService.newRoom(newRoom);
    }
}
