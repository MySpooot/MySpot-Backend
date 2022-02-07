import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class GetMapCodeMatchParam {
    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    readonly mapId: number;
}
export class GetMapCodeMatchBody {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    readonly code: string;
}
