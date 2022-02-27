import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

import configuration from '../configuration';
import { AuthModule } from './auth.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthUser } from '../lib/user_decorator';
import { seedUsers, seedMe, kakaoErrorLoginData, kakaoLoginData } from './auth.seed';
import { User } from '../entities/user.entity';

describe('AuthController', () => {
    let authController: AuthController;
    let authService: AuthService;
    let connection: Connection;

    let users: User[];
    let me: AuthUser[];

    beforeAll(async () => {
        const app: TestingModule = await Test.createTestingModule({
            imports: [
                AuthModule,
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
        authController = app.get(AuthController);
        authService = app.get(AuthService);

        // create users
        users = await connection.getRepository(User).save(seedUsers());

        // create me
        me = seedMe();
    });

    describe('POST /auth/login', () => {
        it('should throw Kakao Api Error if data is undefined', async () => {
            jest.spyOn(authService, 'getKakaoData').mockImplementation(() => Promise.resolve(undefined));
            jest.spyOn(authService, 'loginProcess').mockImplementation(() => Promise.resolve(undefined));

            await expect(authController.login({ origin: 'dev' }, { code: '1234' })).rejects.toThrow('Kakao Api Error');

            jest.spyOn(authService, 'getKakaoData').mockRestore();
            jest.spyOn(authService, 'loginProcess').mockRestore();
        });

        it('should return Kakao Login Error if data have error property', async () => {
            jest.spyOn(authService, 'getKakaoData').mockImplementation(() => Promise.resolve(kakaoErrorLoginData));
            jest.spyOn(authService, 'loginProcess').mockImplementation(() => Promise.resolve(undefined));

            await expect(authController.login({ origin: 'dev' }, { code: '1234' })).rejects.toThrow('Kakao Login Error');

            jest.spyOn(authService, 'getKakaoData').mockRestore();
            jest.spyOn(authService, 'loginProcess').mockRestore();
        });

        it('should call loginProcess function', async () => {
            jest.spyOn(authService, 'getKakaoData').mockImplementation(() => Promise.resolve(kakaoLoginData));
            jest.spyOn(authService, 'loginProcess').mockImplementation(() => Promise.resolve(undefined));

            await authController.login({ origin: 'dev' }, { code: '1234' });

            expect(authService.loginProcess).toHaveBeenCalled();

            jest.spyOn(authService, 'getKakaoData').mockRestore();
            jest.spyOn(authService, 'loginProcess').mockRestore();
        });

        // it('should return No User Data if user has no data', async () => {

        // })

        // // 가입 + 닉네임 입력 완료 유저일 경우 return token
        // it('should return token if user already registered and insert nickname', async () => {

        // })
    });
});
