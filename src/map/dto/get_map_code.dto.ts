import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

import { Map } from '../../entities/map.entity';

export class GetMapCodeParam {
    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    readonly mapId: number;
}

export class GetMapCodeResponse {
    @ApiProperty()
    mapId: number;

    @ApiProperty()
    code: string; //맵 코드

    // 조회할 떄 값이 없으면 에러방지(undefined처리)
    static from(map?: Map): GetMapCodeResponse | undefined {
        return map && new GetMapCodeResponse(map);
    }

    constructor(map: Map) {
        this.mapId = map.id;
        this.code = map.code;
    }
}
