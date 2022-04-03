import { User, UserActive } from '../../src/entities/user.entity';
import { UserLevel } from '../../src/lib/user_decorator';
import { Map, MapActive } from '../../src/entities/map.entity';
import { UserFavoriteMap, UserFavoriteMapActive } from '../../src/entities/user_favorite_map.entity';
import { UserAccessibleMap, UserAccessibleMapActive } from '../../src/entities/user_accessible_map.entity';
import { UserRecentMapActive, UserRecentMap } from '../../src/entities/user_recent_map.entity';

export const seedUsers = () =>
    [...new Array(10).keys()].map(
        i =>
            ({
                nickname: `user_${i + 1}`,
                sns_id: i + 1,
                level: UserLevel.User,
                active: UserActive.Active
            } as User)
    );

export const seedE2eData = {
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
    accessible: (mapId: number[], userId: number) =>
        [...new Array(50).keys()].map(
            i =>
                ({
                    user_id: userId,
                    map_id: mapId[i],
                    active: i % 10 > 0 ? UserAccessibleMapActive.Active : UserAccessibleMapActive.Inactive
                } as UserAccessibleMap)
        ),
    recentMaps: (mapId: number[], userId: number) =>
        [...new Array(50).keys()].map(
            i =>
                ({
                    user_id: userId,
                    map_id: mapId[i],
                    modified: i % 3 > 0 ? new Date() : new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
                    active: i % 10 > 0 ? UserRecentMapActive.Active : UserRecentMapActive.Inactive
                } as UserRecentMap)
        ),
    favoriteMaps: (mapId: number[], userId: number) =>
        [...new Array(50).keys()].map(
            i =>
                ({
                    user_id: userId,
                    map_id: mapId[i],
                    active: i % 10 > 0 ? UserFavoriteMapActive.Active : UserFavoriteMapActive.Inactive
                } as UserFavoriteMap)
        )
};
