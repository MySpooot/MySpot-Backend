import { User, UserActive } from '../entities/user.entity';
import { AuthUser, UserLevel } from '../lib/user_decorator';
import { Map, MapActive } from '../entities/map.entity';
import { UserFavoriteMap, UserFavoriteMapActive } from '../entities/user_favorite_map.entity';
import { UserAccessibleMap, UserAccessibleMapActive } from '../entities/user_accessible_map.entity';
import { map } from 'rxjs';

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

// GET /map
export const seedGetUserMaps = {
    maps: (userId: number) =>
        [...new Array(50).keys()].map(
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
        [...new Array(50).keys()].map(
            i =>
                ({
                    user_id: userId,
                    map_id: mapId[i],
                    active: i % 10 > 0 ? UserFavoriteMapActive.Active : UserFavoriteMapActive.Inactive
                } as UserFavoriteMap)
        ),
    accessible: (mapId: number[], userId: number) =>
        [...new Array(50).keys()].map(
            i =>
                ({
                    user_id: userId,
                    map_id: mapId[i],
                    active: i % 10 > 0 ? UserAccessibleMapActive.Active : UserAccessibleMapActive.Inactive
                } as UserAccessibleMap)
        )
};

// POST /map
export const seedPostUserMap = {
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
    favoriteMaps: (mapId: number[], userId: number) =>
        [...new Array(5).keys()].map(
            i =>
                ({
                    user_id: userId,
                    map_id: mapId[i],
                    active: i % 10 > 0 ? UserFavoriteMapActive.Active : UserFavoriteMapActive.Inactive
                } as UserFavoriteMap)
        ),
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
        // code: i % 3 > 0 ? '1234' : undefined,
        active: MapActive.Active
    }),
    favoriteMap: (userId: number, mapId: number) => ({}),
    accessible: (mapId: number, userId: number) => ({})
};
