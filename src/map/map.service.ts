import { Injectable } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { Connection } from 'typeorm';

@Injectable()
export class MapService {
    constructor(private readonly connection: Connection) {}

    async getHello() {
        // return 1;
        console.log('test');
        await this.connection.getRepository(User).update({ id: 1 }, { nickname: '1111' });
    }
}
