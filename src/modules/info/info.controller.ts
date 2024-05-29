import { Body, Controller, Get, HttpCode, Post, Query, Request, UnauthorizedException, NotFoundException, ConflictException, Patch, UnprocessableEntityException, Req } from '@nestjs/common';
import { InfoService } from './info.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateMeetingDto, UpdateMeetingDto } from 'src/interfaces/dtos/CreateMeeting.dto';
import { UserService } from '../user/user.service';
import { CreateRoomDto, UpdateRoomDto } from 'src/interfaces/dtos/CreateRoom.dto';

@Controller('info')
@ApiTags('info')
@ApiBearerAuth("token")
export class InfoController {
    constructor(
        private infoService: InfoService,
        private userService: UserService
    ) { }

    @Get('rooms')
    @ApiOperation({ summary: 'Get room list' })
    @ApiResponse({ status: 200, description: 'No error.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @HttpCode(200)
    async getRooms() {
        return this.infoService.getRooms();
    }

    @Get('room')
    @ApiOperation({ summary: 'Get detailed room info.' })
    @ApiResponse({ status: 200, description: 'No error.' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Not found' })
    async getRoom(
        @Query('roomId') roomId: string,
    ) {
        return await this.infoService.getRoom(roomId);
    }

    @Post('room')
    @ApiOperation({ summary: 'Add new meeting room info.' })
    @ApiResponse({ status: 200, description: 'No error.' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async newRoom(@Request() req, @Body() newRoom: CreateRoomDto) {
        if (!req?.role || req.role !== 'Admin') {
            throw new UnauthorizedException('You must be admin to add new room');
        }
        return this.infoService.newRoom(newRoom);
    }

    @Patch('room')
    @ApiOperation({ summary: 'Update room information' })
    @ApiResponse({ status: 202, description: 'Updated.' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async patchRoom(
        @Request() req,
        @Query('roomId') roomId: string,
        @Body() uRoom: UpdateRoomDto
    ) {
        if (!req?.role || req.role !== 'Admin') {
            throw new UnauthorizedException('You must be admin to patch room');
        }
        if (!roomId) {
            throw new UnprocessableEntityException('Room id must present to perform update.');
        }
        return this.infoService.updateRoom(roomId, uRoom);
    }

    @Get('reserves')
    @ApiOperation({ summary: 'Get meetings held by user.' })
    @ApiResponse({ status: 200, description: 'No error.' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Room not found' })
    async getReservations(
        @Request() req
    ) {
        return this.infoService.getReservations(req._id);
    }

    @Get('reserve')
    @ApiOperation({ summary: 'Get reservation info.' })
    @ApiResponse({ status: 200, description: 'No error.' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Room not found' })
    async getReservation(
        @Query('meetId') meetId: string
    ) {
        return this.infoService.getReservation(meetId);
    }

    @Post('reserve')
    @ApiOperation({ summary: 'Reserve the meeting room' })
    @ApiResponse({ status: 201, description: 'No error.' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Room already reserved.' })
    @ApiResponse({ status: 404, description: 'Room or userId not found' })
    async makeReservation(
        @Body() reserve: CreateMeetingDto
    ) {
        const r = await this.infoService.getRoom(reserve.roomId);
        if (!r) {
            throw new NotFoundException('Requested room not found');
        }
        const u = await this.userService.findById(reserve.userId);
        if (!u) {
            throw new NotFoundException('UserId not found');
        }
        const c = await this.infoService.checkReservation(reserve)
        if (c) {
            throw new ConflictException(`Timeslot is already reserved.`)
        }

        return this.infoService.makeReservation(reserve);
    }

    @Patch('reserve')
    @ApiOperation({ summary: 'Update meeting info.' })
    @ApiResponse({ status: 200, description: 'No error.' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Meeting not found' })
    async updateReservation(
        @Request() req,
        @Body() payload: UpdateMeetingDto,
        @Query('meetId') meetId: string
    ) {
        if (req.role !== 'Admin' && !this.infoService.checkOwnerShip(req.userId, meetId)) {
            throw new UnauthorizedException('Unauthorized to modify this meeting.');
        }
        if (!payload) {
            throw new UnprocessableEntityException('Empty payload.');
        }
        const r = await this.getReservation(meetId);
        if (!r._id) {
            throw new NotFoundException('Meeting not found.');
        }

        return this.infoService.updateReservation(payload, r);
    }

    @Get('meetings')
    @ApiOperation({ summary: 'Get upcoming meetings.' })
    @ApiResponse({ status: 200, description: 'No error.' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Meeting not found' })
    getMeetings(
        @Request() req
    ) {
        return this.infoService.getMeetings(req._id);
    }

    @Get('meeting')
    @ApiOperation({ summary: 'Get meeting info.' })
    @ApiResponse({ status: 200, description: 'No error.' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Meeting not found' })
    getMeeting(
        @Request() req,
        @Query('meetId') mId: string
    ) {
        return this.infoService.getMeeting(req._id, mId);
    }

    @Post('meeting')
    @ApiOperation({ summary: 'Send email to all attendant of meeting.' })
    @ApiResponse({ status: 201, description: 'No error.' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Meeting not found' })
    sendMeetingMsg() {

    }
}
