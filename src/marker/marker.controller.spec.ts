import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Connection } from 'typeorm';

import configuration from '../configuration';
import { AuthUser, UserLevel } from '../lib/user_decorator';
import { User } from '../entities/user.entity';
import { MarkerController } from './marker.controller';
import { MarkerModule } from './marker.module';
import { seedMe, seedUsers } from './marker.seed';

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
});
