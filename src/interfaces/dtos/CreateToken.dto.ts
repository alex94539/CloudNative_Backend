import { ApiProperty } from '@nestjs/swagger';

export class CreateTokenDto {
    @ApiProperty()
    username: string;

    @ApiProperty()
    password: string;
}
