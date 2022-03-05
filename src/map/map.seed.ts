import { User, UserActive } from '../entities/user.entity';
import { AuthUser, UserLevel } from '../lib/user_decorator';
import { Map, MapActive } from '../entities/map.entity';
import { UserFavoriteMap, UserFavoriteMapActive } from '../entities/user_favorite_map.entity';
import { UserAccessibleMap, UserAccessibleMapActive } from '../entities/user_accessible_map.entity';
import { UserRecentMapActive, UserRecentMap } from '../entities/user_recent_map.entity';

export const seedUsers = () =>
    [...new Array(10).keys()].map(
        i =>
            ({
                nickname: `user_${i}`,
                sns_id: i + 1,
                level: UserLevel.User,
                active: UserActive.Active
            } as User)
    );

export const seedMe = () =>
    [...new Array(10).keys()].map(
        i =>
            ({
                userId: i + 1,
                userLevel: UserLevel.User
            } as AuthUser)
    );

/** GET /map */
export const seedGetUserMaps = {
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
    // favoriteMaps: (mapId: number[], userId: number) =>
    //     [...new Array(20).keys()].map(
    //         i =>
    //             ({
    //                 user_id: userId,
    //                 map_id: mapId[i],
    //                 active: i % 10 > 0 ? UserFavoriteMapActive.Active : UserFavoriteMapActive.Inactive
    //             } as UserFavoriteMap)
    //     ),
    accessible: (mapId: number[], userId: number) =>
        [...new Array(20).keys()].map(
            i =>
                ({
                    user_id: userId,
                    map_id: mapId[i],
                    active: i % 10 > 0 ? UserAccessibleMapActive.Active : UserAccessibleMapActive.Inactive
                } as UserAccessibleMap)
        )
};

/** POST /map public map */
export const seedPostUserPublicMap = {
    maps: (userId: number) =>
        [...new Array(5).keys()].map(
            i =>
                ({
                    user_id: userId,
                    name: `map_name_${i + 1}`,
                    is_private: i % 3 > 0 ? true : false,
                    code: i % 3 > 0 ? '1234' : undefined,
                    active: i % 10 > 0 ? MapActive.Active : MapActive.Inactive
                } as Map)
        ),
    // favoriteMaps: (mapId: number[], userId: number) =>
    //     [...new Array(5).keys()].map(
    //         i =>
    //             ({
    //                 user_id: userId,
    //                 map_id: mapId[i],
    //                 active: i % 10 > 0 ? UserFavoriteMapActive.Active : UserFavoriteMapActive.Inactive
    //             } as UserFavoriteMap)
    //     ),
    accessible: (mapId: number[], userId: number) =>
        [...new Array(5).keys()].map(
            i =>
                ({
                    user_id: userId,
                    map_id: mapId[i],
                    active: i % 10 > 0 ? UserAccessibleMapActive.Active : UserAccessibleMapActive.Inactive
                } as UserAccessibleMap)
        )
};

/** POST /map private map */
export const seedPostUserPrivateMap = {
    maps: (userId: number) =>
        [...new Array(5).keys()].map(
            i =>
                ({
                    user_id: userId,
                    name: `map_name_${i + 1}`,
                    is_private: i % 3 > 0 ? true : false,
                    code: i % 3 > 0 ? '1234' : undefined,
                    active: i % 10 > 0 ? MapActive.Active : MapActive.Inactive
                } as Map)
        ),
    // favoriteMaps: (mapId: number[], userId: number) =>
    //     [...new Array(5).keys()].map(
    //         i =>
    //             ({
    //                 user_id: userId,
    //                 map_id: mapId[i],
    //                 active: i % 10 > 0 ? UserFavoriteMapActive.Active : UserFavoriteMapActive.Inactive
    //             } as UserFavoriteMap)
    //     ),
    accessible: (mapId: number[], userId: number) =>
        [...new Array(5).keys()].map(
            i =>
                ({
                    user_id: userId,
                    map_id: mapId[i],
                    active: i % 10 > 0 ? UserAccessibleMapActive.Active : UserAccessibleMapActive.Inactive
                } as UserAccessibleMap)
        )
};

// DELETE /map
export const seedDeleteUserMap = {
    map: (userId: number) => ({
        user_id: userId,
        name: 'delete_map',
        is_private: false,
        active: MapActive.Active
    }),
    // favoriteMap: (userId: number, mapId: number) => ({
    //     user_id: userId,
    //     map_id: mapId,
    //     active: UserFavoriteMapActive.Active
    // }),
    accessible: (mapId: number, userId: number) => ({
        user_id: userId,
        map_id: mapId,
        active: UserAccessibleMapActive.Active
    })
};

/** GET /map/recent */
export const seedGetUserRecentMap = {
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
    recentMaps: (mapId: number[], userId: number) =>
        [...new Array(20).keys()].map(
            i =>
                ({
                    user_id: userId,
                    map_id: mapId[i],
                    modified: i % 3 > 0 ? new Date() : new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
                    active: i % 10 > 0 ? UserRecentMapActive.Active : UserRecentMapActive.Inactive
                } as UserRecentMap)
        ),
    accessible: (mapId: number[], userId: number) =>
        [...new Array(20).keys()].map(
            i =>
                ({
                    user_id: userId,
                    map_id: mapId[i],
                    active: i % 10 > 0 ? UserAccessibleMapActive.Active : UserAccessibleMapActive.Inactive
                } as UserAccessibleMap)
        )
};

/** POST /map/recent/:recentMapId exist not exist map*/
export const seedPostUserRecentMapNotExist = {
    map: (userId: number) => ({
        user_id: userId,
        name: 'map123',
        is_private: false,
        active: MapActive.Active
    }),
    recentMap: (mapId: number, userId: number) => ({
        user_id: userId,
        map_id: mapId,
        active: UserRecentMapActive.Active
    }),
    accessible: (mapId: number, userId: number) => ({
        user_id: userId,
        map_id: mapId,
        active: UserAccessibleMapActive.Active
    })
};

/** POST /map/recent/:recentMapId exist recent map*/
export const seedPostUserRecentMapExist = {
    map: (userId: number) => ({
        user_id: userId,
        name: 'map123',
        is_private: false,
        active: MapActive.Active
    }),
    recentMap: (mapId: number, userId: number) => ({
        user_id: userId,
        map_id: mapId,
        active: UserRecentMapActive.Active
    }),
    accessible: (mapId: number, userId: number) => ({
        user_id: userId,
        map_id: mapId,
        active: UserAccessibleMapActive.Active
    })
};

/** DELETE /map/recent/:recentMapId */
export const seedDeleteUserRecentMap = {
    map: (userId: number) => ({
        user_id: userId,
        name: 'map123',
        is_private: false,
        active: MapActive.Active
    }),
    recentMap: (mapId: number, userId: number) => ({
        user_id: userId,
        map_id: mapId,
        active: UserRecentMapActive.Active
    }),
    accessible: (mapId: number, userId: number) => ({
        user_id: userId,
        map_id: mapId,
        active: UserAccessibleMapActive.Active
    })
};

/** GET /map/favorite */
export const seedGetUserFavoriteMap = {
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
    favoriteMaps: (mapId: number[], userId: number) =>
        [...new Array(20).keys()].map(
            i =>
                ({
                    user_id: userId,
                    map_id: mapId[i],
                    active: i % 10 > 0 ? UserFavoriteMapActive.Active : UserFavoriteMapActive.Inactive
                } as UserFavoriteMap)
        ),
    accessible: (mapId: number[], userId: number) =>
        [...new Array(20).keys()].map(
            i =>
                ({
                    user_id: userId,
                    map_id: mapId[i],
                    active: i % 10 > 0 ? UserAccessibleMapActive.Active : UserAccessibleMapActive.Inactive
                } as UserAccessibleMap)
        )
};

/** POST /map/favorite/:favoriteMapId */
export const seedPostUserFavoriteMap = {
    map: (userId: number) => ({
        user_id: userId,
        name: 'map123',
        is_private: false,
        active: MapActive.Active
    }),

    accessible: (mapId: number, userId: number) => ({
        user_id: userId,
        map_id: mapId,
        active: UserAccessibleMapActive.Active
    })
};

/** POST /map/favorite/:favoriteMapId */
export const seedDeleteUserFavoriteMap = {
    map: (userId: number) => ({
        user_id: userId,
        name: 'map123',
        is_private: false,
        active: MapActive.Active
    }),

    favoriteMap: (mapId: number, userId: number) => ({
        user_id: userId,
        map_id: mapId,
        active: UserFavoriteMapActive.Active
    }),

    accessible: (mapId: number, userId: number) => ({
        user_id: userId,
        map_id: mapId,
        active: UserAccessibleMapActive.Active
    })
};

/** GET /map/detail login user */
export const seedDetailLoginUser = {
    map: (userId: number) => ({
        user_id: userId,
        name: 'map123',
        is_private: false,
        active: MapActive.Active
    }),
    accessible: (mapId: number, userId: number) => ({
        user_id: userId,
        map_id: mapId,
        active: UserAccessibleMapActive.Active
    })
};

/** GET /map/detail not login user */
export const seedDetailNotLoginUser = {
    map: (userId: number) => ({
        user_id: userId,
        name: 'map123',
        is_private: true,
        code: '1234',
        active: MapActive.Active
    })
};

/** GET /map/code */
export const seedGetMapCode = {
    map: (userId: number) => ({
        user_id: userId,
        name: 'private_map',
        is_private: true,
        code: '4454',
        active: MapActive.Active
    })
};

/** POST /map/:mapId/code/match */
export const seedPostMapCodeMatch = {
    map: (userId: number) => ({
        user_id: userId,
        name: 'private_map',
        is_private: true,
        code: '1313',
        active: MapActive.Active
    })
};
