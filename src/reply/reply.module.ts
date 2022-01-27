import { Module } from '@nestjs/common';

import { ReplyController } from './reply.controller';
import { ReplyService } from './reply.service';
import { MarkerService } from '../marker/marker.service';

@Module({
    imports: [],
    controllers: [ReplyController],
    providers: [ReplyService, MarkerService]
})
export class ReplyModule {}
