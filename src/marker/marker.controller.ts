import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';

import { AuthUser, User_ } from '../lib/user_decorator';
import { JwtAuthGuard } from '../lib/jwt_guard';
import { MarkerService } from './marker.service';
import { PostMarkerBody, PostMarkerParam } from './dto/post_marker.dto';
import { GetMarkersParam, GetMarkersResponse } from './dto/get_markers.dto';
import { DeleteMarkerParam } from './dto/delete_marker.dto';
import { PostMarkerLikeParam } from './dto/post_marker_like.dto';
import { DeleteMarkerLikeParam } from './dto/delete_marker_like.dto';

@Controller('/map')
export class MarkerController {
    constructor(private readonly markerService: MarkerService) {}

    @Get('/:mapId/marker')
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({ type: [GetMarkersResponse] })
    getMarkers(@User_() user, @Param() param: GetMarkersParam) {
        return this.markerService.getMarkers(user, param);
    }

    @Post('/:mapId/marker')
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse()
    insertMarker(@User_() user: AuthUser, @Param() param: PostMarkerParam, @Body() body: PostMarkerBody) {
        return this.markerService.insertMarker(user, param, body);
    }

    @Delete('/marker/:markerId')
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse()
    deleteMarker(@User_() user: AuthUser, @Param() param: DeleteMarkerParam) {
        return this.markerService.deleteMarker(user, param);
    }

    @Post('/marker/:markerId/like')
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse()
    getMarkerLike(@User_() user: AuthUser, @Param() param: PostMarkerLikeParam) {
        return this.markerService.insertMarkerLike(user, param);
    }

    @Delete('/marker/:markerId/like')
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse()
    deleteMarkerLike(@User_() user: AuthUser, @Param() param: DeleteMarkerLikeParam) {
        return this.markerService.deleteMarkerLike(user, param);
    }

    @Post('/marker/location')
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse()
    insertMylocation(@User_() user: AuthUser, @Param() param) {
        return this.markerService.
    }
}
