import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';

@Injectable()
export class CommonService {
    constructor(private readonly connection: Connection) {}

    async getServerStatus() {
        return 'healthy';
    }
}
