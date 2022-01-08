import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../lib/jwt_guard';
import { MapService } from './map.service';
import { User_, AuthUser } from '../lib/user_decorator';
import { DeleteMyMapParam } from './dto/delete_my_map.dto';
import { GetMyMapsQuery } from './dto/get_my_map.dto';
import { PostMyMapBody } from './dto/post_my_map.dto';

@Controller('/map')
export class MapController {
    constructor(private readonly mapService: MapService) {}

    @Get('/my')
    @UseGuards(JwtAuthGuard)
    getMyMaps(@User_() user: AuthUser, @Query() query: GetMyMapsQuery) {
        return this.mapService.getMyMaps(user, query);
    }

    @Post('/my')
    @UseGuards(JwtAuthGuard)
    insertMyMap(@User_() user, @Body() body: PostMyMapBody) {
        return this.mapService.insertMyMap(user, body);
    }

    @Delete('/my/:mapId')
    @UseGuards(JwtAuthGuard)
    deleteMyMap(@Param() param: DeleteMyMapParam) {
        return this.mapService.deleteMyMap(param);
    }

    // @Get('/favorite')

    // @Get('/recent')
}
