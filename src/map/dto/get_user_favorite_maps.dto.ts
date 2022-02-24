import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

import { UserFavoriteMap } from '../../entities/user_favorite_map.entity';

export class GetUserFavoriteMapsQuery {
    @ApiProperty({ required: false })
    @IsNumber()
    @IsOptional()
    readonly offset?: number;

    @ApiProperty({ required: false })
    @IsNumber()
    @IsOptional()
    readonly limit?: number;
}

export class GetUserFavoriteMapsResponse {
    @ApiProperty()
    id: number;

    @ApiProperty()
    mapId: number;

    @ApiProperty({ format: 'timestamp' })
    created: number;

    @ApiProperty()
    userId: number;

    @ApiProperty()
    mapName: string;

    @ApiProperty()
    isPrivate: boolean;

    static from(favoriteMap: UserFavoriteMap): GetUserFavoriteMapsResponse {
        return new GetUserFavoriteMapsResponse(favoriteMap);
    }

    constructor(favoriteMap: UserFavoriteMap) {
        this.id = favoriteMap.id;
        this.mapId = favoriteMap.map_id;
        this.created = favoriteMap.created.getTime();
        this.userId = favoriteMap.user_id;
        this.mapName = favoriteMap.map.name;
        this.isPrivate = favoriteMap.map.is_private;
    }
}
