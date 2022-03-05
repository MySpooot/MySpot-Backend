import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

import { User } from '../../entities/user.entity';

export class PutUserNicknameBody {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MaxLength(12)
    readonly nickname: string;
}

export class PutUserNicknameResponse {
    @ApiProperty()
    id: number;

    @ApiProperty()
    nickname: string;

    @ApiProperty({ required: false })
    thumbnail?: string;

    static from(user: User): PutUserNicknameResponse {
        return new PutUserNicknameResponse(user);
    }

    constructor(user: User) {
        this.id = user.id;
        this.nickname = user.nickname;
        this.thumbnail = user.thumbnail;
    }
}
