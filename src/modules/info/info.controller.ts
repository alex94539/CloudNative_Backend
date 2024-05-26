import { Body, Controller, Get, HttpCode, Post, Request, UnauthorizedException } from '@nestjs/common';
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
    async newRoom(@Request() req, @Body() newRoom: Room) {
        if (!req?.role || req.role !== 'Admin') {
            throw new UnauthorizedException('You must be admin to add new room');
        }
        return this.infoService.newRoom(newRoom);
    }
}
