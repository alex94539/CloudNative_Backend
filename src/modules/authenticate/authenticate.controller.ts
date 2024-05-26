import { Body, Controller, Get, HttpCode, Post, UnprocessableEntityException } from '@nestjs/common';
import { AuthenticateService } from './authenticate.service';

import { AuthGuard, Public } from './authenticate.guard';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Login } from 'src/interfaces/Login.interface';

@Controller('authenticate')
@ApiTags('authenticate')
export class AuthenticateController {
    constructor(private authService: AuthenticateService) { }

    @Public()
    @Post('login')
    @ApiOperation({ summary: 'login to system' })
    @ApiResponse({ status: 201, description: 'Authorized.' })
    @ApiResponse({ status: 400, description: 'Bad request.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @HttpCode(201)
    login(
        @Body() payload: Login
    ) {
        if (payload?.username && payload.password) {
            return this.authService.login(payload.username, payload.password);
        }
        else {
            throw new UnprocessableEntityException("missing required parameter");
        }
    }

    @Public()
    @Get('root')
    @ApiOperation({ summary: 'Get root credential' })
    @ApiResponse({ status: 200, description: 'No error.' })
    root() {
        return this.authService.root();
    }
}
