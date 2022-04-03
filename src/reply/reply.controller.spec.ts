import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { UnauthorizedException } from '@nestjs/common';

import configuration from '../configuration';
import { ReplyModule } from './reply.module';
import { AuthUser } from '../lib/user_decorator';
import { User } from '../entities/user.entity';
import { Map } from '../entities/map.entity';
import { UserAccessibleMap } from '../entities/user_accessible_map.entity';
import { ReplyController } from './reply.controller';
import { MapMarkerReply, MapMarkerReplyActive } from '../entities/map_marker_reply.entity';
import { Marker } from '../entities/marker.entity';
import { seedDeleteMarkerReplies, seedGetMarkerReplies, seedMe, seedPostMarkerReplies, seedPutMarkerReplies, seedUsers } from './reply.seed';

describe('ReplyController', () => {
    let replyController: ReplyController;
    let connection: Connection;

    let users: User[];
    let me: AuthUser[];

    beforeAll(async () => {
        const app: TestingModule = await Test.createTestingModule({
            imports: [
                ReplyModule,
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
        replyController = app.get(ReplyController);

        // create users
        users = await connection.getRepository(User).save(seedUsers());

        // create me
        me = seedMe();
    });

    /** GET /map/marker/:markerId/replies */
    describe('GET /map', () => {
        let map: Map;
        let marker: Marker;

        beforeAll(async () => {
            map = await connection.getRepository(Map).save(seedGetMarkerReplies.maps(users[0].id));
            await connection.getRepository(UserAccessibleMap).save(seedGetMarkerReplies.accessible(map.id, users[0].id));
            marker = await connection.getRepository(Marker).save(seedGetMarkerReplies.marker(map.id, users[0].id));
            await connection.getRepository(MapMarkerReply).save(seedGetMarkerReplies.replies(marker.id, users[0].id));
        });

        // according to offset, limit and order by id DESC
        it('should return replies according to offset', async () => {
            const result = await replyController.getMarkerReplies({ markerId: marker.id }, {});

            expect(result).toBeDefined();
            expect(result).toHaveLength(10); // default 10

            const result_ = await replyController.getMarkerReplies({ markerId: marker.id }, { offset: 0, limit: 11 });

            expect(result_).toBeDefined();
            expect(result_).toHaveLength(11);
        });

        afterAll(async () => {
            await connection.getRepository(MapMarkerReply).clear();
            await connection.getRepository(Marker).clear();
            await connection.getRepository(UserAccessibleMap).clear();
            await connection.getRepository(Map).clear();
        });
    });

    describe('POST /map/marker/:markerId/replies', () => {
        let map: Map;
        let marker: Marker;

        beforeAll(async () => {
            map = await connection.getRepository(Map).save(seedPostMarkerReplies.maps(users[0].id));
            await connection.getRepository(UserAccessibleMap).save(seedPostMarkerReplies.accessible(map.id, [users[0].id, users[1].id]));
            marker = await connection.getRepository(Marker).save(seedPostMarkerReplies.marker(map.id, users[0].id));
            await connection.getRepository(MapMarkerReply).save(seedPostMarkerReplies.replies(marker.id, users[1].id));
        });

        it('should throw UnauthorizedException if map is private and user don`t have accessible', async () => {
            await expect(replyController.insertMarkerReply(me[2], { markerId: marker.id }, { message: 'test_message' })).rejects.toThrow(
                new UnauthorizedException()
            );
        });

        it('should insert marker reply', async () => {
            const beforeResult = await connection
                .getRepository(MapMarkerReply)
                .findOne({ marker_id: marker.id, user_id: me[0].userId, active: MapMarkerReplyActive.Active });

            const result = await replyController.insertMarkerReply(me[0], { markerId: marker.id }, { message: 'test_message' });

            const afterResult = await connection
                .getRepository(MapMarkerReply)
                .findOne({ marker_id: marker.id, user_id: me[0].userId, active: MapMarkerReplyActive.Active });

            expect(result).toBeDefined();
            expect(beforeResult).toBeUndefined();
            expect(afterResult).toBeDefined();

            expect(result.mapId).toEqual(map.id);
            expect(result.markerId).toEqual(marker.id);
            expect(result.message).toEqual('test_message');
            expect(result.userNickName).toEqual(users[0].nickname);
        });

        afterAll(async () => {
            await connection.getRepository(MapMarkerReply).clear();
            await connection.getRepository(Marker).clear();
            await connection.getRepository(UserAccessibleMap).clear();
            await connection.getRepository(Map).clear();
        });
    });

    describe('PUT /map/marker/replyId', () => {
        let map: Map;
        let marker: Marker;
        let reply: MapMarkerReply;

        beforeAll(async () => {
            map = await connection.getRepository(Map).save(seedPutMarkerReplies.maps(users[0].id));
            await connection.getRepository(UserAccessibleMap).save(seedPutMarkerReplies.accessible(map.id, users[0].id));
            marker = await connection.getRepository(Marker).save(seedPutMarkerReplies.marker(map.id, users[0].id));
            reply = await connection.getRepository(MapMarkerReply).save(seedPutMarkerReplies.reply(marker.id, users[0].id));
        });

        it('should throw UnauthorizedException if AuthUser.userId === reply.user_id', async () => {
            await expect(replyController.updateMarkerReply(me[4], { replyId: reply.id }, { message: 'update_message' })).rejects.toThrow(
                new UnauthorizedException()
            );
        });

        it('should update reply`s message', async () => {
            const beforeResult = await connection
                .getRepository(MapMarkerReply)
                .findOne({ user_id: users[0].id, marker_id: marker.id, active: MapMarkerReplyActive.Active });

            const result = await replyController.updateMarkerReply(me[0], { replyId: reply.id }, { message: 'update_message' });

            const afterResult = await connection
                .getRepository(MapMarkerReply)
                .findOne({ user_id: users[0].id, marker_id: marker.id, active: MapMarkerReplyActive.Active });

            expect(result).toBeDefined();
            expect(beforeResult).toBeDefined();
            expect(afterResult).toBeDefined();

            expect(result.mapId).toEqual(map.id);
            expect(result.markerId).toEqual(marker.id);
            expect(result.message).toEqual('update_message');
            expect(result.userNickName).toEqual(users[0].nickname);
        });

        afterAll(async () => {
            await connection.getRepository(MapMarkerReply).clear();
            await connection.getRepository(Marker).clear();
            await connection.getRepository(UserAccessibleMap).clear();
            await connection.getRepository(Map).clear();
        });
    });

    describe('DELETE /map/marker/replies/:replyId', () => {
        let map: Map;
        let marker: Marker;
        let reply: MapMarkerReply;

        beforeAll(async () => {
            map = await connection.getRepository(Map).save(seedDeleteMarkerReplies.maps(users[0].id));
            await connection.getRepository(UserAccessibleMap).save(seedDeleteMarkerReplies.accessible(map.id, users[0].id));
            marker = await connection.getRepository(Marker).save(seedDeleteMarkerReplies.marker(map.id, users[0].id));
            reply = await connection.getRepository(MapMarkerReply).save(seedDeleteMarkerReplies.reply(marker.id, users[0].id));
        });

        it('should throw UnauthorizedException if AuthUser.userId === reply.user_id', async () => {
            await expect(replyController.deleteMarkerReply(me[4], { replyId: reply.id })).rejects.toThrow(new UnauthorizedException());
        });

        it('should update reply active to inactive', async () => {
            const beforeResult = await connection
                .getRepository(MapMarkerReply)
                .findOne({ user_id: users[0].id, marker_id: marker.id, active: MapMarkerReplyActive.Active });

            await replyController.deleteMarkerReply(me[0], { replyId: reply.id });

            const afterResult = await connection
                .getRepository(MapMarkerReply)
                .findOne({ user_id: users[0].id, marker_id: marker.id, active: MapMarkerReplyActive.Inactive });

            expect(beforeResult).toBeDefined();
            expect(afterResult).toBeDefined();
        });

        afterAll(async () => {
            await connection.getRepository(MapMarkerReply).clear();
            await connection.getRepository(Marker).clear();
            await connection.getRepository(UserAccessibleMap).clear();
            await connection.getRepository(Map).clear();
        });
    });
});
