import { User, UserActive } from '../../src/entities/user.entity';
import { UserLevel } from '../../src/lib/user_decorator';
import { Map, MapActive } from '../../src/entities/map.entity';
import { UserAccessibleMap, UserAccessibleMapActive } from '../../src/entities/user_accessible_map.entity';
import { MarkerActive, Marker } from '../../src/entities/marker.entity';
import { MapMarkerReply, MapMarkerReplyActive } from '../../src/entities/map_marker_reply.entity';

export const seedUsers = (): Partial<User>[] =>
    [...new Array(10).keys()].map(i => ({
        nickname: `user_${i + 1}`,
        sns_id: i + 1,
        level: UserLevel.User,
        active: UserActive.Active
    }));

export const seedE2eData = {
    map: (userId: number): Partial<Map> => ({
        user_id: userId,
        name: 'map_name',
        is_private: true,
        code: '1234',
        active: MapActive.Active
    }),
    accessible: (mapId: number, userId: number): Partial<UserAccessibleMap> => ({
        user_id: userId,
        map_id: mapId,
        active: UserAccessibleMapActive.Active
    }),
    marker: (mapId: number, userId: number): Partial<Marker> => ({
        user_id: userId,
        map_id: mapId,
        name: 'marker_name',
        latitude: '1234',
        longitude: '5678',
        like_count: 0,
        reply_count: 1,
        address_id: 12312,
        active: MarkerActive.Active
    }),
    replies: (markerId: number, userId: number): Partial<MapMarkerReply>[] =>
        [...new Array(15).keys()].map(i => ({
            user_id: userId,
            marker_id: markerId,
            message: `message_${i + 1}`,
            active: MapMarkerReplyActive.Active
        }))
};
