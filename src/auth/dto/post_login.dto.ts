import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class PostLoginBody {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    readonly code: string;
}

export class PostLoginHeaders {
    @ApiProperty()
    @IsNotEmpty()
    @IsNotEmpty()
    readonly origin: string;
}

export class PostLoginResponse {
    @ApiProperty({ required: false })
    token?: string;

    @ApiProperty()
    id: number;

    @ApiProperty()
    nickname: string;

    @ApiProperty({ required: false })
    thumbnail?: string;

    @ApiProperty({ required: false })
    active?: number;
}
