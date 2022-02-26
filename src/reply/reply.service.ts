import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Connection } from 'typeorm';

import { AuthUser } from '../lib/user_decorator';
import { PostMarkerReplyBody, PostMarkerReplyParam, PostMarkerReplyResponse } from './dto/post_marker_reply.dto';
import { Map, MapActive } from '../entities/map.entity';
import { MarkerService } from '../marker/marker.service';
import { MapMarkerReply, MapMarkerReplyActive } from '../entities/map_marker_reply.entity';
import { GetMarkerRepliesParam, GetMarkerRepliesQuery, GetMarkerRepliesResponse } from './dto/get_marker_replies.dto';
import { DeleteMarkerReplyParam } from './dto/delete_marker_reply.dto';
import { PutMarkerReplyBody, PutMarkerReplyParam, PutMarkerReplyResponse } from './dto/put_marker_reply.dto';
import { Marker, MarkerActive } from '../entities/marker.entity';

@Injectable()
export class ReplyService {
    constructor(private readonly connection: Connection, private readonly markerService: MarkerService) {}

    async getMarkerReplies({ markerId }: GetMarkerRepliesParam, { offset = 0, limit = 10 }: GetMarkerRepliesQuery) {
        const replies = await this.connection
            .getRepository(MapMarkerReply)
            .createQueryBuilder('map_marker_reply')
            .innerJoinAndSelect('map_marker_reply.marker', 'marker')
            .innerJoinAndSelect('map_marker_reply.user', 'user')
            .where('map_marker_reply.marker_id=:markerId AND map_marker_reply.active=:active', { markerId, active: MapMarkerReplyActive.Active })
            .skip(offset)
            .take(limit)
            .orderBy({ 'map_marker_reply.created': 'DESC' })
            .getMany();

        return replies.map(GetMarkerRepliesResponse.from);
    }

    async insertMarkerReply({ userId }: AuthUser, { markerId }: PostMarkerReplyParam, { message }: PostMarkerReplyBody) {
        const marker = await this.connection.getRepository(Marker).findOne({ id: markerId, active: MarkerActive.Active });

        if (!marker) throw new BadRequestException('Invalid Marker Id');

        const map = await this.connection.getRepository(Map).findOne({ id: marker.map_id, active: MapActive.Active });

        if (!map) throw new BadRequestException('Invalid Map Id');

        // (private map && !accessible) 인 경우 throw UnauthorizedException
        if (map.is_private && !(await this.markerService.getUserAccessible(userId, map.id))) throw new UnauthorizedException();

        const insertResult = await this.connection.getRepository(MapMarkerReply).insert({
            user_id: userId,
            marker_id: markerId,
            message: message.trim()
        });

        // insert된 댓글 재 조회
        const reply = await this.connection
            .getRepository(MapMarkerReply)
            .createQueryBuilder('map_marker_reply')
            .innerJoinAndSelect('map_marker_reply.marker', 'marker')
            .innerJoinAndSelect('map_marker_reply.user', 'user')
            .where('map_marker_reply.id=:id', { id: insertResult.identifiers[0].id })
            .getOne();

        return PostMarkerReplyResponse.from(reply);
    }

    async updateMarkerReply({ userId }: AuthUser, { replyId }: PutMarkerReplyParam, { message }: PutMarkerReplyBody) {
        const reply = await this.connection.getRepository(MapMarkerReply).findOne({ id: replyId, active: MapMarkerReplyActive.Active });

        if (reply.user_id !== userId) throw new UnauthorizedException();

        await this.connection.getRepository(MapMarkerReply).update({ id: replyId }, { message });

        const updateReply = await this.connection
            .getRepository(MapMarkerReply)
            .createQueryBuilder('map_marker_reply')
            .innerJoinAndSelect('map_marker_reply.user', 'user')
            .where('map_marker_reply.id=:replyId AND map_marker_reply.active=:active', { replyId, active: MapMarkerReplyActive.Active })
            .getOne();

        return PutMarkerReplyResponse.from(updateReply);
    }

    async deleteMarkerReply({ userId }: AuthUser, { replyId }: DeleteMarkerReplyParam) {
        const reply = await this.connection.getRepository(MapMarkerReply).findOne({ id: replyId, active: MapMarkerReplyActive.Active });

        if (reply.user_id !== userId) throw new UnauthorizedException();

        await this.connection.getRepository(MapMarkerReply).update({ id: replyId }, { active: MapMarkerReplyActive.Inactive });
    }
}
