import { IsNumber, IsOptional } from 'class-validator';
import { IsMapPublic, Map } from 'src/entities/map.entity';

export class GetMyMapsQuery {
    @IsNumber()
    @IsOptional()
    readonly offset?: number;

    @IsNumber()
    @IsOptional()
    readonly limit?: number;
}

export class GetMyMapsResponse {
    id: number;
    userId: number;
    mapName: string;
    isPublic: boolean;

    static from(map: Map): GetMyMapsResponse {
        return new GetMyMapsResponse(map);
    }

    constructor(map: Map) {
        this.id = map.id;
        this.userId = map.user_id;
        this.mapName = map.name;
        this.isPublic = map.is_public === IsMapPublic.Public;
    }
}
