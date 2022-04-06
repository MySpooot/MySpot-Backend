import { AuthUser, UserLevel } from '../../src/lib/user_decorator';
import { User, UserActive } from '../../src/entities/user.entity';

export const seedUpdateNicknameUser: Partial<User> = {
    nickname: 'before_nickname',
    sns_id: 1,
    level: UserLevel.User,
    active: UserActive.Active
};

export const seedUpdateNicknameMe: AuthUser = {
    userId: 1,
    userLevel: UserLevel.User
};

export const seedImageUploadUser: Partial<User> = {
    nickname: undefined,
    sns_id: 2,
    level: UserLevel.User,
    active: UserActive.Pending
};

export const seedImageUploadMe: AuthUser = {
    userId: 2,
    userLevel: UserLevel.User
};
