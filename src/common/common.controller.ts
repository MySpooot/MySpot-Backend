import { Controller, Get } from '@nestjs/common';

import { CommonService } from './common.service';

@Controller('/common')
export class CommonController {
    constructor(private readonly commonService: CommonService) {}

    @Get('/status')
    getServerStatus() {
        return this.commonService.getServerStatus();
    }
}
