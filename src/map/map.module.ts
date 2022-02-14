import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JwtAuthModule } from '../lib/jwt';
import { MapController } from './map.controller';
import { MapService } from './map.service';
import { User } from '../entities/user.entity';
import { Map } from '../entities/map.entity';
import { UserAccessibleMap } from '../entities/user_accessible_map.entity';
import { UserFavoriteMap } from '../entities/user_favorite_map.entity';

@Module({
    imports: [JwtAuthModule, ConfigModule, TypeOrmModule.forFeature([User, Map, UserAccessibleMap, UserFavoriteMap])],
    controllers: [MapController],
    providers: [MapService]
})
export class MapModule {}
