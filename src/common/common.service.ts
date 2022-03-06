import { Injectable } from '@nestjs/common';

@Injectable()
export class CommonService {
    async getServerStatus() {
        console.log('process', process.env.stage);
        return 'healthy';
    }
}
