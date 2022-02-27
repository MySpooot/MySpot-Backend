import { User, UserActive } from '../src/entities/user.entity';
import { AuthUser, UserLevel } from '../src/lib/user_decorator';

/** POST /auth/login */
export const seedUser = {
    user: () =>
        ({
            nickname: 'chanhee',
            sns_id: 1,
            level: UserLevel.User,
            active: UserActive.Active
        } as User)
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
    snsId: 1,
    name: 'chanhee',
    thumbnail: null
};

/** GET /auth/me */
export const seedPendingUser = {
    user: () =>
        ({
            nickname: undefined,
            sns_id: 2,
            level: UserLevel.User,
            active: UserActive.Pending
        } as User)
};

export const seedPendingMe = {
    me: (seedPendingUser: User) =>
        ({
            userId: seedPendingUser.id,
            userLevel: UserLevel.User
        } as AuthUser)
};

/** PUT /auth/user/:userId */
export const seedPendingUserForUpdate = {
    user: () =>
        ({
            nickname: undefined,
            sns_id: 3,
            level: UserLevel.User,
            active: UserActive.Pending
        } as User)
};
