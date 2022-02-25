import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

import configuration from '../configuration';
import { AuthUser } from '../lib/user_decorator';
import { MapController } from './map.controller';
import { MapModule } from './map.module';
import { User } from '../entities/user.entity';
import { seedMe, seedGetUserMaps, seedUsers, seedPostUserMap } from './map.seed';
import { Map, MapActive } from '../entities/map.entity';
import { UserFavoriteMap } from '../entities/user_favorite_map.entity';
import { UserAccessibleMap, UserAccessibleMapActive } from '../entities/user_accessible_map.entity';
import { isNumberString } from 'class-validator';

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

        // 테스트 시작 전 데이터 생성
        beforeAll(async () => {
            maps = await connection.getRepository(Map).save(seedGetUserMaps.maps(users[0].id));

            // user_favorite_map, map과 OneToMany관계이기 때문에 선언
            await connection.getRepository(UserFavoriteMap).save(
                seedGetUserMaps.favoriteMaps(
                    maps.map(x => x.id),
                    users[0].id
                )
            );

            // user_accessible_map, map과 OneToMany관계이기 때문에 선언
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

        // 여기 내부에서 실행된 것들은 다음 테스트에도 적용
        afterAll(async () => {
            await connection.getRepository(UserAccessibleMap).clear();
            await connection.getRepository(UserFavoriteMap).clear();
            await connection.getRepository(Map).clear();
        });
    });

    /** POST /map */
    describe('POST /map', () => {
        let maps: Map[];

        beforeAll(async () => {
            maps = await connection.getRepository(Map).save(seedPostUserMap.maps(users[0].id));

            // user_favorite_map, map과 OneToMany관계이기 때문에 선언
            await connection.getRepository(UserFavoriteMap).save(
                seedPostUserMap.favoriteMaps(
                    maps.map(x => x.id),
                    users[0].id
                )
            );

            // user_accessible_map, map과 OneToMany관계이기 때문에 선언
            await connection.getRepository(UserAccessibleMap).save(
                seedPostUserMap.accessible(
                    maps.map(x => x.id),
                    users[0].id
                )
            );
        });

        it('should insert public map and insert accessible', async () => {
            // 호출
            await mapController.insertUserMap(me[1], { mapName: 'test_map', isPrivate: false });

            const map = await connection.getRepository(Map).findOne({ user_id: 2, active: MapActive.Active, name: 'test_map' });

            expect(map).toBeDefined();
            expect(map?.code).toBeNull();

            const accessible = await connection
                .getRepository(UserAccessibleMap)
                .findOne({ user_id: 2, active: UserAccessibleMapActive.Active, map_id: map.id });

            expect(accessible).toBeDefined();
        });

        it('should insert private map and insert accessible', async () => {
            // 호출
            await mapController.insertUserMap(me[1], { mapName: 'test_private_map', isPrivate: true });

            const map = await connection.getRepository(Map).findOne({ user_id: 2, active: MapActive.Active, name: 'test_private_map' });

            expect(map).toBeDefined();
            expect(map.code).toBeDefined();
            expect(isNumberString(map.code)).toEqual(true);

            const accessible = await connection
                .getRepository(UserAccessibleMap)
                .findOne({ user_id: 2, active: UserAccessibleMapActive.Active, map_id: map.id });

            expect(accessible).toBeDefined();
        });

        afterAll(async () => {
            await connection.getRepository(UserAccessibleMap).clear();
            await connection.getRepository(UserFavoriteMap).clear();
            await connection.getRepository(Map).clear();
        });
    });

    // /** DELETE /map */
    // describe('DELETE /map', () => {
    //     beforeAll(async () => {});

    //     it('..test', async () => {});

    //     afterAll(async () => {});
    // });
});
