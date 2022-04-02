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
import { Marker } from '../../src/entities/marker.entity';
import { ReplyModule } from '../../src/reply/reply.module';
import { seedE2eData, seedUsers } from './reply.e2e.seed';
import { MapMarkerReply } from '../../src/entities/map_marker_reply.entity';

describe('ReplyController (e2e)', () => {
    let app: INestApplication;
    let connection: Connection;

    let users: User[];
    let map: Map;
    let marker: Marker;
    let replies: MapMarkerReply[];
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
                ReplyModule
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
        jwtToken = app.get(JwtService).sign({ userId: 1, userLevel: UserLevel.User });

        users = await connection.getRepository(User).save(seedUsers());

        map = await connection.getRepository(Map).save(seedE2eData.map(users[0].id));

        await connection.getRepository(UserAccessibleMap).save(seedE2eData.accessible(map.id, users[0].id));

        marker = await connection.getRepository(Marker).save(seedE2eData.marker(map.id, users[0].id));

        replies = await connection.getRepository(MapMarkerReply).save(seedE2eData.replies(marker.id, users[0].id));
    });

    it('GET /map/marker/:markerId/replies', async () => {
        return request(app.getHttpServer()).get(`/map/marker/${marker.id}/replies`).set({ Authorization: jwtToken }).expect(200);
    });

    it('POST /map/marker/:markerId/replies', async () => {
        return request(app.getHttpServer())
            .post(`/map/marker/${marker.id}/replies`)
            .set({ Authorization: jwtToken })
            .send({ message: 'reply_message_e2e' })
            .expect(201);
    });

    it('PUT /map/marker/replies/replyId', async () => {
        return request(app.getHttpServer())
            .put(`/map/marker/replies/${replies[0].id}`)
            .set({ Authorization: jwtToken })
            .send({ message: 'update_reply' })
            .expect(200);
    });

    it('DELETE /map/marker/replies/replyId', async () => {
        return request(app.getHttpServer()).delete(`/map/marker/replies/${replies[0].id}`).set({ Authorization: jwtToken }).expect(200);
    });
});
