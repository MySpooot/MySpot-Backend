import { Map, MapActive } from '../entities/map.entity';
import { UserAccessibleMap, UserAccessibleMapActive } from '../entities/user_accessible_map.entity';
import { Marker, MarkerActive } from '../entities/marker.entity';
import { User, UserActive } from '../entities/user.entity';
import { AuthUser, UserLevel } from '../lib/user_decorator';
import { MapMarkerLike, MapMarkerLikeActive } from '../entities/map_marker_like.entity';
import { MyLocation, MyLocationActive } from '../entities/my_location.entity';

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

/** GET /map//marker/location */
export const seedGetMyLocations = {
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
                    road_address: `road addr ${i + 1}`,
                    address: `address ${i + 1}`,
                    active: i % 10 > 0 ? MarkerActive.Active : MarkerActive.Inactive
                } as Marker)
        ),
    locations: (addressId: number[], name: string[], address: string[], roadAddress: string[], userId: number) =>
        [...new Array(20).keys()].map(
            i =>
                ({
                    name: name[i],
                    user_id: userId,
                    address_id: addressId[i],
                    address: address[i],
                    road_address: roadAddress[i],
                    active: i % 10 > 0 ? MyLocationActive.Active : MyLocationActive.Inactive
                } as MyLocation)
        )
};

/** POST /map//marker/location */
export const seedPostMyLocations = {
    maps: (userId: number) =>
        [
            {
                user_id: userId,
                name: 'map 1',
                is_private: false,
                active: MapActive.Active
            },
            {
                user_id: userId,
                name: 'map 2',
                is_private: false,
                active: MapActive.Active
            },
            {
                user_id: userId,
                name: 'map 3',
                is_private: false,
                active: MapActive.Active
            }
        ] as Map[],
    markers: (mapId: number[], userId: number) =>
        [
            {
                user_id: userId,
                map_id: mapId[0],
                name: 'map_name_1',
                latitude: '1',
                longitude: '1',
                like_count: 1,
                reply_count: 1,
                address_id: 1,
                active: MarkerActive.Active
            },
            {
                user_id: userId,
                map_id: mapId[1],
                name: 'map_name_2',
                latitude: '2',
                longitude: '2',
                like_count: 2,
                reply_count: 2,
                address_id: 2,
                active: MarkerActive.Active
            },
            {
                user_id: userId,
                map_id: mapId[2],
                name: 'map_name_3',
                latitude: '3',
                longitude: '3',
                like_count: 3,
                reply_count: 3,
                address_id: 3,
                active: MarkerActive.Active
            }
        ] as Marker[],
    locations: (addressId: number[], name: string[], userId: number) =>
        [
            // location이 존재하는데 inactive라면 active로 update 해준다.
            {
                name: name[0],
                user_id: userId,
                address_id: addressId[0],
                active: MyLocationActive.Inactive
            },
            // location이 존재하지만 active인 경우는 그냥 return한다.
            {
                name: name[1],
                user_id: userId,
                address_id: addressId[1],
                active: MyLocationActive.Active
            }
        ] as MyLocation[]
};

/** DELETE /map//marker/location */
export const seedDeleteMyLocation = {
    map: (userId: number) =>
        ({
            user_id: userId,
            name: 'map 1',
            is_private: false,
            active: MapActive.Active
        } as Map),
    marker: (mapId: number, userId: number) =>
        ({
            user_id: userId,
            map_id: mapId,
            name: 'map_name_1',
            latitude: '1',
            longitude: '1',
            like_count: 1,
            reply_count: 1,
            address_id: 1,
            active: MarkerActive.Active
        } as Marker),
    location: (addressId: number, name: string, userId: number) =>
        ({
            name: name,
            user_id: userId,
            address_id: addressId,
            active: MyLocationActive.Active
        } as MyLocation)
};
