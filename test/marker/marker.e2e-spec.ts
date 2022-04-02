import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import request from 'supertest';

import configuration from '../../src/configuration';
import { User } from '../../src/entities/user.entity';
import { UserLevel } from '../../src//lib/user_decorator';
import { Map } from '../../src/entities/map.entity';
import { UserAccessibleMap } from '../../src/entities/user_accessible_map.entity';
import { MarkerModule } from '../../src//marker/marker.module';
import { MarkerService } from '../../src/marker/marker.service';
import { seedE2eData, seedUsers } from './marker.e2e.seed';
import { Marker } from '../../src/entities/marker.entity';
import { MapMarkerLike } from '../../src/entities/map_marker_like.entity';
import { MyLocation } from '../../src/entities/my_location.entity';

describe('MarkerController (e2e)', () => {
    let app: INestApplication;
    let connection: Connection;
    let markerService: MarkerService;

    let users: User[];
    let maps: Map[];
    let markers: Marker[];
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
                MarkerModule
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
        markerService = app.get(MarkerService);
        jwtToken = app.get(JwtService).sign({ userId: 1, userLevel: UserLevel.User });

        users = await connection.getRepository(User).save(seedUsers());

        maps = await connection.getRepository(Map).save(seedE2eData.maps(users[0].id));

        await connection.getRepository(UserAccessibleMap).save(
            seedE2eData.accessible(
                maps.map(x => x.id),
                users[0].id
            )
        );

        markers = await connection.getRepository(Marker).save(
            seedE2eData.markers(
                maps.map(x => x.id),
                users[0].id
            )
        );

        await connection.getRepository(MapMarkerLike).save(seedE2eData.like(markers[1].id, users[0].id));

        await connection.getRepository(MyLocation).save(
            seedE2eData.locations(
                markers.map(x => x.address_id),
                markers.map(x => x.name),
                markers.map(x => x.address),
                markers.map(x => x.road_address),
                users[0].id
            )
        );
    });

    it('GET /map/:mapId/marker', async () => {
        return request(app.getHttpServer())
            .get('/map/1/marker')
            .set({ Authorization: jwtToken })
            .expect(200)
            .expect(JSON.stringify(await markerService.getMarkers({ authorization: jwtToken }, { mapId: 1 })));
    });

    it('POST /map/:mapId/marker', async () => {
        const body = {
            locationName: 'marker',
            latitude: '1234',
            longitude: '5678',
            addressId: 1313,
            address: 'address',
            roadAddress: 'road_address'
        };

        return request(app.getHttpServer()).post('/map/1/marker').set({ Authorization: jwtToken }).send(body).expect(201);
    });

    it('DELETE /map/marker/:markerId', async () => {
        return request(app.getHttpServer()).delete('/map/marker/1').set({ Authorization: jwtToken }).expect(200);
    });

    it('POST /map/marker/:markerId/like', async () => {
        return request(app.getHttpServer()).post('/map/marker/2/like').set({ Authorization: jwtToken }).expect(201);
    });

    it('DELETE /map/marker/:markerId/like', async () => {
        return request(app.getHttpServer()).delete('/map/marker/2/like').set({ Authorization: jwtToken }).expect(200);
    });

    it('GET /map/marker/location', async () => {
        return request(app.getHttpServer()).get('/map/marker/location').set({ Authorization: jwtToken }).expect(200);
    });

    it('POST /map/marker/location', async () => {
        const body = {
            locationName: 'marker',
            addressId: 1313321,
            address: 'address',
            roadAddress: 'road_address'
        };
        return request(app.getHttpServer()).post('/map/marker/location').set({ Authorization: jwtToken }).send(body).expect(201);
    });

    it('DELETE /map/marker/location/:addressId', async () => {
        return request(app.getHttpServer()).delete('/map/marker/location/1313321').set({ Authorization: jwtToken }).expect(200);
    });
});
