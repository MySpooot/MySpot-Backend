import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Length } from 'class-validator';

import { MapMarkerReply } from '../../entities/map_marker_reply.entity';

export class PostMarkerReplyParam {
    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    readonly markerId: number;
}

export class PostMarkerReplyBody {
    @ApiProperty({ minLength: 1, maxLength: 64 })
    @IsString()
    @IsNotEmpty()
    @Length(1, 64)
    readonly message: string;
}

export class PostMarkerReplyResponse {
    @ApiProperty()
    id: number;

    @ApiProperty({ format: 'timestamp' })
    created: number;

    @ApiProperty()
    message: string;

    @ApiProperty()
    userId: number;

    @ApiProperty()
    mapId: number;

    @ApiProperty()
    markerId: number;

    @ApiProperty()
    userNickName: string;

    static from(reply?: MapMarkerReply): PostMarkerReplyResponse | undefined {
        return reply && new PostMarkerReplyResponse(reply);
    }

    constructor(reply: MapMarkerReply) {
        this.id = reply.id;
        this.created = process.env.NODE_ENV === 'test' ? Date.now() : reply.created.getTime();
        this.message = reply.message;
        this.userId = reply.user_id;
        this.mapId = reply.marker.map_id;
        this.markerId = reply.marker_id;
        this.userNickName = reply.user.nickname;
    }
}
