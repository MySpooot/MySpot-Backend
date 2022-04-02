import { User, UserActive } from '../entities/user.entity';
import { AuthUser, UserLevel } from '../lib/user_decorator';
import { Map, MapActive } from '../entities/map.entity';
import { UserAccessibleMap, UserAccessibleMapActive } from '../entities/user_accessible_map.entity';
import { Marker, MarkerActive } from '../entities/marker.entity';
import { MapMarkerReply, MapMarkerReplyActive } from '../entities/map_marker_reply.entity';

export const seedUsers = (): Partial<User>[] =>
    [...new Array(10).keys()].map(i => ({
        nickname: `user_${i + 1}`,
        sns_id: i + 1,
        level: UserLevel.User,
        active: UserActive.Active
    }));

export const seedMe = (): AuthUser[] =>
    [...new Array(10).keys()].map(i => ({
        userId: i + 1,
        userLevel: UserLevel.User
    }));

/** GET /map/marker/:markerId/replies */
export const seedGetMarkerReplies = {
    maps: (userId: number): Partial<Map> => ({
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
        name: 'map_name',
        latitude: '1234',
        longitude: '12345',
        like_count: 0,
        reply_count: 0,
        address_id: 123123,
        active: MarkerActive.Active
    }),
    replies: (markerId: number, userId: number): Partial<MapMarkerReply>[] =>
        [...new Array(15).keys()].map(i => ({
            user_id: userId,
            marker_id: markerId,
            message: `message_${i + 1}`,
            active: i % 10 > 0 ? MapMarkerReplyActive.Active : MapMarkerReplyActive.Inactive
        }))
};

/** POST /map/marker/:markerId/replies */
export const seedPostMarkerReplies = {
    maps: (userId: number): Partial<Map> => ({
        user_id: userId,
        name: 'map_name',
        is_private: true,
        code: '1234',
        active: MapActive.Active
    }),

    accessible: (mapId: number, userId: number[]): Partial<UserAccessibleMap>[] => [
        {
            user_id: userId[0],
            map_id: mapId,
            active: UserAccessibleMapActive.Active
        },
        {
            user_id: userId[1],
            map_id: mapId,
            active: UserAccessibleMapActive.Active
        }
    ],
    marker: (mapId: number, userId: number): Partial<Marker> => ({
        user_id: userId,
        map_id: mapId,
        name: 'map_name',
        latitude: '1234',
        longitude: '12345',
        like_count: 0,
        reply_count: 0,
        address_id: 123123,
        active: MarkerActive.Active
    }),
    replies: (markerId: number, userId: number): Partial<MapMarkerReply> => ({
        user_id: userId,
        marker_id: markerId,
        message: 'message-test',
        active: MapMarkerReplyActive.Inactive
    })
};

/** PUT /map/marker/:markerId/replies */
export const seedPutMarkerReplies = {
    maps: (userId: number): Partial<Map> => ({
        user_id: userId,
        name: 'map_name',
        is_private: true,
        code: '1234',
        active: MapActive.Active
    }),

    // @Todo 리팩토링 시 Partial<EntityType>으로 전부 변경
    accessible: (mapId: number, userId: number): Partial<UserAccessibleMap> => ({
        user_id: userId,
        map_id: mapId,
        active: UserAccessibleMapActive.Active
    }),
    marker: (mapId: number, userId: number): Partial<Marker> => ({
        user_id: userId,
        map_id: mapId,
        name: 'map_name',
        latitude: '1234',
        longitude: '12345',
        like_count: 0,
        reply_count: 0,
        address_id: 123123,
        active: MarkerActive.Active
    }),
    reply: (markerId: number, userId: number): Partial<MapMarkerReply> => ({
        user_id: userId,
        marker_id: markerId,
        message: 'message-test',
        active: MapMarkerReplyActive.Active
    })
};

/** DELETE  /map/marker/replies/:replyId */
export const seedDeleteMarkerReplies = {
    maps: (userId: number): Partial<Map> => ({
        user_id: userId,
        name: 'map_name',
        is_private: true,
        code: '1234',
        active: MapActive.Active
    }),

    // @Todo 리팩토링 시 Partial<EntityType>으로 전부 변경
    accessible: (mapId: number, userId: number): Partial<UserAccessibleMap> => ({
        user_id: userId,
        map_id: mapId,
        active: UserAccessibleMapActive.Active
    }),
    marker: (mapId: number, userId: number): Partial<Marker> => ({
        user_id: userId,
        map_id: mapId,
        name: 'map_name',
        latitude: '1234',
        longitude: '12345',
        like_count: 0,
        reply_count: 0,
        address_id: 123123,
        active: MarkerActive.Active
    }),
    reply: (markerId: number, userId: number): Partial<MapMarkerReply> => ({
        user_id: userId,
        marker_id: markerId,
        message: 'message-test',
        active: MapMarkerReplyActive.Active
    })
};
