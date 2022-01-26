import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';

import { CommonService } from './common.service';

@Controller('/common')
export class CommonController {
    constructor(private readonly commonService: CommonService) {}

    @Get('/status')
    @ApiOkResponse({ type: 'string' })
    getServerStatus() {
        return this.commonService.getServerStatus();
    }
}
