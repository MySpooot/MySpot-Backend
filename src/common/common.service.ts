import { Injectable } from '@nestjs/common';

@Injectable()
export class CommonService {
    async getServerStatus() {
        return 'healthy';
    }
}
