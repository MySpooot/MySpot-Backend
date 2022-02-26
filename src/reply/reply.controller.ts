import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';

import { AuthUser, User_ } from '../lib/user_decorator';
import { JwtAuthGuard } from '../lib/jwt';
import { ReplyService } from './reply.service';
import { PostMarkerReplyBody, PostMarkerReplyParam, PostMarkerReplyResponse } from './dto/post_marker_reply.dto';
import { GetMarkerRepliesParam, GetMarkerRepliesQuery, GetMarkerRepliesResponse } from './dto/get_marker_replies.dto';
import { DeleteMarkerReplyParam } from './dto/delete_marker_reply.dto';
import { PutMarkerReplyBody, PutMarkerReplyParam } from './dto/put_marker_reply.dto';

@Controller('/map/marker')
export class ReplyController {
    constructor(private readonly replyService: ReplyService) {}

    @Get('/:markerId/replies')
    @ApiOkResponse({ type: [GetMarkerRepliesResponse] })
    getMarkerReplies(@Param() param: GetMarkerRepliesParam, @Query() query: GetMarkerRepliesQuery) {
        return this.replyService.getMarkerReplies(param, query);
    }

    @Post('/:markerId/replies')
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({ type: PostMarkerReplyResponse })
    insertMarkerReply(@User_() user: AuthUser, @Param() param: PostMarkerReplyParam, @Body() body: PostMarkerReplyBody) {
        return this.replyService.insertMarkerReply(user, param, body);
    }

    @Put('/replies/:replyId')
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse()
    updateMarkerReply(@User_() user: AuthUser, @Param() param: PutMarkerReplyParam, @Body() body: PutMarkerReplyBody) {
        return this.replyService.updateMarkerReply(user, param, body);
    }

    @Delete('/replies/:replyId')
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse()
    deleteMarkerReply(@User_() user: AuthUser, @Param() param: DeleteMarkerReplyParam) {
        return this.replyService.deleteMarkerReply(user, param);
    }
}
