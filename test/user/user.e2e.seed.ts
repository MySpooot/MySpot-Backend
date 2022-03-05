import { AuthUser, UserLevel } from '../../src/lib/user_decorator';
import { User, UserActive } from '../../src/entities/user.entity';

export const seedUpdateNicknameUser = {
    nickname: 'before_nickname',
    sns_id: 1,
    level: UserLevel.User,
    active: UserActive.Active
} as User;

export const seedUpdateNicknameMe = {
    userId: 1,
    userLevel: UserLevel.User
} as AuthUser;

export const seedImageUploadUser = {
    nickname: undefined,
    sns_id: 2,
    level: UserLevel.User,
    active: UserActive.Pending
} as User;

export const seedImageUploadMe = {
    userId: 2,
    userLevel: UserLevel.User
} as AuthUser;
