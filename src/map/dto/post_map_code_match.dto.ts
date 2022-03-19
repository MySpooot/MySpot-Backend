import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class PostMapCodeMatchParam {
    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    readonly mapId: number;
}

export class PostMapCodeMatchHeaders {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    readonly authorization?: string;
}

export class PostMapCodeMatchBody {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    readonly code: string;
}
