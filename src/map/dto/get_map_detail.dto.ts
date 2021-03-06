import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

import { Map } from '../../entities/map.entity';

export class GetMapDetailParam {
    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    readonly mapId: number;
}

export class GetMapDetailHeaders {
    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    readonly authorization?: string;
}

export class GetMapDetailResponse {
    @ApiProperty()
    isOwner: boolean; // 맵을 만든 유저인지

    @ApiProperty()
    mapId: number;

    @ApiProperty()
    isPrivate: boolean;

    @ApiProperty()
    mapName: string;

    @ApiProperty()
    accessible: boolean;

    @ApiProperty()
    isFavorite: boolean;

    static from(map?: Map): GetMapDetailResponse | undefined {
        return map && new GetMapDetailResponse(map);
    }

    constructor(map: Map) {
        this.isOwner = map.user_id === map.accessible[0]?.user_id;
        this.mapId = map.id;
        this.isPrivate = map.is_private;
        this.mapName = map.name;
        this.accessible = map.is_private === true ? !!map.accessible[0] : true;
        this.isFavorite = !!map.favoriteMap[0] ?? false;
    }
}
