import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString, MaxLength } from 'class-validator';

import { Map } from '../../entities/map.entity';

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

export class PostUserMapResponse {
    @ApiProperty()
    id: number;

    static from(map: Map) {
        return new PostUserMapResponse(map);
    }

    constructor(map: Map) {
        this.id = map.id;
    }
}
