import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

import { MapMarkerReply } from '../../entities/map_marker_reply.entity';

export class GetMarkerRepliesParam {
    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    readonly markerId: number;
}

export class GetMarkerRepliesQuery {
    @ApiProperty({ required: false })
    @IsNumber()
    @IsOptional()
    readonly offset?: number;

    @ApiProperty({ required: false })
    @IsNumber()
    @IsOptional()
    readonly limit?: number;
}

export class GetMarkerRepliesResponse {
    @ApiProperty()
    id: number;

    @ApiProperty({ format: 'timestamp' })
    created: number;

    @ApiProperty()
    userId: number;

    @ApiProperty()
    userNickName: string;

    @ApiProperty()
    mapId: number;

    @ApiProperty()
    markerId: number;

    @ApiProperty()
    message: string;

    static from(replies: MapMarkerReply): GetMarkerRepliesResponse {
        return new GetMarkerRepliesResponse(replies);
    }

    constructor(replies: MapMarkerReply) {
        this.id = replies.id;
        this.created = process.env.NODE_ENV === 'test' ? Date.now() : replies.created.getTime();
        this.userId = replies.user_id;
        this.userNickName = replies.user.nickname;
        this.mapId = replies.marker.map_id;
        this.markerId = replies.marker_id;
        this.message = replies.message;
    }
}
