import { IsNotEmpty, IsNumber } from 'class-validator';

import { Map } from '../../entities/map.entity';

export class GetMapDetailParam {
    @IsNumber()
    @IsNotEmpty()
    readonly mapId: number;
}

export class GetMapDetailResponse {
    isOwner: boolean; // 맵을 만든 유저인지
    userId: number; // 맵을 조회한 유저
    isPrivate: boolean;
    mapName: string;
    accessible: boolean;

    static from(map: Map): GetMapDetailResponse {
        return new GetMapDetailResponse(map);
    }

    constructor(map: Map) {
        this.isOwner = map.user_id === map.accessible[0]?.user_id;
        this.userId = map.accessible[0]?.user_id;
        this.isPrivate = map.is_private;
        this.mapName = map.name;
        this.accessible = !!map.accessible[0] ?? false;
    }
}
