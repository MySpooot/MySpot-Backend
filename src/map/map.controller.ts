import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../lib/jwt_guard';
import { MapService } from './map.service';
import { User_, AuthUser } from '../lib/user_decorator';
import { DeleteUserMapParam } from './dto/delete_user_map.dto';
import { GetUserMapsQuery } from './dto/get_user_maps.dto';
import { PostUserMapBody } from './dto/post_user_map.dto';
import { GetUserRecentMapsQuery } from './dto/get_user_recent_maps.dto';
import { PostUserRecentMapParam } from './dto/post_user_recent_map.dto';
import { DeleteUserRecentMapParam } from './dto/delete_user_recent_map.dto';
import { GetUserFavoriteMapsQuery } from './dto/get_user_favorite_maps.dto';
import { PostUserFavoriteMapParam } from './dto/post_user_favorite_map.dto';
import { DeleteUserFavoriteMapParam } from './dto/delete_user_favorite_map.dto';
import { GetMapDetailParam } from './dto/get_map_detail.dto';
import { GetMapCodeParam } from './dto/get_map_code.dto';

@Controller('/map')
export class MapController {
    constructor(private readonly mapService: MapService) {}

    @Get()
    @UseGuards(JwtAuthGuard)
    getUserMaps(@User_() user: AuthUser, @Query() query: GetUserMapsQuery) {
        return this.mapService.getUserMaps(user, query);
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    insertUserMap(@User_() user, @Body() body: PostUserMapBody) {
        return this.mapService.insertUserMap(user, body);
    }

    @Delete('/:mapId')
    @UseGuards(JwtAuthGuard)
    deleteUserMap(@Param() param: DeleteUserMapParam) {
        return this.mapService.deleteUserMap(param);
    }

    @Get('/recent')
    @UseGuards(JwtAuthGuard)
    getUserMapLogs(@User_() user: AuthUser, @Query() query: GetUserRecentMapsQuery) {
        return this.mapService.getUserRecentMaps(user, query);
    }

    @Post('/recent/:recentMapId')
    @UseGuards(JwtAuthGuard)
    insertUserRecentMap(@User_() user: AuthUser, @Param() param: PostUserRecentMapParam) {
        return this.mapService.insertUserRecentMap(user, param);
    }

    @Delete('/recent/:recentMapId')
    @UseGuards(JwtAuthGuard)
    deleteUserRecentMap(@User_() user: AuthUser, @Param() param: DeleteUserRecentMapParam) {
        return this.mapService.deleteUserRecentMap(user, param);
    }

    @Get('/favorite')
    @UseGuards(JwtAuthGuard)
    getUserFavoriteMaps(@User_() user: AuthUser, @Query() query: GetUserFavoriteMapsQuery) {
        return this.mapService.getUserFavoriteMaps(user, query);
    }

    @Post('/favorite/:favoriteMapId')
    @UseGuards(JwtAuthGuard)
    insertUserFavoriteMap(@User_() user: AuthUser, @Param() param: PostUserFavoriteMapParam) {
        return this.mapService.insertUserFavoriteMap(user, param);
    }

    @Delete('/favorite/:favoriteMapId')
    @UseGuards(JwtAuthGuard)
    deleteUserFavoriteMap(@User_() user: AuthUser, @Param() param: DeleteUserFavoriteMapParam) {
        return this.mapService.deleteUserFavoriteMap(user, param);
    }

    @Get('/:mapId/detail/')
    @UseGuards(JwtAuthGuard)
    getMapAccessible(@User_() user: AuthUser, @Param() param: GetMapDetailParam) {
        return this.mapService.getMapDetail(user, param);
    }

    @Get('/:mapId/code/')
    @UseGuards(JwtAuthGuard)
    getMapCode(@User_() user: AuthUser, @Param() param: GetMapCodeParam) {
        return this.mapService.getMapCode(user, param);
    }
}
