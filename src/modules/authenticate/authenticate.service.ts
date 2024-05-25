import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { sha256 } from 'js-sha256';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthenticateService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService) {
    }

    async login(
        username: string,
        password: string
    ): Promise<{ token: string }> {
        const user = await this.userService.findOne(username);
        if (user?.password !== sha256(password)) {
            throw new UnauthorizedException();
        }
        const payload = { role: user.role, username: user.username };
        return {
            token: await this.jwtService.signAsync(payload),
        };
    }
}
