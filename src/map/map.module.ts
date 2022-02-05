import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { JwtAuthModule } from '../lib/jwt';
import { MapController } from './map.controller';
import { MapService } from './map.service';

@Module({
    imports: [JwtAuthModule, ConfigModule],
    controllers: [MapController],
    providers: [MapService]
})
export class MapModule {}
