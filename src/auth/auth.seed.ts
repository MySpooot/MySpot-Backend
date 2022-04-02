import { User, UserActive } from '../entities/user.entity';
import { AuthUser, UserLevel } from '../lib/user_decorator';

export const seedUsers = () =>
    [...new Array(10).keys()].map(
        i =>
            ({
                nickname: `user_${i + 1}`,
                sns_id: i + 1,
                level: UserLevel.User,
                active: i % 5 > 0 ? UserActive.Active : UserActive.Inactive
            } as User)
    );

export const seedPendingUser = {
    user: (userLength: number) =>
        ({
            nickname: undefined,
            sns_id: userLength + 1,
            level: UserLevel.User,
            active: UserActive.Pending
        } as User)
};

export const seedPendingUserForUpdate = {
    user: (userLength: number) =>
        ({
            nickname: undefined,
            sns_id: userLength + 1,
            level: UserLevel.User,
            active: UserActive.Pending
        } as User)
};

export const seedMe = () =>
    [...new Array(10).keys()].map(
        i =>
            ({
                userId: i + 1,
                userLevel: UserLevel.User
            } as AuthUser)
    );

/** POST /auth/login */
export const seedKakaoErrorData = {
    error: { test: 'error' }
};

export const seedKakaoData = {
    data: {
        access_token: 'access_token',
        token_type: 'bearer',
        refresh_token: 'refresh_token',
        expires_in: 11111,
        scope: 'profile_image profile_nickname',
        refresh_token_expires_in: 111111
    }
};

export const seedKakaoGetUserData = {
    data: {
        access_token: 'access_token',
        token_type: 'bearer',
        refresh_token: 'refresh_token',
        expires_in: 11111,
        scope: 'profile_image profile_nickname',
        refresh_token_expires_in: 111111
    }
};

export const seedAlreadyRegistered = {
    kakaoData: () => ({
        data: {
            access_token: 'access_token',
            token_type: 'bearer',
            refresh_token: 'refresh_token',
            expires_in: 11111,
            scope: 'profile_image profile_nickname',
            refresh_token_expires_in: 111111
        }
    }),
    kakaoUserData: (user: User) => ({
        snsId: user.sns_id,
        name: user.nickname,
        thumbnail: user.thumbnail
    })
};

export const seedRegisteredAndNotInsertNickname = {
    kakaoData: () => ({
        data: {
            access_token: 'access_token',
            token_type: 'bearer',
            refresh_token: 'refresh_token',
            expires_in: 11111,
            scope: 'profile_image profile_nickname',
            refresh_token_expires_in: 111111
        }
    }),
    kakaoUserData: (pendingUser: User) => ({
        snsId: pendingUser.sns_id,
        name: pendingUser.nickname,
        thumbnail: pendingUser.thumbnail
    })
};

export const seedFirstRegister = {
    kakaoData: () => ({
        data: {
            access_token: 'access_token',
            token_type: 'bearer',
            refresh_token: 'refresh_token',
            expires_in: 11111,
            scope: 'profile_image profile_nickname',
            refresh_token_expires_in: 111111
        }
    }),
    kakaoUserData: () => ({
        snsId: 999,
        name: 'chanhee_first_register',
        thumbnail: 'thumbnail'
    })
};
