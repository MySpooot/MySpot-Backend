import { AuthUser, UserLevel } from '../../src/lib/user_decorator';
import { User, UserActive } from '../../src/entities/user.entity';

export const seedImageUploadUser = {
    nickname: undefined,
    sns_id: 1,
    level: UserLevel.User,
    active: UserActive.Pending
} as User;

export const seedImageUploadMe = {
    userId: 1,
    userLevel: UserLevel.User
} as AuthUser;

export const file = {
    fieldname: 'file',
    originalname: 'test.PNG',
    encoding: '7bit',
    mimetype: 'image/png',
    ACL: 'public-read',
    ETag: '"1234"',
    Location: 'test-location',
    key: '123',
    Key: '456',
    Bucket: 'test-bucket',
    width: 538,
    height: 384,
    premultiplied: false,
    size: 330765,
    ContentType: 'png'
};
