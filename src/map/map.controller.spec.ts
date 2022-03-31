import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { isNumberString } from 'class-validator';
import { JwtService } from '@nestjs/jwt';
import { Connection } from 'typeorm';

import configuration from '../configuration';
import { AuthUser, UserLevel } from '../lib/user_decorator';
import { MapController } from './map.controller';
import { MapModule } from './map.module';
import { User } from '../entities/user.entity';
import { Map, MapActive } from '../entities/map.entity';
import { UserFavoriteMap, UserFavoriteMapActive } from '../entities/user_favorite_map.entity';
import { UserAccessibleMap, UserAccessibleMapActive } from '../entities/user_accessible_map.entity';
import { UserRecentMap, UserRecentMapActive } from '../entities/user_recent_map.entity';
import {
    seedMe,
    seedGetUserMaps,
    seedUsers,
    seedPostUserPublicMap,
    seedPostUserPrivateMap,
    seedDeleteUserMap,
    seedGetUserRecentMap,
    seedPostUserRecentMapExist,
    seedPostUserRecentMapNotExist,
    seedDeleteUserRecentMap,
    seedGetUserFavoriteMap,
    seedPostUserFavoriteMap,
    seedDeleteUserFavoriteMap,
    seedDetailLoginUser,
    seedDetailNotLoginUser,
    seedGetMapCode,
    seedPostMapCodeMatchNotLoginUser,
    seedPostMapCodeMatchLoginUser
} from './map.seed';

describe('MapController', () => {
    let mapController: MapController;
    let connection: Connection;

    let users: User[];
    let me: AuthUser[];
    let jwtToken: string;

    beforeAll(async () => {
        const app: TestingModule = await Test.createTestingModule({
            imports: [
                MapModule,
                ConfigModule.forRoot({
                    load: [configuration],
                    cache: true,
                    isGlobal: true
                }),
                TypeOrmModule.forRoot({
                    type: 'sqlite',
                    database: ':memory:',
                    autoLoadEntities: true,
                    synchronize: true,
                    logging: false
                })
            ]
        }).compile();

        connection = app.get(Connection);
        mapController = app.get(MapController);
        jwtToken = app.get(JwtService).sign({ userId: 1, userLevel: UserLevel.User });

        // create users
        users = await connection.getRepository(User).save(seedUsers());

        // create me
        me = seedMe();
    });

    /** GET /map */
    describe('GET /map', () => {
        let maps: Map[];

        beforeAll(async () => {
            maps = await connection.getRepository(Map).save(seedGetUserMaps.maps(users[0].id));

            await connection.getRepository(UserAccessibleMap).save(
                seedGetUserMaps.accessible(
                    maps.map(x => x.id),
                    users[0].id
                )
            );
        });

        it('should return maps', async () => {
            const result = await mapController.getUserMaps(me[0], {});

            expect(result).toBeDefined();
            expect(result).toHaveLength(6); // 기본 limit = 6
        });

        it('should return maps according to offset, limit and order by id DESC', async () => {
            const result = await mapController.getUserMaps(me[0], { offset: 0, limit: 5 });

            expect(result).toBeDefined();
            expect(result).toHaveLength(5);

            for (let i = 0; i < result.length - 1; i++) {
                const currentMap = maps.find(map => map.id === result[i].id);
                const nextMap = maps.find(map => map.id === result[i + 1].id);

                expect(currentMap).toBeDefined();
                expect(nextMap).toBeDefined();

                expect(currentMap.id).toBeGreaterThan(nextMap.id);
            }
        });

        afterAll(async () => {
            await connection.getRepository(UserAccessibleMap).clear();
            await connection.getRepository(UserFavoriteMap).clear();
            await connection.getRepository(Map).clear();
        });
    });

    /** POST /map */
    describe.only('POST /map', () => {
        // public map
        it('should insert public map and insert accessible', async () => {
            const maps = await connection.getRepository(Map).save(seedPostUserPublicMap.maps(users[0].id));

            const result = await connection.getRepository(UserAccessibleMap).save(
                seedPostUserPublicMap.accessible(
                    maps.map(x => x.id),
                    users[0].id
                )
            );

            expect(result).toBeDefined();

            await mapController.insertUserMap(me[1], { mapName: 'test_map', isPrivate: false });

            const map = await connection.getRepository(Map).findOne({ user_id: 2, active: MapActive.Active, name: 'test_map' });

            expect(map).toBeDefined();
            expect(map?.code).toBeNull();

            const accessible = await connection
                .getRepository(UserAccessibleMap)
                .findOne({ user_id: 2, active: UserAccessibleMapActive.Active, map_id: map.id });

            expect(accessible).toBeDefined();

            await connection.getRepository(UserAccessibleMap).clear();
            await connection.getRepository(UserFavoriteMap).clear();
            await connection.getRepository(Map).clear();
        });

        // private map
        it('should insert private map and insert accessible', async () => {
            const maps = await connection.getRepository(Map).save(seedPostUserPrivateMap.maps(users[0].id));

            const result = await connection.getRepository(UserAccessibleMap).save(
                seedPostUserPrivateMap.accessible(
                    maps.map(x => x.id),
                    users[0].id
                )
            );

            expect(result).toBeDefined();

            await mapController.insertUserMap(me[1], { mapName: 'test_private_map', isPrivate: true });

            const map = await connection.getRepository(Map).findOne({ user_id: 2, active: MapActive.Active, name: 'test_private_map' });

            expect(map).toBeDefined();
            expect(map.code).toBeDefined();
            expect(isNumberString(map.code)).toEqual(true);

            const accessible = await connection
                .getRepository(UserAccessibleMap)
                .findOne({ user_id: 2, active: UserAccessibleMapActive.Active, map_id: map.id });

            expect(accessible).toBeDefined();

            await connection.getRepository(UserAccessibleMap).clear();
            await connection.getRepository(UserFavoriteMap).clear();
            await connection.getRepository(Map).clear();
        });
    });

    /** DELETE /map */
    describe('DELETE /map', () => {
        it('should update active to Inactive', async () => {
            const map = await connection.getRepository(Map).save(seedDeleteUserMap.map(users[2].id));

            await connection.getRepository(UserAccessibleMap).save(seedDeleteUserMap.accessible(map.id, users[2].id));

            const beforeMap = await connection.getRepository(Map).findOne({ id: map.id, active: MapActive.Active });

            await mapController.deleteUserMap({ mapId: map.id });

            const afterMap = await connection.getRepository(Map).findOne({ id: map.id, active: MapActive.Inactive });

            expect(beforeMap).toBeDefined();
            expect(afterMap).toBeDefined();

            await connection.getRepository(UserAccessibleMap).clear();
            await connection.getRepository(Map).clear();
        });
    });

    /** GET map/recent */
    describe('GET /recent/map', () => {
        it('should return maps according to offset, limit', async () => {
            const maps = await connection.getRepository(Map).save(seedGetUserRecentMap.maps(users[0].id));

            await connection.getRepository(UserAccessibleMap).save(
                seedGetUserRecentMap.accessible(
                    maps.map(x => x.id),
                    users[0].id
                )
            );

            await connection.getRepository(UserRecentMap).save(
                seedGetUserRecentMap.recentMaps(
                    maps.map(x => x.id),
                    users[0].id
                )
            );
            // postgresql entity type issue로 modified order by test 진행x
            const result = await mapController.getUserRecentMaps(me[0], { offset: 0, limit: 5 });

            expect(result).toBeDefined();
            expect(result).toHaveLength(5);

            await connection.getRepository(UserAccessibleMap).clear();
            await connection.getRepository(UserRecentMap).clear();
            await connection.getRepository(Map).clear();
        });
    });

    /** POST /map/recent/:recentMapId */
    describe('POST /recent/recentMapId', () => {
        it('should insert recent map if recent map is not exist', async () => {
            const map = await connection.getRepository(Map).save(seedPostUserRecentMapNotExist.map(users[0].id));

            await connection.getRepository(UserAccessibleMap).save(seedPostUserRecentMapNotExist.accessible(map.id, users[0].id));

            await connection.getRepository(UserRecentMap).save(seedPostUserRecentMapNotExist.recentMap(map.id, users[1].id));

            const beforeRecentMap = await connection.getRepository(UserRecentMap).findOne({ map_id: map.id, user_id: users[0].id });

            await mapController.insertUserRecentMap(me[0], { recentMapId: map.id });

            const afterRecentMap = await connection.getRepository(UserRecentMap).findOne({ map_id: map.id, user_id: users[0].id });

            expect(beforeRecentMap).toBeUndefined();
            expect(afterRecentMap).toBeDefined();

            await connection.getRepository(UserAccessibleMap).clear();
            await connection.getRepository(UserRecentMap).clear();
            await connection.getRepository(Map).clear();
        });

        it('should update modified if recent map id exist', async () => {
            // postgresql entity type issue로 modified test 진행x
            const map = await connection.getRepository(Map).save(seedPostUserRecentMapExist.map(users[0].id));

            await connection.getRepository(UserAccessibleMap).save(seedPostUserRecentMapExist.accessible(map.id, users[0].id));

            await connection.getRepository(UserRecentMap).save(seedPostUserRecentMapExist.recentMap(map.id, users[0].id));

            const beforeRecentMap = await connection.getRepository(UserRecentMap).findOne({ map_id: map.id, user_id: users[0].id });

            await mapController.insertUserRecentMap(me[0], { recentMapId: map.id });

            const afterRecentMap = await connection.getRepository(UserRecentMap).findOne({ map_id: map.id, user_id: users[0].id });

            expect(beforeRecentMap).toBeDefined();
            expect(afterRecentMap).toBeDefined();

            await connection.getRepository(UserAccessibleMap).clear();
            await connection.getRepository(UserRecentMap).clear();
            await connection.getRepository(Map).clear();
        });
    });

    /** DELETE /map/recent/:recentMapId */
    describe('DELETE /recent/:recentMapId', () => {
        it('should update active to Inactive', async () => {
            const map = await connection.getRepository(Map).save(seedDeleteUserRecentMap.map(users[5].id));

            await connection.getRepository(UserAccessibleMap).save(seedDeleteUserRecentMap.accessible(map.id, users[5].id));

            await connection.getRepository(UserRecentMap).save(seedDeleteUserRecentMap.recentMap(map.id, users[5].id));

            const beforeRecentMap = await connection.getRepository(UserRecentMap).findOne({ map_id: map.id, user_id: users[5].id });

            await mapController.deleteUserRecentMap(me[5], { recentMapId: map.id });

            const afterRecentMap = await connection.getRepository(UserRecentMap).findOne({ map_id: map.id, user_id: users[5].id });

            expect(beforeRecentMap).toBeDefined();
            expect(afterRecentMap).toBeDefined();
            expect(beforeRecentMap.active).toEqual(UserRecentMapActive.Active);
            expect(afterRecentMap.active).toEqual(UserRecentMapActive.Inactive);

            await connection.getRepository(UserAccessibleMap).clear();
            await connection.getRepository(UserRecentMap).clear();
            await connection.getRepository(Map).clear();
        });
    });

    /** GET /map/favorite */
    describe('should get user favorite map', () => {
        it('should return favorite map according to offset, limit', async () => {
            // postgresql entity type issue로 modified test 진행x
            const maps = await connection.getRepository(Map).save(seedGetUserFavoriteMap.maps(users[0].id));

            await connection.getRepository(UserAccessibleMap).save(
                seedGetUserFavoriteMap.accessible(
                    maps.map(x => x.id),
                    users[2].id
                )
            );

            await connection.getRepository(UserFavoriteMap).save(
                seedGetUserFavoriteMap.favoriteMaps(
                    maps.map(x => x.id),
                    users[2].id
                )
            );
            const result = await mapController.getUserFavoriteMaps(me[2], { offset: 0, limit: 4 });

            expect(result).toBeDefined();
            expect(result.length).toEqual(4);

            await connection.getRepository(UserAccessibleMap).clear();
            await connection.getRepository(UserFavoriteMap).clear();
            await connection.getRepository(Map).clear();
        });
    });

    /** POST /map/favorite/:favoriteMapId */
    describe('POST /map/favorite/:favoriteMapId', () => {
        it('should insert favorite map', async () => {
            const map = await connection.getRepository(Map).save(seedPostUserFavoriteMap.map(users[2].id));

            await connection.getRepository(UserAccessibleMap).save(seedPostUserFavoriteMap.accessible(map.id, users[2].id));

            const beforeFavoriteMap = await connection
                .getRepository(UserFavoriteMap)
                .findOne({ map_id: map.id, active: UserFavoriteMapActive.Active });

            await mapController.insertUserFavoriteMap(me[2], { favoriteMapId: map.id });

            const afterFavoriteMap = await connection
                .getRepository(UserFavoriteMap)
                .findOne({ map_id: map.id, active: UserFavoriteMapActive.Active });

            expect(beforeFavoriteMap).toBeUndefined();
            expect(afterFavoriteMap).toBeDefined();

            await connection.getRepository(UserAccessibleMap).clear();
            await connection.getRepository(UserFavoriteMap).clear();
            await connection.getRepository(Map).clear();
        });
    });

    /** DELETE /map/favorite/:favoriteMapId */
    describe('DELETE /map/favorite/:favoriteMapId', () => {
        it('should update active to Inactive', async () => {
            const map = await connection.getRepository(Map).save(seedDeleteUserFavoriteMap.map(users[0].id));

            await connection.getRepository(UserAccessibleMap).save(seedDeleteUserFavoriteMap.accessible(map.id, users[0].id));

            await connection.getRepository(UserFavoriteMap).save(seedDeleteUserFavoriteMap.favoriteMap(map.id, users[0].id));

            const beforeFavoriteMap = await connection.getRepository(UserFavoriteMap).findOne({ map_id: map.id });

            await mapController.deleteUserFavoriteMap(me[0], { favoriteMapId: map.id });

            const afterFavoriteMap = await connection.getRepository(UserFavoriteMap).findOne({ map_id: map.id });

            expect(beforeFavoriteMap).toBeDefined();
            expect(afterFavoriteMap).toBeDefined();
            expect(afterFavoriteMap.active).toEqual(UserFavoriteMapActive.Inactive);

            await connection.getRepository(UserAccessibleMap).clear();
            await connection.getRepository(UserFavoriteMap).clear();
            await connection.getRepository(Map).clear();
        });
    });

    /** GET /map/detail */
    describe('GET /map/detail', () => {
        it('should return response if login user', async () => {
            const map = await connection.getRepository(Map).save(seedDetailLoginUser.map(users[0].id));

            await connection.getRepository(UserAccessibleMap).save(seedDetailLoginUser.accessible(map.id, users[0].id));

            const result = await mapController.getMapDetail({ authorization: jwtToken }, { mapId: map.id });

            expect(result).toBeDefined();
            expect(result.isOwner).toBeTruthy();
            expect(result.accessible).toBeTruthy();
            expect(result.isFavorite).toBeFalsy();
            expect(result.isPrivate).toBeFalsy();

            await connection.getRepository(UserAccessibleMap).clear();
            await connection.getRepository(Map).clear();
        });

        it('should return response if not login user', async () => {
            const map = await connection.getRepository(Map).save(seedDetailNotLoginUser.map(users[8].id));

            const result = await mapController.getMapDetail({}, { mapId: map.id });

            expect(result).toBeDefined();
            expect(result.isOwner).toBeFalsy();
            expect(result.accessible).toBeFalsy();
            expect(result.isFavorite).toBeFalsy();
            expect(result.isPrivate).toBeTruthy();

            await connection.getRepository(Map).clear();
        });
    });

    /** GET /map/code */
    describe('GET /map/code', () => {
        it('should return code', async () => {
            const map = await connection.getRepository(Map).save(seedGetMapCode.map(users[8].id));

            const result = await mapController.getMapCode({ mapId: map.id });

            expect(result).toBeDefined();
            expect(result.code).toEqual(map.code);

            await connection.getRepository(Map).clear();
        });
    });

    /** POST /map/:mapId/code/match */
    describe('POST /map/:mapId/code/match', () => {
        it('should return true if code is match, or return false if code is not match', async () => {
            const map = await connection.getRepository(Map).save(seedPostMapCodeMatchNotLoginUser.map(users[7].id));

            // true
            const resultTrue = await mapController.getMapCodeMatch({}, { mapId: map.id }, { code: '1313' });

            expect(resultTrue).toBeDefined();
            expect(resultTrue).toEqual(true);

            // false
            const resultFalse = await mapController.getMapCodeMatch({}, { mapId: map.id }, { code: '4444' });

            expect(resultFalse).toBeDefined();
            expect(resultFalse).toEqual(false);

            await connection.getRepository(UserAccessibleMap).clear();
            await connection.getRepository(Map).clear();
        });

        it('should insert accessible if login user and code is match', async () => {
            const map = await connection.getRepository(Map).save(seedPostMapCodeMatchLoginUser.map(users[0].id));

            const beforeAccessible = await connection.getRepository(UserAccessibleMap).findOne({ map_id: map.id, user_id: users[0].id });

            // true
            const resultTrue = await mapController.getMapCodeMatch({ authorization: jwtToken }, { mapId: map.id }, { code: '9991' });

            const afterAccessible = await connection.getRepository(UserAccessibleMap).findOne({ map_id: map.id, user_id: users[0].id });

            expect(resultTrue).toBeDefined();
            expect(resultTrue).toEqual(true);
            expect(beforeAccessible).toBeUndefined();
            expect(afterAccessible).toBeDefined();
            expect(afterAccessible.active).toEqual(UserAccessibleMapActive.Active);
            expect(afterAccessible.map_id).toEqual(map.id);
            expect(afterAccessible.user_id).toEqual(users[0].id);

            // false
            const resultFalse = await mapController.getMapCodeMatch({}, { mapId: map.id }, { code: '4444' });

            expect(resultFalse).toBeDefined();
            expect(resultFalse).toEqual(false);
        });
    });
});
