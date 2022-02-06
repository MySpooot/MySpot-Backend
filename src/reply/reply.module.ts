import { Module } from '@nestjs/common';

import { ReplyController } from './reply.controller';
import { ReplyService } from './reply.service';
import { MarkerService } from '../marker/marker.service';
import { JwtAuthModule } from 'src/lib/jwt';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [JwtAuthModule, ConfigModule],
    controllers: [ReplyController],
    providers: [ReplyService, MarkerService]
})
export class ReplyModule {}
