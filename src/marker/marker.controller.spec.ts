import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Connection } from 'typeorm';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';

import configuration from '../configuration';
import { AuthUser, UserLevel } from '../lib/user_decorator';
import { User } from '../entities/user.entity';
import { MarkerController } from './marker.controller';
import { MarkerModule } from './marker.module';
import { Map, MapActive } from '../entities/map.entity';
import { Marker, MarkerActive } from '../entities/marker.entity';
import { UserAccessibleMap } from '../entities/user_accessible_map.entity';
import { MapMarkerLike, MapMarkerLikeActive } from '../entities/map_marker_like.entity';
import { seedDeleteMarker, seedGetMarkers, seedMe, seedPostMarker, seedPostMarkerLike, seedUsers, seedDeleteMarkerLike } from './marker.seed';

describe('MarkerController', () => {
    let markerController: MarkerController;
    let connection: Connection;

    let users: User[];
    let me: AuthUser[];
    let jwtToken: string;

    beforeAll(async () => {
        const app: TestingModule = await Test.createTestingModule({
            imports: [
                MarkerModule,
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
        markerController = app.get(MarkerController);
        jwtToken = app.get(JwtService).sign({ userId: 1, userLevel: UserLevel.User });

        // create users
        users = await connection.getRepository(User).save(seedUsers());

        // create me
        me = seedMe();
    });

    describe('GET /map/:mapId/marker', () => {
        let maps: Map[];
        let markers: Marker[];

        beforeAll(async () => {
            maps = await connection.getRepository(Map).save(seedGetMarkers.maps(users[0].id));

            await connection.getRepository(UserAccessibleMap).save(
                seedGetMarkers.accessible(
                    maps.map(x => x.id),
                    users[0].id
                )
            );

            markers = await connection.getRepository(Marker).save(seedGetMarkers.markers([maps[0].id, maps[1].id], users[0].id));
        });

        it('should return markers', async () => {
            const result = await markerController.getMarkers({}, { mapId: maps[0].id });

            expect(result).toBeDefined();

            for (let i = 0; i < result.length - 1; i++) {
                const currentMarker = markers.find(marker => marker.id === result[i].id);
                const nextMarker = markers.find(marker => marker.id === result[i + 1].id);

                expect(currentMarker).toBeDefined();
                expect(nextMarker).toBeDefined();

                expect(currentMarker.id).toBeGreaterThan(nextMarker.id);
            }
        });
        afterAll(async () => {
            await connection.getRepository(Marker).clear();
            await connection.getRepository(UserAccessibleMap).clear();
            await connection.getRepository(Map).clear();
        });
    });

    describe('POST /map/:mapId/marker', () => {
        let map: Map;
        let marker: Marker;

        beforeAll(async () => {
            map = await connection.getRepository(Map).save(seedPostMarker.maps(users[0].id));
            await connection.getRepository(UserAccessibleMap).save(seedPostMarker.accessible(map.id, users[0].id));
            marker = await connection.getRepository(Marker).save(seedPostMarker.marker(map.id, users[0].id));
        });

        it('should throw Invalid Map Id', async () => {
            await expect(
                markerController.insertMarker(
                    me[0],
                    { mapId: 999 },
                    {
                        locationName: 'name',
                        latitude: '1234',
                        longitude: '1234123',
                        addressId: 1321313,
                        address: '주소1234',
                        roadAddress: '도로명주소테스트'
                    }
                )
            ).rejects.toThrow(new BadRequestException('Invalid Map Id'));
        });

        it('should throw Already Exist Marker', async () => {
            await expect(
                markerController.insertMarker(
                    me[0],
                    { mapId: map.id },
                    {
                        locationName: 'name',
                        latitude: '1234',
                        longitude: '1234123',
                        addressId: marker.address_id,
                        address: 'ㅋㅋㅋㅋ',
                        roadAddress: '도로명주소테스트'
                    }
                )
            ).rejects.toThrow(new BadRequestException('Already Exist Marker'));
        });

        it('should throw UnauthorizedException', async () => {
            await expect(
                markerController.insertMarker(
                    me[1],
                    { mapId: map.id },
                    {
                        locationName: 'name',
                        latitude: '1234',
                        longitude: '1234123',
                        addressId: 123123123,
                        address: 'ㅋㅋㅋㅋ',
                        roadAddress: '도로명주소테스트'
                    }
                )
            ).rejects.toThrow(new UnauthorizedException());
        });

        it('should insert marker', async () => {
            const addressId = 93838481823;
            const beforeMarker = await connection.getRepository(Marker).find({ address_id: addressId });

            const result = await markerController.insertMarker(
                me[0],
                { mapId: map.id },
                {
                    locationName: 'name',
                    latitude: '1234',
                    longitude: '1234123',
                    addressId: addressId,
                    address: 'ㅋㅋㅋㅋ',
                    roadAddress: '도로명주소테스트'
                }
            );

            const afterMarker = await connection.getRepository(Marker).find({ address_id: addressId });

            expect(beforeMarker).toBeDefined();
            expect(afterMarker).toBeDefined();

            expect(result).toBeDefined();
            expect(result.userId).toEqual(me[0].userId);
            expect(result.latitude).toEqual('1234');
            expect(result.longitude).toEqual('1234123');
            expect(result.addressId).toEqual(addressId);
            expect(result.roadAddress).toEqual('도로명주소테스트');
        });

        afterAll(async () => {
            await connection.getRepository(Marker).clear();
            await connection.getRepository(UserAccessibleMap).clear();
            await connection.getRepository(Map).clear();
        });
    });

    describe('DELETE /map/marker/:markerId', () => {
        let map: Map;
        let marker: Marker;

        beforeAll(async () => {
            map = await connection.getRepository(Map).save(seedDeleteMarker.maps(users[0].id));
            await connection.getRepository(UserAccessibleMap).save(seedDeleteMarker.accessible(map.id, users[0].id));
            marker = await connection.getRepository(Marker).save(seedDeleteMarker.marker(map.id, users[0].id));
        });

        it('should throw Invalid Marker Id', async () => {
            await expect(markerController.deleteMarker(me[0], { markerId: marker.id + 1 })).rejects.toThrow(
                new BadRequestException('Invalid Marker Id')
            );
        });

        it('should throw UnauthorizedException', async () => {
            await expect(markerController.deleteMarker(me[1], { markerId: marker.id })).rejects.toThrow(new UnauthorizedException());
        });

        it('should delete marker', async () => {
            const beforeMarker = await connection.getRepository(Marker).findOne({ id: marker.id, active: MarkerActive.Active });

            await markerController.deleteMarker(me[0], { markerId: marker.id });

            const afterMarker = await connection.getRepository(Marker).findOne({ id: marker.id, active: MarkerActive.Active });

            expect(beforeMarker).toBeDefined();
            expect(afterMarker).toBeUndefined();
        });

        afterAll(async () => {
            await connection.getRepository(Marker).clear();
            await connection.getRepository(UserAccessibleMap).clear();
            await connection.getRepository(Map).clear();
        });
    });

    describe('POST /map/marker/:markerId/like', () => {
        let map: Map;
        let marker: Marker;

        beforeAll(async () => {
            map = await connection.getRepository(Map).save(seedPostMarkerLike.maps(users[0].id));
            await connection.getRepository(UserAccessibleMap).save(seedPostMarkerLike.accessible(map.id, users[0].id));
            marker = await connection.getRepository(Marker).save(seedPostMarkerLike.marker(map.id, users[0].id));
        });

        it('should throw Invalid Marker Id', async () => {
            await expect(markerController.insertMarkerLike(me[0], { markerId: marker.id + 1 })).rejects.toThrow(
                new BadRequestException('Invalid Marker Id')
            );
        });

        it('should throw Invalid Map Id', async () => {
            await connection.getRepository(Map).update({ id: map.id }, { active: MapActive.Inactive });
            await expect(markerController.insertMarkerLike(me[0], { markerId: marker.id })).rejects.toThrow(
                new BadRequestException('Invalid Map Id')
            );
            await connection.getRepository(Map).update({ id: map.id }, { active: MapActive.Active });
        });

        it('should return UnauthorizedException', async () => {
            await expect(markerController.insertMarkerLike(me[1], { markerId: marker.id })).rejects.toThrow(new UnauthorizedException());
        });

        it('should insert marker like', async () => {
            const beforeMarkerLike = await connection.getRepository(MapMarkerLike).findOne({ marker_id: marker.id });

            await markerController.insertMarkerLike(me[0], { markerId: marker.id });

            const afterMarkerLike = await connection.getRepository(MapMarkerLike).findOne({ marker_id: marker.id });

            expect(beforeMarkerLike).toBeUndefined();
            expect(afterMarkerLike).toBeDefined();
        });

        afterAll(async () => {
            await connection.getRepository(MapMarkerLike).clear();
            await connection.getRepository(Marker).clear();
            await connection.getRepository(UserAccessibleMap).clear();
            await connection.getRepository(Map).clear();
        });
    });

    describe('DELETE /map/marker/:markerId/like', () => {
        let map: Map;
        let marker: Marker;
        let like: MapMarkerLike;

        beforeAll(async () => {
            map = await connection.getRepository(Map).save(seedDeleteMarkerLike.maps(users[0].id));
            await connection.getRepository(UserAccessibleMap).save(seedDeleteMarkerLike.accessible(map.id, users[0].id));
            marker = await connection.getRepository(Marker).save(seedDeleteMarkerLike.marker(map.id, users[0].id));
            like = await connection.getRepository(MapMarkerLike).save(seedDeleteMarkerLike.like(marker.id, users[0].id));
        });

        it('should throw Invalid Marker Like Id', async () => {
            await expect(markerController.deleteMarkerLike(me[0], { markerId: marker.id + 1 })).rejects.toThrow(
                new BadRequestException('Invalid Marker Like Id')
            );
        });

        it('should delete marker like', async () => {
            const beforeMarker = await connection.getRepository(MapMarkerLike).findOne({ marker_id: marker.id, active: MapMarkerLikeActive.Active });

            await markerController.deleteMarkerLike(me[0], { markerId: marker.id });

            const afterMarker = await connection.getRepository(MapMarkerLike).findOne({ marker_id: marker.id, active: MapMarkerLikeActive.Active });

            expect(beforeMarker).toBeDefined();
            expect(afterMarker).toBeUndefined();
        });

        afterAll(async () => {
            await connection.getRepository(MapMarkerLike).clear();
            await connection.getRepository(Marker).clear();
            await connection.getRepository(UserAccessibleMap).clear();
            await connection.getRepository(Map).clear();
        });
    });
});
