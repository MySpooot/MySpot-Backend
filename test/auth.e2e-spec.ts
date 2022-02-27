import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import request from 'supertest';

import configuration from '../src/configuration';
import { AuthModule } from '../src/auth/auth.module';
import { AuthService } from '../src/auth/auth.service';
import { User } from '../src/entities/user.entity';
import { seedKakaoData, seedKakaoGetUserData, seedPendingMe, seedPendingUser, seedUser, seedPendingUserForUpdate } from './auth.e2e.seed';

describe('AppController (e2e)', () => {
    let app: INestApplication;
    let connection: Connection;
    let authService: AuthService;

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
                AuthModule
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
        authService = app.get(AuthService);
    });

    it('POST /auth/login', async () => {
        await connection.getRepository(User).save(seedUser.user());
        jest.spyOn(authService, 'getKakaoData').mockImplementation(() => Promise.resolve(seedKakaoData));
        jest.spyOn(authService, 'getKaKaoUserData').mockImplementation(() => Promise.resolve(seedKakaoGetUserData));

        const body = {
            code: '1234'
        };
        return request(app.getHttpServer()).post('/auth/login').set({ origin: 'dev' }).send(body).expect(201);
    });

    it('GET /auth/me', async () => {
        const pendingUser = await connection.getRepository(User).save(seedPendingUser.user());
        const pendingMe = seedPendingMe.me(pendingUser);
        const jwtToken = app.get(JwtService).sign({ userId: pendingUser.id, userLevel: pendingUser.level });

        return request(app.getHttpServer())
            .get('/auth/me')
            .set({ Authorization: jwtToken })
            .expect(200)
            .expect(JSON.stringify(await authService.me(pendingMe)));
    });

    it('PUT /auth/user/:userId', async () => {
        await connection.getRepository(User).save(seedPendingUserForUpdate.user());

        const body = {
            nickname: 'update'
        };
        return request(app.getHttpServer()).put('/auth/user/1').send(body).expect(200);
    });
});
