import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from 'src/schemas/User.schema';

@ApiBearerAuth("token")
@ApiTags('user')
@Controller('user')
export class UserController {
    constructor(private userService: UserService) { }

    @Post('newUser')
    @ApiOperation({ summary: 'Create system user.' })
    @ApiResponse({ status: 201, description: 'Created.' })
    @ApiResponse({ status: 400, description: 'Bad request.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @HttpCode(201)
    newUser(
        @Body() payload: User
    ) {
        return this.userService.newUser(payload);
    }
}
