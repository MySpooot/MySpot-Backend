import { IsNotEmpty, IsNumber } from 'class-validator';

import { Map } from '../../entities/map.entity';

export class GetMapCodeParam {
    @IsNumber()
    @IsNotEmpty()
    readonly mapId: number;
}

export class GetMapCodeResponse {
    mapId: number;
    code: string; //맵 코드

    static from(map: Map): GetMapCodeResponse {
        return new GetMapCodeResponse(map);
    }

    constructor(map: Map) {
        this.mapId = map.id;
        this.code = map.code;
    }
}
