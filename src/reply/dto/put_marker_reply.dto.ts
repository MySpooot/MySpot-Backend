import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Length } from 'class-validator';

import { MapMarkerReply } from '../../entities/map_marker_reply.entity';

export class PutMarkerReplyParam {
    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    readonly replyId: number;
}

export class PutMarkerReplyBody {
    @ApiProperty({ minLength: 1, maxLength: 64 })
    @IsString()
    @IsNotEmpty()
    @Length(1, 64)
    readonly message: string;
}

export class PutMarkerReplyResponse {
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

    static from(reply?: MapMarkerReply): PutMarkerReplyResponse | undefined {
        return reply && new PutMarkerReplyResponse(reply);
    }

    constructor(reply: MapMarkerReply) {
        this.id = reply.id;
        this.created = reply.created.getTime();
        this.message = reply.message;
        this.userId = reply.user_id;
        this.mapId = reply.map_id;
        this.markerId = reply.marker_id;
        this.userNickName = reply.user.nickname;
    }
}
