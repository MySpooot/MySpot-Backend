import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MarkerController } from './marker.controller';
import { MarkerService } from './marker.service';
import { JwtAuthModule } from '../lib/jwt';
import { Marker } from '../entities/marker.entity';
import { MapMarkerLike } from '../entities/map_marker_like.entity';
import { MyLocation } from '../entities/my_location.entity';
import { UserAccessibleMap } from '../entities/user_accessible_map.entity';
import { Map } from '../entities/map.entity';

@Module({
    imports: [JwtAuthModule, ConfigModule, TypeOrmModule.forFeature([Marker, MapMarkerLike, MyLocation, Map, UserAccessibleMap])],
    controllers: [MarkerController],
    providers: [MarkerService]
})
export class MarkerModule {}
