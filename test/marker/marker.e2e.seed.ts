import { User, UserActive } from '../../src/entities/user.entity';
import { UserLevel } from '../../src/lib/user_decorator';
import { Map, MapActive } from '../../src/entities/map.entity';
import { UserAccessibleMap, UserAccessibleMapActive } from '../../src/entities/user_accessible_map.entity';
import { MarkerActive, Marker } from '../../src/entities/marker.entity';
import { MapMarkerLikeActive, MapMarkerLike } from '../../src/entities/map_marker_like.entity';
import { MyLocationActive, MyLocation } from '../../src/entities/my_location.entity';

export const seedUsers = (): Partial<User>[] =>
    [...new Array(10).keys()].map(i => ({
        nickname: `user_${i + 1}`,
        sns_id: i + 1,
        level: UserLevel.User,
        active: UserActive.Active
    }));

export const seedE2eData = {
    maps: (userId: number): Partial<Map>[] =>
        [...new Array(20).keys()].map(i => ({
            user_id: userId,
            name: `map_name_${i + 1}`,
            is_private: i % 3 > 0 ? true : false,
            code: i % 3 > 0 ? '1234' : undefined,
            active: MapActive.Active
        })),
    accessible: (mapId: number[], userId: number): Partial<UserAccessibleMap>[] =>
        [...new Array(20).keys()].map(i => ({
            user_id: userId,
            map_id: mapId[i],
            active: UserAccessibleMapActive.Active
        })),
    markers: (mapId: number[], userId: number): Partial<Marker>[] =>
        [...new Array(20).keys()].map(i => ({
            user_id: userId,
            map_id: mapId[i],
            name: `map_name_${i + 1}`,
            latitude: `${i + 1}`,
            longitude: `${i + 1}`,
            like_count: i + 1,
            reply_count: i + 1,
            address_id: 123123 + i,
            active: MarkerActive.Active
        })),
    like: (markerId: number, userId: number): Partial<MapMarkerLike> => ({
        user_id: userId,
        marker_id: markerId,
        active: MapMarkerLikeActive.Active
    }),
    locations: (addressId: number[], name: string[], address: string[], roadAddress: string[], userId: number): Partial<MyLocation>[] =>
        [...new Array(20).keys()].map(i => ({
            name: name[i],
            user_id: userId,
            address_id: addressId[i],
            address: address[i],
            road_address: roadAddress[i],
            active: MyLocationActive.Active
        }))
};
