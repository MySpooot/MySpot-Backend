import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

import { AuthUser } from '../lib/user_decorator';
import { MapController } from './map.controller';
import { MapModule } from './map.module';
import configuration from '../configuration';
import { User } from '../entities/user.entity';
import { seedMe, seedUserMaps, seedUsers } from './map.seed';
import { Map } from '../entities/map.entity';
import { UserFavoriteMap } from '../entities/user_favorite_map.entity';
import { UserAccessibleMap } from '../entities/user_accessible_map.entity';

describe('MapController', () => {
    let mapController: MapController;
    let connection: Connection;

    let users: User[];
    let me: AuthUser[];

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

    describe('GET /map', () => {
        let maps: Map[];

        beforeAll(async () => {
            maps = await connection.getRepository(Map).save(seedUserMaps.maps(users[0].id));

            // user_favorite_map, map과 OneToMany관계이기 때문에 선언
            await connection.getRepository(UserFavoriteMap).save(
                seedUserMaps.favoriteMaps(
                    maps.map(x => x.id),
                    users[0].id
                )
            );

            // user_accessible_map, map과 OneToMany관계이기 때문에 선언
            await connection.getRepository(UserAccessibleMap).save(
                seedUserMaps.accessible(
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

    describe('POST /map', () => {
        beforeAll(async () => {
            // @TODO
        });

        it('...test', async () => {
            // @TODO
        });

        afterAll(async () => {
            // @TODO
        });
    });
});
