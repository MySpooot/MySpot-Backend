import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Connection } from 'typeorm';

import { AuthUser } from '../lib/user_decorator';
import { PostMarkerBody, PostMarkerParam } from './dto/post_marker.dto';
import { Map, MapActive } from '../entities/map.entity';
import { UserAccessibleMap, UserAccessibleMapActive } from '../entities/user_accessible_map.entity';
import { Marker, MarkerActive } from '../entities/marker.entity';
import { GetMarkersParam, GetMarkersResponse } from './dto/get_markers.dto';
import { DeleteMarkerParam } from './dto/delete_marker.dto';

@Injectable()
export class MarkerService {
    constructor(private readonly connection: Connection) {}

    async getMarkers({ mapId }: GetMarkersParam) {
        const markers = await this.connection
            .getRepository(Marker)
            .find({ where: { map_id: mapId, active: MarkerActive.Active }, order: { id: 'DESC' } });

        return markers.map(GetMarkersResponse.from);
    }

    async insertMarker(
        { userId }: AuthUser,
        { mapId }: PostMarkerParam,
        { locationName, latitude, longitude, kakaoAddressId, kakaoAddress, kakaoOpeningHours }: PostMarkerBody
    ) {
        const map = await this.connection.getRepository(Map).findOne({ id: mapId, active: MapActive.Active });

        if (!map) throw new BadRequestException('Invalid Map Id');

        // (private map && !accessible) 인 경우 throw BadRequestException
        if (map.is_private && !(await this.getUserAccessible(userId, mapId))) throw new BadRequestException('No Accessible');

        await this.connection.getRepository(Marker).insert({
            user_id: userId,
            map_id: mapId,
            name: locationName,
            latitude,
            longitude,
            kakao_address_id: kakaoAddressId,
            kakao_address: kakaoAddress,
            kakao_opening_hours: kakaoOpeningHours
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
