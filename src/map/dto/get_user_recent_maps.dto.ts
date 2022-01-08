import { IsNumber, IsOptional } from 'class-validator';

import { UserRecentMap } from 'src/entities/user_recent_map.entity';

export class GetUserRecentMapsQuery {
    @IsNumber()
    @IsOptional()
    readonly offset?: number;

    @IsNumber()
    @IsOptional()
    readonly limit?: number;
}

export class GetUserRecentMapsResponse {
    id: number;
    userId: number;
    mapName: string;

    static from(recentMap: UserRecentMap): GetUserRecentMapsResponse {
        return new GetUserRecentMapsResponse(recentMap);
    }

    constructor(recentMap: UserRecentMap) {
        this.id = recentMap.id;
        this.userId = recentMap.user_id;
        this.mapName = recentMap.map.name;
    }
}
