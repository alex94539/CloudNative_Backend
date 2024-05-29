import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsDateString, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateMeetingDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    readonly title: string;

    @IsString()
    @ApiProperty()
    readonly desc: string;

    @IsNotEmpty()
    @ApiProperty()
    readonly attendants: string[];

    @IsNumber({}, { each: true })
    @ApiProperty()
    readonly timeSlot: number[];

    @IsDateString()
    @IsNotEmpty()
    @ApiProperty()
    readonly rDate: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    readonly userId: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    readonly roomId: string;
}

export class UpdateMeetingDto extends PartialType(CreateMeetingDto) { };
