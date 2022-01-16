import { IsNumber, IsOptional } from 'class-validator';

import { UserFavoriteMap } from '../../entities/user_favorite_map.entity';

export class GetUserFavoriteMapsQuery {
    @IsNumber()
    @IsOptional()
    readonly offset?: number;

    @IsNumber()
    @IsOptional()
    readonly limit?: number;
}

export class GetUserFavoriteMapsResponse {
    id: number;
    userId: number;
    mapName: string;
    isPrivate: boolean;

    static from(favoriteMap: UserFavoriteMap): GetUserFavoriteMapsResponse {
        return new GetUserFavoriteMapsResponse(favoriteMap);
    }

    constructor(favoriteMap: UserFavoriteMap) {
        this.id = favoriteMap.id;
        this.userId = favoriteMap.user_id;
        this.mapName = favoriteMap.map.name;
        this.isPrivate = favoriteMap.map.is_private;
    }
}
