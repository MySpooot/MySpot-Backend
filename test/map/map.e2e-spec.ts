import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import request from 'supertest';

import configuration from '../../src/configuration';
import { User } from '../../src/entities/user.entity';

import { MapService } from '../../src/map/map.service';
import { MapModule } from '../../src/map/map.module';
import { UserLevel } from '../../src//lib/user_decorator';
import { seedE2eData, seedMe, seedUsers } from './map.e2e.seed';
import { Map } from '../../src/entities/map.entity';
import { UserAccessibleMap } from '../../src/entities/user_accessible_map.entity';
import { UserRecentMap } from '../../src/entities/user_recent_map.entity';
import { UserFavoriteMap } from '../../src/entities/user_favorite_map.entity';

describe('MapController (e2e)', () => {
    let app: INestApplication;
    let connection: Connection;
    let mapService: MapService;

    let users: User[];
    let maps: Map[];
    let jwtToken: string;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [
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
                }),
                MapModule
            ]
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(
            new ValidationPipe({
                whitelist: true,
                transform: true,
                transformOptions: { enableImplicitConversion: true },
                disableErrorMessages: false
            })
        );
        await app.init();

        connection = app.get(Connection);
        mapService = app.get(MapService);
        jwtToken = app.get(JwtService).sign({ userId: 1, userLevel: UserLevel.User });

        users = await connection.getRepository(User).save(seedUsers());

        seedMe();

        maps = await connection.getRepository(Map).save(seedE2eData.maps(users[0].id));

        await connection.getRepository(UserAccessibleMap).save(
            seedE2eData.accessible(
                maps.map(x => x.id),
                users[0].id
            )
        );

        await connection.getRepository(UserRecentMap).save(
            seedE2eData.recentMaps(
                maps.map(x => x.id),
                users[0].id
            )
        );

        await connection.getRepository(UserFavoriteMap).save(
            seedE2eData.favoriteMaps(
                maps.map(x => x.id),
                users[0].id
            )
        );
    });

    it('GET /map', async () => {
        return request(app.getHttpServer()).get('/map').set({ Authorization: jwtToken }).expect(200);
    });

    it('POST /map', async () => {
        const body = {
            mapName: 'map_k',
            isPrivate: true
        };

        return request(app.getHttpServer()).post('/map').set({ Authorization: jwtToken }).send(body).expect(201);
    });

    it('DELETE /map/:mapId', async () => {
        return request(app.getHttpServer()).delete('/map/1').set({ Authorization: jwtToken }).expect(200);
    });

    it('GET /map/recent', async () => {
        return request(app.getHttpServer()).get('/map/recent').set({ Authorization: jwtToken }).expect(200);
    });

    it('POST /map/:recentMapId', async () => {
        return request(app.getHttpServer()).post('/map/recent/2').set({ Authorization: jwtToken }).expect(201);
    });

    it('DELETE /map/:recentMapId', async () => {
        return request(app.getHttpServer()).delete('/map/recent/2').set({ Authorization: jwtToken }).expect(200);
    });

    it('GET /map/favorite', async () => {
        return request(app.getHttpServer()).get('/map/favorite').set({ Authorization: jwtToken }).expect(200);
    });

    it('POST /map/:favoriteMapId', async () => {
        return request(app.getHttpServer()).post('/map/favorite/3').set({ Authorization: jwtToken }).expect(201);
    });

    it('DELETE /map/:favoriteMapId', async () => {
        return request(app.getHttpServer()).delete('/map/favorite/3').set({ Authorization: jwtToken }).expect(200);
    });

    it('GET /map/:mapId/detail', async () => {
        return request(app.getHttpServer())
            .get('/map/10/detail')
            .set({ Authorization: jwtToken })
            .expect(200)
            .expect(JSON.stringify(await mapService.getMapDetail({ authorization: jwtToken }, { mapId: 10 })));
    });

    it('GET /map/:mapId/code', async () => {
        return request(app.getHttpServer()).get('/map/50/code').set({ Authorization: jwtToken }).expect(200);
    });

    it('POST /map/:mapId/code/match', async () => {
        return request(app.getHttpServer())
            .post('/map/50/code/match')
            .set({ Authorization: jwtToken })
            .send({ code: '1234' })
            .expect(201)
            .expect(JSON.stringify(await mapService.getMapCodeMatch({}, { mapId: 50 }, { code: '1234' })));
    });
});
