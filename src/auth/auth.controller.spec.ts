import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

import configuration from '../configuration';
import { AuthModule } from './auth.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthUser, UserLevel } from '../lib/user_decorator';
import {
    seedUsers,
    seedMe,
    seedKakaoErrorData,
    seedKakaoData,
    seedKakaoGetUserData,
    seedAlreadyRegistered,
    seedPendingUser,
    seedRegisteredAndNotInsertNickname,
    seedFirstRegister,
    seedPendingUserForUpdate
} from './auth.seed';
import { User, UserActive } from '../entities/user.entity';

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
        let pendingUser: User;

        // 카카오 api 통신 실패
        it('should throw Kakao Api Error if data is undefined', async () => {
            jest.spyOn(authService, 'getKakaoData').mockImplementation(() => Promise.resolve(undefined));
            jest.spyOn(authService, 'loginProcess').mockImplementation(() => Promise.resolve(undefined));

            await expect(authController.login({ code: '1234' })).rejects.toThrow('Kakao Api Error');

            jest.spyOn(authService, 'getKakaoData').mockRestore();
            jest.spyOn(authService, 'loginProcess').mockRestore();
        });

        // 카카오 api 통신에는 성공했으나 error property가 존재
        it('should return Kakao Login Error if data have error property', async () => {
            jest.spyOn(authService, 'getKakaoData').mockImplementation(() => Promise.resolve(seedKakaoErrorData));
            jest.spyOn(authService, 'loginProcess').mockImplementation(() => Promise.resolve(undefined));

            await expect(authController.login({ code: '1234' })).rejects.toThrow('Kakao Login Error');

            jest.spyOn(authService, 'getKakaoData').mockRestore();
            jest.spyOn(authService, 'loginProcess').mockRestore();
        });

        // 위 두가지가 아니라면 loginProcess() 호출
        it('should call loginProcess function', async () => {
            jest.spyOn(authService, 'getKakaoData').mockImplementation(() => Promise.resolve(seedKakaoData));
            jest.spyOn(authService, 'loginProcess').mockImplementation(() => Promise.resolve(undefined));

            await authController.login({ code: '1234' });

            expect(authService.loginProcess).toHaveBeenCalled();

            jest.spyOn(authService, 'getKakaoData').mockRestore();
            jest.spyOn(authService, 'loginProcess').mockRestore();
        });

        // 카카오 user api 호출 실패
        it('should return No User Data if user has no data', async () => {
            jest.spyOn(authService, 'getKakaoData').mockImplementation(() => Promise.resolve(seedKakaoGetUserData));
            jest.spyOn(authService, 'getKakaoUser').mockImplementation(() => Promise.resolve(undefined));

            await expect(authController.login({ code: '1234' })).rejects.toThrow('User Profile Is Not Exist');

            jest.spyOn(authService, 'getKakaoData').mockRestore();
            jest.spyOn(authService, 'getKakaoUser').mockRestore();
        });

        // 가입 + 닉네임 입력 완료 유저일 경우 return token
        it('should return token if user already registered and insert nickname', async () => {
            jest.spyOn(authService, 'getKakaoData').mockImplementation(() => Promise.resolve(seedAlreadyRegistered.kakaoData()));
            jest.spyOn(authService, 'getKaKaoUserData').mockImplementation(() => Promise.resolve(seedAlreadyRegistered.kakaoUserData(users[1])));

            const result = await authController.login({ code: '1234' });

            expect(result).toBeDefined();
            expect(result.token).toBeDefined(); // token 존재

            jest.spyOn(authService, 'getKakaoData').mockRestore();
            jest.spyOn(authService, 'getKaKaoUserData').mockRestore();
        });

        // 가입 + 닉네임 입력 안한 유저일 경우 return
        it('should return response, not insert db if user already registered and not insert nickname', async () => {
            pendingUser = await connection.getRepository(User).save(seedPendingUser.user(users.length));
            jest.spyOn(authService, 'getKakaoData').mockImplementation(() => Promise.resolve(seedRegisteredAndNotInsertNickname.kakaoData()));
            jest.spyOn(authService, 'getKaKaoUserData').mockImplementation(() =>
                Promise.resolve(seedRegisteredAndNotInsertNickname.kakaoUserData(pendingUser))
            );

            const beforeUserCount = await connection.getRepository(User).findAndCount();

            const result = await authController.login({ code: '1234' });

            const afterUserCount = await connection.getRepository(User).findAndCount();

            expect(result).toBeDefined();
            expect(result?.token).toBeUndefined(); // token은 없어야 한다.
            expect(beforeUserCount[1]).toEqual(afterUserCount[1]); // db에 insert 되지 않는다.

            jest.spyOn(authService, 'getKakaoData').mockRestore();
            jest.spyOn(authService, 'getKaKaoUserData').mockRestore();
        });

        // 아예 첫 가입인 경우
        it('should return response, insert db if first register', async () => {
            jest.spyOn(authService, 'getKakaoData').mockImplementation(() => Promise.resolve(seedFirstRegister.kakaoData()));
            jest.spyOn(authService, 'getKaKaoUserData').mockImplementation(() => Promise.resolve(seedFirstRegister.kakaoUserData()));

            const beforeUser = await connection.getRepository(User).findOne({ sns_id: seedFirstRegister.kakaoUserData().snsId });

            const result = await authController.login({ code: '1234' });

            const afterUser = await connection.getRepository(User).findOne({ sns_id: seedFirstRegister.kakaoUserData().snsId });

            expect(result).toBeDefined();
            expect(result?.token).toBeUndefined(); // token은 없어야 한다.
            expect(beforeUser).toBeUndefined();
            expect(afterUser).toBeDefined(); // 새로운 user가 추가된다.

            jest.spyOn(authService, 'getKakaoData').mockRestore();
            jest.spyOn(authService, 'getKaKaoUserData').mockRestore();

            // 이곳에서 생성한 user가 다음 테스트에 영향을 미치지 않기 때문에 user data를 clear하지 않는다.
        });
    });

    describe('GET /auth/me', () => {
        it('should return me', async () => {
            const result = await authController.me(me[1]);

            expect(result).toBeDefined();
        });

        it('should return undefined', async () => {
            const result = await authController.me({ userId: 999, userLevel: UserLevel.User });

            expect(result).toBeUndefined();
        });
    });

    describe('PUT /auth/user/:userId', () => {
        let pendingUser: User;
        it('should update nickname and return token', async () => {
            pendingUser = await connection.getRepository(User).save(seedPendingUserForUpdate.user(users.length));

            const beforeUser = await connection.getRepository(User).findOne({ id: pendingUser.id });

            const result = await authController.updateUser({ userId: pendingUser.id }, { nickname: 'update_nickname' });

            const afterUser = await connection.getRepository(User).findOne({ id: pendingUser.id });

            expect(result).toBeDefined();
            expect(result.token).toBeDefined(); // token 존재
            expect(beforeUser.nickname).toBeNull();
            expect(beforeUser.active).toEqual(UserActive.Pending);
            expect(afterUser.nickname).toEqual('update_nickname');
            expect(afterUser.active).toEqual(UserActive.Active);
        });
    });
});
