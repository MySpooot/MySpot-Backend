import { IsNumber, IsOptional } from 'class-validator';
import { Map } from 'src/entities/map.entity';

export class GetUserMapsQuery {
    @IsNumber()
    @IsOptional()
    readonly offset?: number;

    @IsNumber()
    @IsOptional()
    readonly limit?: number;
}

export class GetUserMapsResponse {
    id: number;
    userId: number;
    mapName: string;
    isPrivate: boolean;

    static from(map: Map): GetUserMapsResponse {
        return new GetUserMapsResponse(map);
    }

    constructor(map: Map) {
        this.id = map.id;
        this.userId = map.user_id;
        this.mapName = map.name;
        this.isPrivate = map.is_private;
    }
}
