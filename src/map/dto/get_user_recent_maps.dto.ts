import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

import { UserRecentMap } from '../../entities/user_recent_map.entity';

export class GetUserRecentMapsQuery {
    @ApiProperty({ required: false })
    @IsNumber()
    @IsOptional()
    readonly offset?: number;

    @ApiProperty({ required: false })
    @IsNumber()
    @IsOptional()
    readonly limit?: number;
}

export class GetUserRecentMapsResponse {
    @ApiProperty()
    id: number;

    @ApiProperty()
    userId: number;

    @ApiProperty()
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
