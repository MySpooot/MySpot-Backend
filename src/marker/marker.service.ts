import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Connection, In } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { AuthUser } from '../lib/user_decorator';
import { PostMarkerBody, PostMarkerParam, PostMarkerResponse } from './dto/post_marker.dto';
import { Map, MapActive } from '../entities/map.entity';
import { UserAccessibleMap, UserAccessibleMapActive } from '../entities/user_accessible_map.entity';
import { Marker, MarkerActive } from '../entities/marker.entity';
import { GetMarkersHeaders, GetMarkersParam, GetMarkersResponse } from './dto/get_markers.dto';
import { DeleteMarkerParam } from './dto/delete_marker.dto';
import { MapMarkerLike, MapMarkerLikeActive } from '../entities/map_marker_like.entity';
import { PostMarkerLikeParam } from './dto/post_marker_like.dto';
import { DeleteMarkerLikeParam } from './dto/delete_marker_like.dto';
import { MyLocation, MyLocationActive } from '../entities/my_location.entity';
import { PostMyLocationBody } from './dto/post_my_location.dto';
import { GetMyLocationsQuery, GetMyLocationsResponse } from './dto/get_my_locations.dto';
import { DeleteMyLocationParam } from './dto/delete_my_location.dto';

@Injectable()
export class MarkerService {
    constructor(private readonly connection: Connection, private readonly jwtService: JwtService, private readonly configService: ConfigService) {}

    // get markers
    async getMarkers({ authorization }: GetMarkersHeaders, { mapId }: GetMarkersParam) {
        const markers = await this.connection
            .getRepository(Marker)
            .find({ where: { map_id: mapId, active: MarkerActive.Active }, order: { id: 'DESC' } });

        let userId: number | undefined;

        try {
            // userId가 있는 경우 userId를 빼옴
            if (authorization) userId = await this.jwtService.verify(authorization, this.configService.get('jwt.secret')).userId;
        } catch (e) {
            console.error(e);
        }

        let likes: MapMarkerLike[];

        // 로그인 한 유저의 경우 유저가 좋아요 한 marker 조회
        if (markers.length > 0 && userId) {
            likes = await this.connection
                .getRepository(MapMarkerLike)
                .find({ marker_id: In(markers.map(marker => marker.id)), active: MapMarkerLikeActive.Active, user_id: userId });
        }

        let locations: MyLocation[];

        // 로그인 한 유저의 경우 유저가 저장한 location 조회
        if (markers.length > 0 && userId) {
            locations = await this.connection
                .getRepository(MyLocation)
                .find({ address_id: In(markers.map(marker => marker.address_id)), active: MyLocationActive.Active, user_id: userId });
        }

        // 비 로그인 유저면 isLike, isMyLocation이 모두 false
        return markers.map(
            marker =>
                new GetMarkersResponse(
                    marker,
                    likes?.some(({ marker_id }) => marker.id === marker_id),
                    locations?.some(({ address_id }) => marker.address_id === address_id)
                )
        );
    }

    // insert marker
    async insertMarker(
        { userId }: AuthUser,
        { mapId }: PostMarkerParam,
        { locationName, latitude, longitude, addressId, address, roadAddress }: PostMarkerBody
    ) {
        const map = await this.connection.getRepository(Map).findOne({ id: mapId, active: MapActive.Active });

        if (!map) throw new BadRequestException('Invalid Map Id');

        const marker = await this.connection.getRepository(Marker).findOne({ map_id: mapId, address_id: addressId, active: MarkerActive.Active });

        if (marker) throw new BadRequestException('Already Exist Marker');

        // (private map && !accessible) 인 경우 throw UnauthorizedException
        if (map.is_private && !(await this.getUserAccessible(userId, mapId))) throw new UnauthorizedException();

        const insertResult = await this.connection.getRepository(Marker).insert({
            user_id: userId,
            map_id: mapId,
            name: locationName,
            latitude,
            longitude,
            address_id: addressId,
            address,
            road_address: roadAddress
        });

        // insert된 marker 재 조회
        const insertedMarker = await this.connection.getRepository(Marker).findOne({ id: insertResult.identifiers[0].id });

        return new PostMarkerResponse(insertedMarker);
    }

    // delete marker
    async deleteMarker({ userId }: AuthUser, { markerId }: DeleteMarkerParam) {
        const marker = await this.connection.getRepository(Marker).findOne({ id: markerId });

        if (!marker) throw new BadRequestException('Invalid Marker Id');

        if (userId !== marker.user_id) throw new UnauthorizedException();

        await this.connection.getRepository(Marker).update({ id: markerId }, { active: MarkerActive.Inactive });
    }

    // insert marker like
    async insertMarkerLike({ userId }: AuthUser, { markerId }: PostMarkerLikeParam) {
        // 1. marker 조회
        const marker = await this.connection.getRepository(Marker).findOne({ id: markerId, active: MarkerActive.Active });

        // 2. marker가 없다면 throw
        if (!marker) throw new BadRequestException('Invalid Marker Id');

        // 3. 해당 marker의 map 조회
        const map = await this.connection.getRepository(Map).findOne({ id: marker.map_id, active: MapActive.Active });

        // 4. map이 없다면 throw
        if (!map) throw new BadRequestException('Invalid Map Id');

        // 5. map이 private이고 user의 권한이 없다면 throw (map에 권한이 없으면 map에 접근 자체가 불가능하지만 혹시 모르니 해당 로직 추가함)
        if (map.is_private && !(await this.getUserAccessible(userId, map.id))) throw new UnauthorizedException();

        // insert marker like
        await this.connection.getRepository(MapMarkerLike).insert({ user_id: userId, marker_id: markerId });
    }

    // delete marker like
    async deleteMarkerLike({ userId }: AuthUser, { markerId }: DeleteMarkerLikeParam) {
        // 1. marker like 조회
        const markerLike = await this.connection
            .getRepository(MapMarkerLike)
            .findOne({ user_id: userId, marker_id: markerId, active: MapMarkerLikeActive.Active });

        // 2. markerLike 없다면 throw
        if (!markerLike) throw new BadRequestException('Invalid Marker Like Id');

        // delete marker like
        await this.connection.getRepository(MapMarkerLike).update({ user_id: userId, marker_id: markerId }, { active: MapMarkerLikeActive.Inactive });
    }

    // get my locations
    async getMyLocations({ userId }: AuthUser, { offset = 0, limit = 6 }: GetMyLocationsQuery) {
        const locations = await this.connection
            .getRepository(MyLocation)
            .find({ where: { user_id: userId, active: MyLocationActive.Active }, skip: offset, take: limit, order: { modified: 'DESC' } });

        return locations.map(GetMyLocationsResponse.from);
    }

    // insert my location
    async insertMyLocation({ userId }: AuthUser, { locationName, addressId, address, roadAddress }: PostMyLocationBody) {
        const location = await this.connection.getRepository(MyLocation).findOne({ user_id: userId, address_id: addressId });

        // 이미 my location이 존재한다면
        if (location) {
            // 존재하는데 inactive라면 active로 update 해준다.
            if (location.active === MyLocationActive.Inactive)
                await this.connection
                    .getRepository(MyLocation)
                    .update({ user_id: userId, address_id: addressId }, { active: MyLocationActive.Active });
            // 존재하지만 active인 경우는 그냥 return한다.
            else return;
        } else {
            // 존재하지 않으면 insert를 해준다.
            await this.connection
                .getRepository(MyLocation)
                .insert({ name: locationName, user_id: userId, address_id: addressId, address, road_address: roadAddress });
        }
    }

    // delete my location
    async deleteMyLocation({ userId }: AuthUser, { addressId }: DeleteMyLocationParam) {
        const location = await this.connection
            .getRepository(MyLocation)
            .findOne({ user_id: userId, address_id: addressId, active: MyLocationActive.Active });

        if (!location) throw new BadRequestException('Invalid Location');

        await this.connection.getRepository(MyLocation).update({ user_id: userId, address_id: addressId }, { active: MyLocationActive.Inactive });
    }

    // user의 권한 검증
    async getUserAccessible(userId: number, mapId: number) {
        return await this.connection
            .getRepository(UserAccessibleMap)
            .findOne({ map_id: mapId, user_id: userId, active: UserAccessibleMapActive.Active });
    }
}
