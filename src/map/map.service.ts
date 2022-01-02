import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';

@Injectable()
export class MapService {
    constructor(private readonly connection: Connection) {}

    async getHello() {
        return await this.connection.getRepository(Map).find({});
    }
}
