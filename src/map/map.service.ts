import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';

import { AuthUser } from '../lib/user_decorator';
import { Map, MapActive } from '../entities/map.entity';
import { GetMyMapsQuery, GetMyMapsResponse } from './dto/get_my_map.dto';
import { PostMyMapBody } from './dto/post_my_map.dto';
import { DeleteMyMapParam } from './dto/delete_my_map.dto';

@Injectable()
export class MapService {
    constructor(private readonly connection: Connection) {}

    // select my maps
    async getMyMaps({ userId }: AuthUser, { offset = 0, limit = 3 }: GetMyMapsQuery) {
        //@TODO 정렬기준, offset, limit 정하기
        const myMaps = await this.connection
            .getRepository(Map)
            .find({ where: { user_id: userId, active: MapActive.Active }, skip: offset, take: limit, order: { id: 'DESC' } });

        return myMaps.map(GetMyMapsResponse.from);
    }

    // insert my map
    async insertMyMap({ userId }: AuthUser, { mapName }: PostMyMapBody) {
        await this.connection.getRepository(Map).insert({ user_id: userId, name: mapName });
    }

    // delete my map
    async deleteMyMap({ mapId }: DeleteMyMapParam) {
        await this.connection.getRepository(Map).update({ id: mapId }, { active: MapActive.Inactive });
    }
}
