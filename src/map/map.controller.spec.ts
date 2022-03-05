import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { isNumberString } from 'class-validator';
import { Connection } from 'typeorm';

import configuration from '../configuration';
import { AuthUser } from '../lib/user_decorator';
import { MapController } from './map.controller';
import { MapModule } from './map.module';
import { User } from '../entities/user.entity';
import { Map, MapActive } from '../entities/map.entity';
import { UserFavoriteMap } from '../entities/user_favorite_map.entity';
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
    seedGetUserFavoriteMap
} from './map.seed';

describe('MapController', () => {
    let mapController: MapController;
    let connection: Connection;

    let users: User[];
    let me: AuthUser[];

    // 테스트 시작 전에 첫 실행
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

            // await connection.getRepository(UserFavoriteMap).save(
            //     seedGetUserMaps.favoriteMaps(
            //         maps.map(x => x.id),
            //         users[0].id
            //     )
            // );

            await connection.getRepository(UserAccessibleMap).save(
                seedGetUserMaps.accessible(
                    maps.map(x => x.id),
                    users[0].id
                )
            );
        });

        // 테스트 케이스
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
    describe('POST /map', () => {
        // public map
        it('should insert public map and insert accessible', async () => {
            const maps = await connection.getRepository(Map).save(seedPostUserPublicMap.maps(users[0].id));

            // await connection.getRepository(UserFavoriteMap).save(
            //     seedPostUserPublicMap.favoriteMaps(
            //         maps.map(x => x.id),
            //         users[0].id
            //     )
            // );

            await connection.getRepository(UserAccessibleMap).save(
                seedPostUserPublicMap.accessible(
                    maps.map(x => x.id),
                    users[0].id
                )
            );

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

            // await connection.getRepository(UserFavoriteMap).save(
            //     seedPostUserPrivateMap.favoriteMaps(
            //         maps.map(x => x.id),
            //         users[0].id
            //     )
            // );

            await connection.getRepository(UserAccessibleMap).save(
                seedPostUserPrivateMap.accessible(
                    maps.map(x => x.id),
                    users[0].id
                )
            );

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

    /** GET /recent/map */
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

    /** POST /recent/:recentMapId */
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

    /** DELETE /recent/:recentMapId */
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

    /** GET /favorite/:favoriteMapId */
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
        });
    });
});
