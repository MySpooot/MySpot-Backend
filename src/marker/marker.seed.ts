import { Map, MapActive } from '../entities/map.entity';
import { UserAccessibleMap, UserAccessibleMapActive } from '../entities/user_accessible_map.entity';
import { Marker, MarkerActive } from '../entities/marker.entity';
import { User, UserActive } from '../entities/user.entity';
import { AuthUser, UserLevel } from '../lib/user_decorator';
import { MapMarkerLike, MapMarkerLikeActive } from '../entities/map_marker_like.entity';

export const seedUsers = () =>
    [...new Array(50).keys()].map(
        i =>
            ({
                nickname: `user_${i}`,
                sns_id: i + 1,
                level: UserLevel.User,
                active: UserActive.Active
            } as User)
    );

export const seedMe = () =>
    [...new Array(50).keys()].map(
        i =>
            ({
                userId: i + 1,
                userLevel: UserLevel.User
            } as AuthUser)
    );

/** GET /map/:mapId/marker */
export const seedGetMarkers = {
    maps: (userId: number) =>
        [...new Array(20).keys()].map(
            i =>
                ({
                    user_id: userId,
                    name: `map_name_${i + 1}`,
                    is_private: i % 3 > 0 ? true : false,
                    code: i % 3 > 0 ? '1234' : undefined,
                    active: i % 10 > 0 ? MapActive.Active : MapActive.Inactive
                } as Map)
        ),
    accessible: (mapId: number[], userId: number) =>
        [...new Array(20).keys()].map(
            i =>
                ({
                    user_id: userId,
                    map_id: mapId[i],
                    active: i % 10 > 0 ? UserAccessibleMapActive.Active : UserAccessibleMapActive.Inactive
                } as UserAccessibleMap)
        ),
    markers: (mapId: number[], userId: number) =>
        [...new Array(20).keys()].map(
            i =>
                ({
                    user_id: userId,
                    map_id: i % 10 > 0 ? mapId[0] : mapId[1],
                    name: `map_name_${i + 1}`,
                    latitude: `${i + 1}`,
                    longitude: `${i + 1}`,
                    like_count: i + 1,
                    reply_count: i + 1,
                    address_id: 123123 + i,
                    active: i % 10 > 0 ? MarkerActive.Active : MarkerActive.Inactive
                } as Marker)
        )
};

/** POST /map/:mapId/marker */
export const seedPostMarker = {
    maps: (userId: number) =>
        ({
            user_id: userId,
            name: `map`,
            is_private: true,
            code: '1234',
            active: MapActive.Active
        } as Map),

    accessible: (mapId: number, userId: number) =>
        ({
            user_id: userId,
            map_id: mapId,
            active: UserAccessibleMapActive.Active
        } as UserAccessibleMap),
    marker: (mapId: number, userId: number) =>
        ({
            user_id: userId,
            map_id: mapId,
            name: 'map_name',
            latitude: '123123',
            longitude: '123123',
            like_count: 0,
            reply_count: 0,
            address_id: 9999,
            active: MarkerActive.Active
        } as Marker)
};

/** DELETE /map/:mapId/marker */
export const seedDeleteMarker = {
    maps: (userId: number) =>
        ({
            user_id: userId,
            name: `map`,
            is_private: true,
            code: '1234',
            active: MapActive.Active
        } as Map),

    accessible: (mapId: number, userId: number) =>
        ({
            user_id: userId,
            map_id: mapId,
            active: UserAccessibleMapActive.Active
        } as UserAccessibleMap),
    marker: (mapId: number, userId: number) =>
        ({
            user_id: userId,
            map_id: mapId,
            name: 'map_name',
            latitude: '123123',
            longitude: '123123',
            like_count: 0,
            reply_count: 0,
            address_id: 9999,
            active: MarkerActive.Active
        } as Marker)
};

/** POST /map/:mapId/marker/like */
export const seedPostMarkerLike = {
    maps: (userId: number) =>
        ({
            user_id: userId,
            name: `map`,
            is_private: true,
            code: '1234',
            active: MapActive.Active
        } as Map),

    accessible: (mapId: number, userId: number) =>
        ({
            user_id: userId,
            map_id: mapId,
            active: UserAccessibleMapActive.Active
        } as UserAccessibleMap),
    marker: (mapId: number, userId: number) =>
        ({
            user_id: userId,
            map_id: mapId,
            name: 'map_name',
            latitude: '123123',
            longitude: '123123',
            like_count: 0,
            reply_count: 0,
            address_id: 9999,
            active: MarkerActive.Active
        } as Marker)
};

/** DELETE /map/:mapId/marker/like */
export const seedDeleteMarkerLike = {
    maps: (userId: number) =>
        ({
            user_id: userId,
            name: `map`,
            is_private: true,
            code: '1234',
            active: MapActive.Active
        } as Map),

    accessible: (mapId: number, userId: number) =>
        ({
            user_id: userId,
            map_id: mapId,
            active: UserAccessibleMapActive.Active
        } as UserAccessibleMap),
    marker: (mapId: number, userId: number) =>
        ({
            user_id: userId,
            map_id: mapId,
            name: 'map_name',
            latitude: '123123',
            longitude: '123123',
            like_count: 0,
            reply_count: 0,
            address_id: 9999,
            active: MarkerActive.Active
        } as Marker),
    like: (markerId: number, userId: number) =>
        ({
            user_id: userId,
            marker_id: markerId,
            active: MapMarkerLikeActive.Active
        } as MapMarkerLike)
};
