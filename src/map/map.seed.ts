import { User, UserActive } from '../entities/user.entity';
import { AuthUser, UserLevel } from '../lib/user_decorator';
import { Map, MapActive } from '../entities/map.entity';
import { UserFavoriteMap, UserFavoriteMapActive } from '../entities/user_favorite_map.entity';
import { UserAccessibleMap, UserAccessibleMapActive } from '../entities/user_accessible_map.entity';
import { UserRecentMapActive, UserRecentMap } from '../entities/user_recent_map.entity';

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

/** GET /map */
export const seedGetUserMaps = {
    maps: (userId: number): Partial<Map>[] =>
        [...new Array(20).keys()].map(i => ({
            user_id: userId,
            name: `map_name_${i + 1}`,
            is_private: i % 3 > 0 ? true : false,
            code: i % 3 > 0 ? '1234' : undefined,
            active: i % 10 > 0 ? MapActive.Active : MapActive.Inactive
        })),
    accessible: (mapId: number[], userId: number): Partial<UserAccessibleMap>[] =>
        [...new Array(20).keys()].map(i => ({
            user_id: userId,
            map_id: mapId[i],
            active: i % 10 > 0 ? UserAccessibleMapActive.Active : UserAccessibleMapActive.Inactive
        }))
};

/** POST /map public map */
export const seedPostUserPublicMap = {
    maps: (userId: number): Partial<Map>[] =>
        [...new Array(5).keys()].map(i => ({
            user_id: userId,
            name: `map_name_${i + 1}`,
            is_private: i % 3 > 0 ? true : false,
            code: i % 3 > 0 ? '1234' : undefined,
            active: i % 10 > 0 ? MapActive.Active : MapActive.Inactive
        })),
    accessible: (mapId: number[], userId: number): Partial<UserAccessibleMap>[] =>
        [...new Array(5).keys()].map(i => ({
            user_id: userId,
            map_id: mapId[i],
            active: i % 10 > 0 ? UserAccessibleMapActive.Active : UserAccessibleMapActive.Inactive
        }))
};

/** POST /map private map */
export const seedPostUserPrivateMap = {
    maps: (userId: number): Partial<Map>[] =>
        [...new Array(5).keys()].map(i => ({
            user_id: userId,
            name: `map_name_${i + 1}`,
            is_private: i % 3 > 0 ? true : false,
            code: i % 3 > 0 ? '1234' : undefined,
            active: i % 10 > 0 ? MapActive.Active : MapActive.Inactive
        })),
    accessible: (mapId: number[], userId: number): Partial<UserAccessibleMap>[] =>
        [...new Array(5).keys()].map(i => ({
            user_id: userId,
            map_id: mapId[i],
            active: i % 10 > 0 ? UserAccessibleMapActive.Active : UserAccessibleMapActive.Inactive
        }))
};

// DELETE /map
export const seedDeleteUserMap = {
    map: (userId: number): Partial<Map> => ({
        user_id: userId,
        name: 'delete_map',
        is_private: false,
        active: MapActive.Active
    }),
    accessible: (mapId: number, userId: number): Partial<UserAccessibleMap> => ({
        user_id: userId,
        map_id: mapId,
        active: UserAccessibleMapActive.Active
    })
};

/** GET /map/recent */
export const seedGetUserRecentMap = {
    maps: (userId: number): Partial<Map>[] =>
        [...new Array(20).keys()].map(i => ({
            user_id: userId,
            name: `map_name_${i + 1}`,
            is_private: i % 3 > 0 ? true : false,
            code: i % 3 > 0 ? '1234' : undefined,
            active: i % 10 > 0 ? MapActive.Active : MapActive.Inactive
        })),
    recentMaps: (mapId: number[], userId: number): Partial<UserRecentMap>[] =>
        [...new Array(20).keys()].map(i => ({
            user_id: userId,
            map_id: mapId[i],
            modified: i % 3 > 0 ? new Date() : new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
            active: i % 10 > 0 ? UserRecentMapActive.Active : UserRecentMapActive.Inactive
        })),
    accessible: (mapId: number[], userId: number): Partial<UserAccessibleMap>[] =>
        [...new Array(20).keys()].map(i => ({
            user_id: userId,
            map_id: mapId[i],
            active: i % 10 > 0 ? UserAccessibleMapActive.Active : UserAccessibleMapActive.Inactive
        }))
};

/** POST /map/recent/:recentMapId exist not exist map*/
export const seedPostUserRecentMapNotExist = {
    map: (userId: number): Partial<Map> => ({
        user_id: userId,
        name: 'map123',
        is_private: false,
        active: MapActive.Active
    }),
    recentMap: (mapId: number, userId: number): Partial<UserRecentMap> => ({
        user_id: userId,
        map_id: mapId,
        active: UserRecentMapActive.Active
    }),
    accessible: (mapId: number, userId: number): Partial<UserAccessibleMap> => ({
        user_id: userId,
        map_id: mapId,
        active: UserAccessibleMapActive.Active
    })
};

/** POST /map/recent/:recentMapId exist recent map*/
export const seedPostUserRecentMapExist = {
    map: (userId: number): Partial<Map> => ({
        user_id: userId,
        name: 'map123',
        is_private: false,
        active: MapActive.Active
    }),
    recentMap: (mapId: number, userId: number): Partial<UserRecentMap> => ({
        user_id: userId,
        map_id: mapId,
        active: UserRecentMapActive.Active
    }),
    accessible: (mapId: number, userId: number): Partial<UserAccessibleMap> => ({
        user_id: userId,
        map_id: mapId,
        active: UserAccessibleMapActive.Active
    })
};

/** DELETE /map/recent/:recentMapId */
export const seedDeleteUserRecentMap = {
    map: (userId: number): Partial<Map> => ({
        user_id: userId,
        name: 'map123',
        is_private: false,
        active: MapActive.Active
    }),
    recentMap: (mapId: number, userId: number): Partial<UserRecentMap> => ({
        user_id: userId,
        map_id: mapId,
        active: UserRecentMapActive.Active
    }),
    accessible: (mapId: number, userId: number): Partial<UserAccessibleMap> => ({
        user_id: userId,
        map_id: mapId,
        active: UserAccessibleMapActive.Active
    })
};

/** GET /map/favorite */
export const seedGetUserFavoriteMap = {
    maps: (userId: number): Partial<Map>[] =>
        [...new Array(20).keys()].map(i => ({
            user_id: userId,
            name: `map_name_${i + 1}`,
            is_private: i % 3 > 0 ? true : false,
            code: i % 3 > 0 ? '1234' : undefined,
            active: i % 10 > 0 ? MapActive.Active : MapActive.Inactive
        })),
    favoriteMaps: (mapId: number[], userId: number): Partial<UserFavoriteMap>[] =>
        [...new Array(20).keys()].map(i => ({
            user_id: userId,
            map_id: mapId[i],
            active: i % 10 > 0 ? UserFavoriteMapActive.Active : UserFavoriteMapActive.Inactive
        })),
    accessible: (mapId: number[], userId: number): Partial<UserAccessibleMap>[] =>
        [...new Array(20).keys()].map(i => ({
            user_id: userId,
            map_id: mapId[i],
            active: i % 10 > 0 ? UserAccessibleMapActive.Active : UserAccessibleMapActive.Inactive
        }))
};

/** POST /map/favorite/:favoriteMapId */
export const seedPostUserFavoriteMap = {
    map: (userId: number): Partial<Map> => ({
        user_id: userId,
        name: 'map123',
        is_private: false,
        active: MapActive.Active
    }),

    accessible: (mapId: number, userId: number): Partial<UserAccessibleMap> => ({
        user_id: userId,
        map_id: mapId,
        active: UserAccessibleMapActive.Active
    })
};

/** POST /map/favorite/:favoriteMapId */
export const seedDeleteUserFavoriteMap = {
    map: (userId: number): Partial<Map> => ({
        user_id: userId,
        name: 'map123',
        is_private: false,
        active: MapActive.Active
    }),

    favoriteMap: (mapId: number, userId: number): Partial<UserFavoriteMap> => ({
        user_id: userId,
        map_id: mapId,
        active: UserFavoriteMapActive.Active
    }),

    accessible: (mapId: number, userId: number): Partial<UserAccessibleMap> => ({
        user_id: userId,
        map_id: mapId,
        active: UserAccessibleMapActive.Active
    })
};

/** GET /map/detail login user */
export const seedDetailLoginUser = {
    map: (userId: number): Partial<Map> => ({
        user_id: userId,
        name: 'map123',
        is_private: false,
        active: MapActive.Active
    }),
    accessible: (mapId: number, userId: number): Partial<UserAccessibleMap> => ({
        user_id: userId,
        map_id: mapId,
        active: UserAccessibleMapActive.Active
    })
};

/** GET /map/detail not login user */
export const seedDetailNotLoginUser = {
    map: (userId: number): Partial<Map> => ({
        user_id: userId,
        name: 'map123',
        is_private: true,
        code: '1234',
        active: MapActive.Active
    })
};

/** GET /map/code */
export const seedGetMapCode = {
    map: (userId: number): Partial<Map> => ({
        user_id: userId,
        name: 'private_map',
        is_private: true,
        code: '4454',
        active: MapActive.Active
    })
};

/** POST /map/:mapId/code/match */
export const seedPostMapCodeMatchNotLoginUser = {
    map: (userId: number): Partial<Map> => ({
        user_id: userId,
        name: 'private_map',
        is_private: true,
        code: '1313',
        active: MapActive.Active
    })
};

/** POST /map/:mapId/code/match */
export const seedPostMapCodeMatchLoginUser = {
    map: (userId: number): Partial<Map> => ({
        user_id: userId,
        name: 'private_map',
        is_private: true,
        code: '9991',
        active: MapActive.Active
    })
};
