import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';
import { UserActive } from '../../entities/user.entity';

export class PutUserParam {
    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    readonly userId: number;
}

export class PutUserBody {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MaxLength(12)
    readonly nickname: string;
}

export class PutUserResponse {
    @ApiProperty()
    token: string;

    @ApiProperty()
    id: number;

    @ApiProperty()
    nickname: string;

    @ApiProperty()
    thumbnail: string;

    @ApiProperty({ enum: UserActive })
    active: number;
}
