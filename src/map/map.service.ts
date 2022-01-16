import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';

import { AuthUser } from '../lib/user_decorator';
import { GetUserMapsQuery, GetUserMapsResponse } from './dto/get_user_map.dto';
import { PostUserMapBody } from './dto/post_user_map.dto';
import { DeleteUserMapParam } from './dto/delete_user_map.dto';
import { GetUserRecentMapsQuery, GetUserRecentMapsResponse } from './dto/get_user_recent_maps.dto';
import { UserRecentMap, UserRecentMapActive } from '../entities/user_recent_map.entity';
import { Map, MapActive } from '../entities/map.entity';
import { PostUserRecentMapParam } from './dto/post_user_recent_map.dto';
import { DeleteUserRecentMapParam } from './dto/delete_user_recent_map.dto';

@Injectable()
export class MapService {
    constructor(private readonly connection: Connection) {}

    // select my maps
    async getUserMaps({ userId }: AuthUser, { offset = 0, limit = 6 }: GetUserMapsQuery) {
        //@TODO 정렬기준, offset, limit 정하기
        const myMaps = await this.connection
            .getRepository(Map)
            .find({ where: { user_id: userId, active: MapActive.Active }, skip: offset, take: limit, order: { id: 'DESC' } });

        return myMaps.map(GetUserMapsResponse.from);
    }

    // insert my map
    async insertUserMap({ userId }: AuthUser, { mapName, isPrivate }: PostUserMapBody) {
        await this.connection.getRepository(Map).insert({ user_id: userId, name: mapName, is_private: isPrivate });
    }

    // delete my map
    async deleteUserMap({ mapId }: DeleteUserMapParam) {
        await this.connection.getRepository(Map).update({ id: mapId }, { active: MapActive.Inactive });
    }

    // select recent maps
    async getUserRecentMaps({ userId }: AuthUser, { offset = 0, limit = 6 }: GetUserRecentMapsQuery) {
        //@TODO offset, limit 정하기
        const recentMaps = await this.connection
            .getRepository(UserRecentMap)
            .createQueryBuilder('user_recent_map')
            .innerJoinAndSelect('user_recent_map.map', 'map', 'map.active=:mActive', { mActive: MapActive.Active })
            .where('user_recent_map.user_id=:userId AND user_recent_map.active=:urmActive', { userId, urmActive: UserRecentMapActive.Active })
            .orderBy({ 'user_recent_map.modified': 'DESC' })
            .skip(offset)
            .take(limit)
            .getMany();

        return recentMaps.map(GetUserRecentMapsResponse.from);
    }

    // insert recent map
    async insertUserRecentMap({ userId }: AuthUser, { mapId }: PostUserRecentMapParam) {
        // 1. recent mpa이 존재하는지 조회
        const recentMap = await this.connection.getRepository(UserRecentMap).findOne({ user_id: userId, map_id: mapId });

        // 2. 이미 존재한다면 update modified, 존재하지 않는다면 insert
        if (recentMap) {
            await this.connection.getRepository(UserRecentMap).update({}, {});
        } else {
            await this.connection.getRepository(UserRecentMap).insert({ user_id: userId, map_id: mapId });
        }
    }

    // delete recent map
    async deleteUserRecentMap({ recentMapId }: DeleteUserRecentMapParam) {
        await this.connection.getRepository(UserRecentMap).update({ id: recentMapId }, { active: UserRecentMapActive.Inactive });
    }
}
