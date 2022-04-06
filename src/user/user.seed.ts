import { AuthUser, UserLevel } from '../lib/user_decorator';
import { User, UserActive } from '../entities/user.entity';

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

export const file = {
    fieldname: 'file',
    originalname: 'test.PNG',
    encoding: '7bit',
    mimetype: 'image/png',
    ACL: 'public-read',
    ETag: '"1234"',
    location: 'test-location',
    key: '123',
    Key: '456',
    Bucket: 'test-bucket',
    width: 538,
    height: 384,
    premultiplied: false,
    size: 330765,
    ContentType: 'png'
};
