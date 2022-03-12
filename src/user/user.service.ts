import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';

import { User } from '../entities/user.entity';
import { AuthUser } from '../lib/user_decorator';
import { PutUserNicknameBody, PutUserNicknameResponse } from './dto/put_user_nickname.dto';

@Injectable()
export class UserService {
    constructor(private readonly connection: Connection) {}

    // 닉네임 변경
    async updateUserNickname({ userId }: AuthUser, { nickname }: PutUserNicknameBody) {
        await this.connection.getRepository(User).update({ id: userId }, { nickname: nickname });

        const user = await this.connection.getRepository(User).findOneOrFail({ id: userId });

        return PutUserNicknameResponse.from(user);
    }

    // 썸네일 업로드
    async uploadImage({ userId }: AuthUser, file): Promise<string> {
        console.log('file', file);
        await this.connection.getRepository(User).update(
            { id: userId },
            {
                thumbnail: file.location
            }
        );

        return file.location;
    }
}
