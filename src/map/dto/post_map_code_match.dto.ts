import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class PostMapCodeMatchParam {
    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    readonly mapId: number;
}
export class PostMapCodeMatchBody {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    readonly code: string;
}
