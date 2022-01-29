import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Connection, In } from 'typeorm';

import { AuthUser } from '../lib/user_decorator';
import { PostMarkerBody, PostMarkerParam } from './dto/post_marker.dto';
import { Map, MapActive } from '../entities/map.entity';
import { UserAccessibleMap, UserAccessibleMapActive } from '../entities/user_accessible_map.entity';
import { Marker, MarkerActive } from '../entities/marker.entity';
import { GetMarkersParam, GetMarkersResponse } from './dto/get_markers.dto';
import { DeleteMarkerParam } from './dto/delete_marker.dto';
import { MapMarkerLike, MapMarkerLikeActive } from '../entities/map_marker_like.entity';

@Injectable()
export class MarkerService {
    constructor(private readonly connection: Connection) {}

    async getMarkers({ userId }: AuthUser, { mapId }: GetMarkersParam) {
        const markers = await this.connection
            .getRepository(Marker)
            .find({ where: { map_id: mapId, active: MarkerActive.Active }, order: { id: 'DESC' } });

        console.log('marker', markers);

        // 유저가 좋아요 한 marker 조회
        const likes = await this.connection
            .getRepository(MapMarkerLike)
            .find({ marker_id: In(markers.map(marker => marker.id)), active: MapMarkerLikeActive.Active, user_id: userId });

        console.log('likes', likes);

        return markers.map(
            marker =>
                new GetMarkersResponse(
                    marker,
                    likes.some(({ marker_id }) => marker.id === marker_id)
                )
        );
    }

    async insertMarker(
        { userId }: AuthUser,
        { mapId }: PostMarkerParam,
        { locationName, latitude, longitude, addressId, address, openingHours }: PostMarkerBody
    ) {
        const map = await this.connection.getRepository(Map).findOne({ id: mapId, active: MapActive.Active });

        if (!map) throw new BadRequestException('Invalid Map Id');

        // (private map && !accessible) 인 경우 throw UnauthorizedException
        if (map.is_private && !(await this.getUserAccessible(userId, mapId))) throw new UnauthorizedException();

        await this.connection.getRepository(Marker).insert({
            user_id: userId,
            map_id: mapId,
            name: locationName,
            latitude,
            longitude,
            address_id: addressId,
            address,
            opening_hours: openingHours
        });
    }

    async deleteMarker({ userId }: AuthUser, { markerId }: DeleteMarkerParam) {
        const marker = await this.connection.getRepository(Marker).findOne({ id: markerId });

        if (!marker) throw new BadRequestException('Invalid Marker Id');

        if (userId !== marker.user_id) throw new UnauthorizedException();

        await this.connection.getRepository(Marker).update({ id: markerId }, { active: MarkerActive.Inactive });
    }

    // user의 권한 검증, insert marker에서 사용한다.
    async getUserAccessible(userId: number, mapId: number) {
        return await this.connection
            .getRepository(UserAccessibleMap)
            .findOne({ map_id: mapId, user_id: userId, active: UserAccessibleMapActive.Active });
    }
}
