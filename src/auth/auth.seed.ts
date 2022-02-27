import { User, UserActive } from '../entities/user.entity';
import { AuthUser, UserLevel } from '../lib/user_decorator';

export const seedUsers = () =>
    [...new Array(10).keys()].map(
        i =>
            ({
                nickname: `user_${i}`,
                sns_id: i + 1,
                level: UserLevel.User,
                active: UserActive.Active
            } as User)
    );

export const seedMe = () =>
    [...new Array(10).keys()].map(
        i =>
            ({
                userId: i + 1,
                userLevel: UserLevel.User
            } as AuthUser)
    );

// POST /login
export const kakaoErrorLoginData = {
    error: { test: 'error' }
};

export const kakaoLoginData = {
    data: {
        access_token: 'access_token',
        token_type: 'bearer',
        refresh_token: 'refresh_token',
        expires_in: 11111,
        scope: 'profile_image profile_nickname',
        refresh_token_expires_in: 111111
    }
};

export const kekaoGetUserData = {
    data: {
        access_token: 'access_token',
        token_type: 'bearer',
        refresh_token: 'refresh_token',
        expires_in: 11111,
        scope: 'profile_image profile_nickname',
        refresh_token_expires_in: 111111
    }
};
