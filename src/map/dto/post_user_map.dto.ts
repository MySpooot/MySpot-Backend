import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class PostUserMapBody {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MaxLength(24)
    readonly mapName: string;

    @ApiProperty()
    @IsBoolean()
    @IsNotEmpty()
    readonly isPrivate: boolean;
}
