import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';

import { AuthUser, User_ } from '../lib/user_decorator';
import { JwtAuthGuard } from '../lib/jwt_guard';
import { MarkerService } from './marker.service';
import { PostMarkerBody, PostMarkerParam } from './dto/post_marker.dto';
import { GetMarkersParam, GetMarkersResponse } from './dto/get_markers.dto';
import { DeleteMarkerParam } from './dto/delete_marker.dto';
import { ApiOkResponse } from '@nestjs/swagger';

@Controller('/map')
export class MarkerController {
    constructor(private readonly markerService: MarkerService) {}

    @Get('/:mapId/marker')
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({ type: [GetMarkersResponse] })
    getMarkers(@Param() param: GetMarkersParam) {
        return this.markerService.getMarkers(param);
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
}
