import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { MarkerController } from './marker.controller';
import { MarkerService } from './marker.service';
import { JwtAuthModule } from '../lib/jwt';

@Module({
    imports: [JwtAuthModule, ConfigModule],
    controllers: [MarkerController],
    providers: [MarkerService]
})
export class MarkerModule {}
