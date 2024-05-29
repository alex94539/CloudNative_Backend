import { Body, Controller, Get, HttpCode, Post, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from 'src/interfaces/schemas/User.schema';

@ApiBearerAuth("token")
@ApiTags('user')
@Controller('user')
export class UserController {
    constructor(private userService: UserService) { }

    @Get('users')
    @ApiOperation({ summary: 'Get user list' })
    @ApiResponse({ status: 200, description: 'No error.' })
    getUsers(@Query() key: String) {

    }

    @Get('user')
    getUser() {

    }

    @Post('user')
    @ApiOperation({ summary: 'Create system user.' })
    @ApiResponse({ status: 201, description: 'Created.' })
    @ApiResponse({ status: 400, description: 'Bad request.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @HttpCode(201)
    postUser(
        @Body() payload: User
    ) {
        return this.userService.newUser(payload);
    }

}
