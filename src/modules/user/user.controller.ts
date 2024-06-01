import { Body, Controller, Get, HttpCode, Post, Query, Request, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from 'src/interfaces/schemas/User.schema';
import { CreateUserDto } from 'src/interfaces/dtos/CreateUser.dto';

@ApiBearerAuth("token")
@ApiTags('user')
@Controller('user')
export class UserController {
    constructor(private userService: UserService) { }

    @Get('users')
    @ApiQuery({
        name: "key",
        type: String,
        required: false,
    })
    @ApiOperation({ summary: 'Get user list' })
    @ApiResponse({ status: 200, description: 'No error.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    getUsers(
        @Query('key') key?: string
    ) {
        key = key ? key : '.';
        return this.userService.findAll(key);
    }

    @Get('user')
    @ApiOperation({ summary: 'Get user information.' })
    @ApiResponse({ status: 200, description: 'No error.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiResponse({ status: 404, description: 'Not found.' })
    @ApiResponse({ status: 422, description: 'Missing attribute.' })
    getUser(
        @Request() req,
        @Query('userId') uId: string
    ) {
        if (!uId) { throw new UnprocessableEntityException('Missing userId.'); }
        if (req.role !== 'Admin' && uId !== req._id) {
            throw new UnauthorizedException('You have to be admin to get this user info.');
        }
        return this.userService.findById(uId);
    }

    @Post('user')
    @ApiOperation({ summary: 'Create system user.' })
    @ApiResponse({ status: 201, description: 'Created.' })
    @ApiResponse({ status: 400, description: 'Bad request.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @HttpCode(201)
    postUser(
        @Body() payload: CreateUserDto
    ) {
        return this.userService.newUser(payload);
    }

}
