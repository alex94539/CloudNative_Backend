import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsDateString, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateMsgDto {
    @IsString()
    @ApiProperty()
    readonly message: string;
}
