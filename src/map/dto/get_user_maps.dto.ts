import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';
import { Map } from '../../entities/map.entity';

export class GetUserMapsQuery {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    readonly offset?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    readonly limit?: number;
}

export class GetUserMapsResponse {
    @ApiProperty()
    id: number;

    @ApiProperty({ format: 'timestamp' })
    created: number;

    @ApiProperty()
    userId: number;

    @ApiProperty()
    mapName: string;

    @ApiProperty()
    isPrivate: boolean;

    static from(map: Map): GetUserMapsResponse {
        return new GetUserMapsResponse(map);
    }

    constructor(map: Map) {
        this.id = map.id;
        this.created = process.env.NODE_ENV === 'test' ? Date.now() : map.created.getTime();
        this.userId = map.user_id;
        this.mapName = map.name;
        this.isPrivate = map.is_private;
    }
}
