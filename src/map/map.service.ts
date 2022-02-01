import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';

import { AuthUser } from '../lib/user_decorator';
import { GetUserMapsQuery, GetUserMapsResponse } from './dto/get_user_maps.dto';
import { PostUserMapBody } from './dto/post_user_map.dto';
import { DeleteUserMapParam } from './dto/delete_user_map.dto';
import { GetUserRecentMapsQuery, GetUserRecentMapsResponse } from './dto/get_user_recent_maps.dto';
import { UserRecentMap, UserRecentMapActive } from '../entities/user_recent_map.entity';
import { Map, MapActive } from '../entities/map.entity';
import { PostUserRecentMapParam } from './dto/post_user_recent_map.dto';
import { DeleteUserRecentMapParam } from './dto/delete_user_recent_map.dto';
import { GetUserFavoriteMapsQuery, GetUserFavoriteMapsResponse } from './dto/get_user_favorite_maps.dto';
import { UserFavoriteMap, UserFavoriteMapActive } from '../entities/user_favorite_map.entity';
import { PostUserFavoriteMapParam } from './dto/post_user_favorite_map.dto';
import { DeleteUserFavoriteMapParam } from './dto/delete_user_favorite_map.dto';
import { UserAccessibleMap, UserAccessibleMapActive } from '../entities/user_accessible_map.entity';
import { GetMapDetailParam, GetMapDetailResponse } from './dto/get_map_detail.dto';
import { GetMapCodeParam, GetMapCodeResponse } from './dto/get_map_code.dto';

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
        // 1. map insert
        const insertMap = await this.connection
            .getRepository(Map)
            .insert(
                Object.assign({ user_id: userId, name: mapName, is_private: isPrivate }, isPrivate === true ? { code: this.makePrivateCode() } : {})
            );

        // 2. accessible insert
        await this.connection.getRepository(UserAccessibleMap).insert({ user_id: userId, map_id: insertMap.generatedMaps[0].id });
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
    async insertUserRecentMap({ userId }: AuthUser, { recentMapId }: PostUserRecentMapParam) {
        // 1. recent mpa이 존재하는지 조회
        const recentMap = await this.connection.getRepository(UserRecentMap).findOne({ user_id: userId, map_id: recentMapId });

        // 2. 이미 존재한다면 update modified, 존재하지 않는다면 insert
        if (recentMap) {
            await this.connection.getRepository(UserRecentMap).update({}, {});
        } else {
            await this.connection.getRepository(UserRecentMap).insert({ user_id: userId, map_id: recentMapId });
        }
    }

    // delete recent map
    async deleteUserRecentMap({ userId }: AuthUser, { recentMapId }: DeleteUserRecentMapParam) {
        await this.connection.getRepository(UserRecentMap).update({ user_id: userId, map_id: recentMapId }, { active: UserRecentMapActive.Inactive });
    }

    // get favorite maps
    async getUserFavoriteMaps({ userId }: AuthUser, { offset = 0, limit = 6 }: GetUserFavoriteMapsQuery) {
        const favoriteMaps = await this.connection
            .getRepository(UserFavoriteMap)
            .createQueryBuilder('user_favorite_map')
            .innerJoinAndSelect('user_favorite_map.map', 'map', 'map.active=:mActive', { mActive: MapActive.Active })
            .where('user_favorite_map.user_id=:userId AND user_favorite_map.active=:ufmActive', { userId, ufmActive: UserFavoriteMapActive.Active })
            .orderBy({ 'user_favorite_map.modified': 'DESC' })
            .skip(offset)
            .take(limit)
            .getMany();

        return favoriteMaps.map(GetUserFavoriteMapsResponse.from);
    }

    // insert favorite map
    async insertUserFavoriteMap({ userId }: AuthUser, { favoriteMapId }: PostUserFavoriteMapParam) {
        await this.connection.getRepository(UserFavoriteMap).insert({ user_id: userId, map_id: favoriteMapId });
    }

    // delete favorite map
    async deleteUserFavoriteMap({ userId }: AuthUser, { favoriteMapId }: DeleteUserFavoriteMapParam) {
        await this.connection
            .getRepository(UserFavoriteMap)
            .update({ user_id: userId, map_id: favoriteMapId }, { active: UserFavoriteMapActive.Inactive });
    }

    // get map detail
    async getMapDetail({ userId }: AuthUser, { mapId }: GetMapDetailParam) {
        const mapDetail = await this.connection
            .getRepository(Map)
            .createQueryBuilder('map')
            .leftJoinAndSelect('map.accessible', 'accessible', 'accessible.user_id=:aUserId AND accessible.active=:aActive', {
                aUserId: userId,
                aActive: UserAccessibleMapActive.Active
            })
            .leftJoinAndSelect(
                'map.favoriteMap',
                'favoriteMap',
                'favoriteMap.user_id=:userId AND favoriteMap.map_id=:mapId AND favoriteMap.active=:active',
                {
                    userId,
                    mapId,
                    active: UserFavoriteMapActive.Active
                }
            )
            .where('map.id=:mapId AND map.active=:active', { mapId, active: MapActive.Active })
            .getOne();

        return GetMapDetailResponse.from(mapDetail);
    }

    // private map일 시 난수 4자리 생성
    makePrivateCode(): string {
        let code = '';

        for (let i = 0; i < 4; i++) {
            code += Math.floor(Math.random() * 10);
        }

        return code;
    }

    // get map code
    async getMapCode({ mapId }: GetMapCodeParam) {
        const mapCode = await this.connection.getRepository(Map).findOne({ id: mapId });

        return GetMapCodeResponse.from(mapCode);
    }
}
