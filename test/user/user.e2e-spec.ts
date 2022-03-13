import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import request from 'supertest';

import configuration from '../../src/configuration';
import { User } from '../../src/entities/user.entity';
import { seedImageUploadMe, seedImageUploadUser, seedUpdateNicknameUser, seedUpdateNicknameMe } from './user.e2e.seed';
import { UserModule } from '../../src/user/user.module';
import { UserService } from '../../src/user/user.service';

describe('UserController (e2e)', () => {
    let app: INestApplication;
    let connection: Connection;
    let userService: UserService;

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
                UserModule
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
        userService = app.get(UserService);
    });

    it('PUT /user', async () => {
        await connection.getRepository(User).save(seedUpdateNicknameUser);
        const jwtToken = app.get(JwtService).sign(seedUpdateNicknameMe);
        const body = {
            nickname: 'after_'
        };

        return request(app.getHttpServer())
            .put('/user')
            .set({ Authorization: jwtToken })
            .send(body)
            .expect(200)
            .expect(JSON.stringify(await userService.updateUserNickname(seedUpdateNicknameMe, body)));
    });

    // @TODO 추후 주석 젝서
    // it('POST /user/upload', async () => {
    //     await connection.getRepository(User).save(seedImageUploadUser);
    //     const jwtToken = app.get(JwtService).sign(seedImageUploadMe);

    //     return request(app.getHttpServer()).post('/user/upload').attach('file', 'test/user/cat.png').set({ Authorization: jwtToken }).expect(201);
    // });
});
