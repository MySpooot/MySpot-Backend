import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards, Headers } from '@nestjs/common';
import { ApiHeader, ApiOkResponse } from '@nestjs/swagger';

import { JwtAuthGuard } from '../lib/jwt';
import { MapService } from './map.service';
import { User_, AuthUser } from '../lib/user_decorator';
import { DeleteUserMapParam } from './dto/delete_user_map.dto';
import { GetUserMapsQuery, GetUserMapsResponse } from './dto/get_user_maps.dto';
import { PostUserMapBody, PostUserMapResponse } from './dto/post_user_map.dto';
import { GetUserRecentMapsQuery, GetUserRecentMapsResponse } from './dto/get_user_recent_maps.dto';
import { PostUserRecentMapParam } from './dto/post_user_recent_map.dto';
import { DeleteUserRecentMapParam } from './dto/delete_user_recent_map.dto';
import { GetUserFavoriteMapsQuery, GetUserFavoriteMapsResponse } from './dto/get_user_favorite_maps.dto';
import { PostUserFavoriteMapParam } from './dto/post_user_favorite_map.dto';
import { DeleteUserFavoriteMapParam } from './dto/delete_user_favorite_map.dto';
import { GetMapDetailHeaders, GetMapDetailParam, GetMapDetailResponse } from './dto/get_map_detail.dto';
import { GetMapCodeParam, GetMapCodeResponse } from './dto/get_map_code.dto';
import { PostMapCodeMatchBody, PostMapCodeMatchHeaders, PostMapCodeMatchParam } from './dto/post_map_code_match.dto';

@Controller('/map')
export class MapController {
    constructor(private readonly mapService: MapService) {}

    @Get()
    @UseGuards(JwtAuthGuard)
    @ApiHeader({ name: 'Authorization', required: true })
    @ApiOkResponse({ type: [GetUserMapsResponse] })
    getUserMaps(@User_() user: AuthUser, @Query() query: GetUserMapsQuery) {
        return this.mapService.getUserMaps(user, query);
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiHeader({ name: 'Authorization', required: true })
    @ApiOkResponse({ type: PostUserMapResponse })
    insertUserMap(@User_() user: AuthUser, @Body() body: PostUserMapBody) {
        return this.mapService.insertUserMap(user, body);
    }

    @Delete('/:mapId')
    @UseGuards(JwtAuthGuard)
    @ApiHeader({ name: 'Authorization', required: true })
    @ApiOkResponse()
    deleteUserMap(@Param() param: DeleteUserMapParam) {
        return this.mapService.deleteUserMap(param);
    }

    @Get('/recent')
    @UseGuards(JwtAuthGuard)
    @ApiHeader({ name: 'Authorization', required: true })
    @ApiOkResponse({ type: [GetUserRecentMapsResponse] })
    getUserRecentMaps(@User_() user: AuthUser, @Query() query: GetUserRecentMapsQuery) {
        return this.mapService.getUserRecentMaps(user, query);
    }

    @Post('/recent/:recentMapId')
    @UseGuards(JwtAuthGuard)
    @ApiHeader({ name: 'Authorization', required: true })
    @ApiOkResponse()
    insertUserRecentMap(@User_() user: AuthUser, @Param() param: PostUserRecentMapParam) {
        return this.mapService.insertUserRecentMap(user, param);
    }

    @Delete('/recent/:recentMapId')
    @UseGuards(JwtAuthGuard)
    @ApiHeader({ name: 'Authorization', required: true })
    @ApiOkResponse()
    deleteUserRecentMap(@User_() user: AuthUser, @Param() param: DeleteUserRecentMapParam) {
        return this.mapService.deleteUserRecentMap(user, param);
    }

    @Get('/favorite')
    @UseGuards(JwtAuthGuard)
    @ApiHeader({ name: 'Authorization', required: true })
    @ApiOkResponse({ type: [GetUserFavoriteMapsResponse] })
    getUserFavoriteMaps(@User_() user: AuthUser, @Query() query: GetUserFavoriteMapsQuery) {
        return this.mapService.getUserFavoriteMaps(user, query);
    }

    @Post('/favorite/:favoriteMapId')
    @UseGuards(JwtAuthGuard)
    @ApiHeader({ name: 'Authorization', required: true })
    @ApiOkResponse()
    insertUserFavoriteMap(@User_() user: AuthUser, @Param() param: PostUserFavoriteMapParam) {
        return this.mapService.insertUserFavoriteMap(user, param);
    }

    @Delete('/favorite/:favoriteMapId')
    @UseGuards(JwtAuthGuard)
    @ApiHeader({ name: 'Authorization', required: true })
    @ApiOkResponse()
    deleteUserFavoriteMap(@User_() user: AuthUser, @Param() param: DeleteUserFavoriteMapParam) {
        return this.mapService.deleteUserFavoriteMap(user, param);
    }

    @Get('/:mapId/detail')
    @ApiHeader({ name: 'Authorization', required: false })
    @ApiOkResponse({ type: GetMapDetailResponse })
    getMapDetail(@Headers() headers: GetMapDetailHeaders, @Param() param: GetMapDetailParam) {
        return this.mapService.getMapDetail(headers, param);
    }

    @Get('/:mapId/code')
    @UseGuards(JwtAuthGuard)
    @ApiHeader({ name: 'Authorization', required: true })
    @ApiOkResponse({ type: GetMapCodeResponse })
    getMapCode(@Param() param: GetMapCodeParam) {
        return this.mapService.getMapCode(param);
    }

    @Post('/:mapId/code/match')
    @ApiHeader({ name: 'Authorization', required: false })
    @ApiOkResponse({ type: Boolean })
    getMapCodeMatch(@Headers() headers: PostMapCodeMatchHeaders, @Param() param: PostMapCodeMatchParam, @Body() body: PostMapCodeMatchBody) {
        return this.mapService.getMapCodeMatch(headers, param, body);
    }
}
