import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Connection } from 'typeorm';

import { AuthUser } from '../lib/user_decorator';
import { PostMarkerReplyBody, PostMarkerReplyResponse } from './dto/post_map_marker_reply.dto';
import { Map, MapActive } from '../entities/map.entity';
import { MarkerService } from '../marker/marker.service';
import { MapMarkerReply, MapMarkerReplyActive } from '../entities/map_marker_reply.entity';
import { GetMarkerRepliesQuery, GetMarkerRepliesResponse } from './dto/get_marker_replies.dto';

@Injectable()
export class ReplyService {
    constructor(private readonly connection: Connection, private readonly markerService: MarkerService) {}

    async getMarkerReplies({ markerId, offset = 0, limit = 10 }: GetMarkerRepliesQuery) {
        const replies = await this.connection
            .getRepository(MapMarkerReply)
            .createQueryBuilder('map_marker_reply')
            .innerJoinAndSelect('map_marker_reply.user', 'user')
            .where('map_marker_reply.marker_id=:markerId AND map_marker_reply.active=:active', { markerId, active: MapMarkerReplyActive.Active })
            .skip(offset)
            .take(limit)
            .orderBy({ 'map_marker_reply.modified': 'DESC' })
            .getMany();

        return replies.map(GetMarkerRepliesResponse.from);
    }

    async insertMarkerReply({ userId }: AuthUser, { message, mapId, markerId }: PostMarkerReplyBody) {
        const map = await this.connection.getRepository(Map).findOne({ id: mapId, active: MapActive.Active });

        if (!map) throw new BadRequestException('Invalid Map Id');

        // (private map && !accessible) 인 경우 throw UnauthorizedException
        if (map.is_private && !(await this.markerService.getUserAccessible(userId, mapId))) throw new UnauthorizedException();

        const insertResult = await this.connection.getRepository(MapMarkerReply).insert({
            user_id: userId,
            map_id: mapId,
            marker_id: markerId,
            message: message.trim()
        });

        // insert된 댓글 재 조회
        const reply = await this.connection
            .getRepository(MapMarkerReply)
            .createQueryBuilder('map_marker_reply')
            .innerJoinAndSelect('map_marker_reply.user', 'user')
            .where('map_marker_reply.id=:id', { id: insertResult.identifiers[0].id })
            .getOne();

        return PostMarkerReplyResponse.from(reply);
    }
}
