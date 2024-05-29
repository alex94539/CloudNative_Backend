import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateRoomDto {
    @ApiProperty({ required: true })
    @IsString()
    name: string;

    @ApiProperty({ required: true })
    @IsString()
    building: string;

    @ApiProperty({ required: true })
    @IsNumber()
    capacity: number;

    @ApiProperty({ required: true })
    @IsNumber()
    area: number;

    @ApiProperty({ required: true })
    @IsNumber()
    eating: boolean
}

export class UpdateRoomDto extends PartialType(CreateRoomDto) {}