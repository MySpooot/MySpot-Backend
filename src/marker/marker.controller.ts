import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards, Headers } from '@nestjs/common';
import { ApiHeader, ApiOkResponse } from '@nestjs/swagger';

import { AuthUser, User_ } from '../lib/user_decorator';
import { JwtAuthGuard } from '../lib/jwt';
import { MarkerService } from './marker.service';
import { PostMarkerBody, PostMarkerParam, PostMarkerResponse } from './dto/post_marker.dto';
import { GetMarkersHeaders, GetMarkersParam, GetMarkersResponse } from './dto/get_markers.dto';
import { DeleteMarkerParam } from './dto/delete_marker.dto';
import { PostMarkerLikeParam } from './dto/post_marker_like.dto';
import { DeleteMarkerLikeParam } from './dto/delete_marker_like.dto';
import { PostMyLocationBody } from './dto/post_my_location.dto';
import { DeleteMyLocationParam } from './dto/delete_my_location.dto';
import { GetMyLocationsQuery, GetMyLocationsResponse } from './dto/get_my_locations.dto';

@Controller('/map')
export class MarkerController {
    constructor(private readonly markerService: MarkerService) {}

    @Get('/:mapId/marker')
    @ApiHeader({ name: 'Authorization', required: false })
    @ApiOkResponse({ type: [GetMarkersResponse] })
    getMarkers(@Headers() headers: GetMarkersHeaders, @Param() param: GetMarkersParam) {
        return this.markerService.getMarkers(headers, param);
    }

    @Post('/:mapId/marker')
    @UseGuards(JwtAuthGuard)
    @ApiHeader({ name: 'Authorization', required: true })
    @ApiOkResponse({ type: PostMarkerResponse })
    insertMarker(@User_() user: AuthUser, @Param() param: PostMarkerParam, @Body() body: PostMarkerBody) {
        return this.markerService.insertMarker(user, param, body);
    }

    @Delete('/marker/:markerId')
    @UseGuards(JwtAuthGuard)
    @ApiHeader({ name: 'Authorization', required: true })
    @ApiOkResponse()
    deleteMarker(@User_() user: AuthUser, @Param() param: DeleteMarkerParam) {
        return this.markerService.deleteMarker(user, param);
    }

    @Post('/marker/:markerId/like')
    @UseGuards(JwtAuthGuard)
    @ApiHeader({ name: 'Authorization', required: true })
    @ApiOkResponse()
    insertMarkerLike(@User_() user: AuthUser, @Param() param: PostMarkerLikeParam) {
        return this.markerService.insertMarkerLike(user, param);
    }

    @Delete('/marker/:markerId/like')
    @UseGuards(JwtAuthGuard)
    @ApiHeader({ name: 'Authorization', required: true })
    @ApiOkResponse()
    deleteMarkerLike(@User_() user: AuthUser, @Param() param: DeleteMarkerLikeParam) {
        return this.markerService.deleteMarkerLike(user, param);
    }

    @Get('/marker/location')
    @UseGuards(JwtAuthGuard)
    @ApiHeader({ name: 'Authorization', required: true })
    @ApiOkResponse({ type: [GetMyLocationsResponse] })
    getMyLocations(@User_() user: AuthUser, @Query() query: GetMyLocationsQuery) {
        return this.markerService.getMyLocations(user, query);
    }

    @Post('/marker/location')
    @UseGuards(JwtAuthGuard)
    @ApiHeader({ name: 'Authorization', required: true })
    @ApiOkResponse()
    insertMyLocation(@User_() user: AuthUser, @Body() body: PostMyLocationBody) {
        return this.markerService.insertMyLocation(user, body);
    }

    @Delete('/marker/location/:addressId')
    @UseGuards(JwtAuthGuard)
    @ApiHeader({ name: 'Authorization', required: true })
    @ApiOkResponse()
    deleteMyLocation(@User_() user: AuthUser, @Param() param: DeleteMyLocationParam) {
        return this.markerService.deleteMyLocation(user, param);
    }
}
