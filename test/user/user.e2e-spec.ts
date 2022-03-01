import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import request from 'supertest';

import configuration from '../../src/configuration';
import { User } from '../../src/entities/user.entity';
import { seedImageUploadUser } from './user.e2e.seed';
import { UserModule } from '../../src/user/user.module';

describe('UserController (e2e)', () => {
    let app: INestApplication;
    let connection: Connection;

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
    });

    it('POST /user/upload', async () => {
        const user = await connection.getRepository(User).save(seedImageUploadUser);
        const jwtToken = app.get(JwtService).sign({ userId: user.id, userLevel: user.level });

        return request(app.getHttpServer()).post('/user/upload').attach('file', 'test/user/cat.png').set({ Authorization: jwtToken }).expect(201);
    });
});
