import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';

import { User } from '../entities/user.entity';
import { AuthUser } from '../lib/user_decorator';

@Injectable()
export class UserService {
    constructor(private readonly connection: Connection) {}

    // 유저 썸네일 업로드
    async uploadImage({ userId }: AuthUser, file): Promise<string> {
        await this.connection.getRepository(User).update(
            { id: userId },
            {
                thumbnail: file.Location
            }
        );
        return file.Location;
    }
}
