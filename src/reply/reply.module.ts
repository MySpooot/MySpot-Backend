import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ReplyController } from './reply.controller';
import { ReplyService } from './reply.service';
import { MarkerService } from '../marker/marker.service';
import { JwtAuthModule } from '../lib/jwt';
import { MapMarkerReply } from '../entities/map_marker_reply.entity';
import { Map } from '../entities/map.entity';
import { User } from '../entities/user.entity';
import { UserAccessibleMap } from '../entities/user_accessible_map.entity';
import { UserFavoriteMap } from '../entities/user_favorite_map.entity';
import { Marker } from '../entities/marker.entity';

@Module({
    imports: [JwtAuthModule, ConfigModule, TypeOrmModule.forFeature([MapMarkerReply, Map, User, UserAccessibleMap, UserFavoriteMap, Marker])],
    controllers: [ReplyController],
    providers: [ReplyService, MarkerService]
})
export class ReplyModule {}
