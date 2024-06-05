import { Body, Controller, Get, HttpCode, Post, Query, Request, UnauthorizedException, NotFoundException, ConflictException, Patch, UnprocessableEntityException, Req, UseInterceptors, UploadedFile, UploadedFiles, ParseFilePipe, MaxFileSizeValidator, Delete } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { CreateMeetingDto, UpdateMeetingDto } from 'src/interfaces/dtos/CreateMeeting.dto';
import { CreateRoomDto, UpdateRoomDto } from 'src/interfaces/dtos/CreateRoom.dto';
import { InfoService } from './info.service';
import { UserService } from '../user/user.service';
import { diskStorage } from 'multer';
import { CreateMsgDto } from 'src/interfaces/dtos/CreateMsg.dto';
import { MailService } from '../mail/mail.service';
import { join } from 'node:path';


@Controller('info')
@ApiTags('info')
@ApiBearerAuth("token")
export class InfoController {
    constructor(
        private infoService: InfoService,
        private userService: UserService,
        private mailService: MailService
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

    @Get('room_status')
    @ApiOperation({ summary: 'Get occupied time slot of specific room.' })
    @ApiResponse({ status: 200, description: 'No error.' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async getTimeslot(
        @Query('roomId') roomId: string,
        @Query('date') rDate: string
    ) {
        return await this.infoService.getOccupiedSlot(roomId, rDate);
    }

    @Post('room')
    @ApiOperation({ summary: 'Add new meeting room info.' })
    @ApiResponse({ status: 200, description: 'No error.' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async newRoom(@Request() req, @Body() newRoom: CreateRoomDto) {
        if (!req?.role || req.role !== 'Admin') {
            throw new UnauthorizedException('You must be admin to add new room');
        }
        return await this.infoService.newRoom(newRoom);
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
        return await this.infoService.updateRoom(roomId, uRoom);
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
    @UseInterceptors(FilesInterceptor('files', 4, {
        storage: diskStorage({
            destination: process.env.STATIC_FILE_PATH,
            filename: (_, file, callback) => {
                callback(null, Buffer.from(file.originalname, 'ascii').toString('utf-8'));
            },
        })
    }))
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        required: true,
        schema: {
            type: 'object',
            properties: {
                files: {
                    type: 'array',
                    items: {
                        type: 'string',
                        format: 'binary',
                    }
                },
                title: {
                    type: 'string'
                },
                desc: {
                    type: 'string'
                },
                attendants: {
                    type: 'array',
                    items: {
                        type: 'string'
                    }
                },
                timeSlot: {
                    type: 'array',
                    items: {
                        type: 'string'
                    }
                },
                rDate: {
                    type: 'string'
                },
                userId: {
                    type: 'string'
                },
                roomId: {
                    type: 'string'
                }
            }
        }
    })
    @ApiOperation({ summary: 'Reserve the meeting room' })
    @ApiResponse({ status: 201, description: 'No error.' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Room already reserved.' })
    @ApiResponse({ status: 404, description: 'Room or userId not found' })
    async makeReservation(
        @Request() req,
        @Body() m: CreateMeetingDto,
        @UploadedFiles(new ParseFilePipe({
            validators: [new MaxFileSizeValidator({ maxSize: 1000000 })],
            fileIsRequired: false
        })) files?: Array<Express.Multer.File>
    ) {
        console.log(m);
        const r = await this.infoService.getRoom(m.roomId);
        if (!r) {
            throw new NotFoundException('Requested room not found');
        }
        const u = await this.userService.findById(m.userId);
        if (!u) {
            throw new NotFoundException('UserId not found');
        }
        const c = await this.infoService.checkReservation(m);
        if (c) {
            throw new ConflictException('Timeslot is already reserved.');
        }

        const filenames = files ? files.map(i => {
            return {
                path: join(process.env.STATIC_FILE_PATH, i.filename)
            }
        }) : [];

        const slots = String(m.timeSlot).split(',');

        const ic = this.mailService.getIcalObject(Number(slots[0]), Number(slots[slots.length - 1]), m.title, m.desc, r.building, m.rDate);

        for (const i of String(m.attendants).split(',')) {
            const u = await this.userService.findById(i.toString());
            this.mailService.sendMsg(m.title, m.desc, u.email, filenames, ic);
        }

        return this.infoService.makeReservation(m);
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
        if (req.role !== 'Admin' && !(await this.infoService.checkOwnerShip(req._id, meetId))) {
            throw new UnauthorizedException('Unauthorized to modify this meeting.');
        }
        if (!payload) {
            throw new UnprocessableEntityException('Empty payload.');
        }
        const r = await this.infoService.getReservation(meetId);
        if (!r._id) {
            throw new NotFoundException('Meeting not found.');
        }

        return this.infoService.updateReservation(payload, r);
    }

    @Delete('reserve')
    @ApiOperation({ summary: 'Delete meetings.' })
    @ApiResponse({ status: 200, description: 'No error.' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Meeting not found' })
    async deleteReserve(
        @Request() req,
        @Query('meetId') meetId: string
    ) {
        if (req.role === 'Admin' || await this.infoService.checkOwnerShip(req._id, meetId)) {
            const m = await this.infoService.getMeeting(req._id, meetId);
            for (const i of m.attendants) {
                const u = await this.userService.findById(i.toString());
                this.mailService.sendMsg(m.title, `Meeting ${m.title} has been cancelled by ${req.username}`, u.email, []);
            }
            return this.infoService.deleteReservations(meetId);
        }
        else {
            throw new UnauthorizedException('You are neithor Admin nor the meeting owner.');
        }
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
    @UseInterceptors(FilesInterceptor('files', 4, {
        storage: diskStorage({
            destination: process.env.STATIC_FILE_PATH,
            filename: (_, file, callback) => {
                callback(null, Buffer.from(file.originalname, 'ascii').toString('utf-8'));
            },
        })
    }))
    @ApiConsumes('multipart/form-data')
    @ApiOperation({ summary: 'Send email & attachments to all attendant of meeting.' })
    @ApiResponse({ status: 201, description: 'No error.' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Meeting not found' })
    @ApiBody({
        required: true,
        schema: {
            type: 'object',
            properties: {
                files: {
                    type: 'array',
                    items: {
                        type: 'string',
                        format: 'binary',
                    }
                },
                message: {
                    type: 'string'
                }
            }
        }
    })
    async sendMeetingMsg(
        @Request() req,
        @Body() payload: CreateMsgDto,
        @Query('meetId') meetId: string,
        @UploadedFiles(new ParseFilePipe({
            validators: [new MaxFileSizeValidator({ maxSize: 1000000 })]
        })) files: Array<Express.Multer.File>
    ) {
        const m = await this.infoService.getMeeting(req._id, meetId);
        const filenames = files.map(i => {
            return {
                path: join(process.env.STATIC_FILE_PATH, i.filename)
            }
        });
        for (const i of m.attendants) {
            const u = await this.userService.findById(i.toString());
            this.mailService.sendMsg(m.title, payload.message, u.email, filenames);
        }
    }
}
