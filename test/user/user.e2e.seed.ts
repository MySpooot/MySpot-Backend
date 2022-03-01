import { UserLevel } from '../../src/lib/user_decorator';
import { User, UserActive } from '../../src/entities/user.entity';

export const seedImageUploadUser = {
    nickname: undefined,
    sns_id: 1,
    level: UserLevel.User,
    active: UserActive.Pending
} as User;
