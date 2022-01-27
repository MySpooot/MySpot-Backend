import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';

import { AuthUser, User_ } from '../lib/user_decorator';
import { JwtAuthGuard } from '../lib/jwt_guard';
import { ReplyService } from './reply.service';
import { PostMarkerReplyBody, PostMarkerReplyResponse } from './dto/post_map_marker_reply.dto';
import { GetMarkerRepliesQuery } from './dto/get_marker_replies.dto';

@Controller('/map/marker/replies')
export class ReplyController {
    constructor(private readonly replyService: ReplyService) {}

    @Get()
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse()
    getMarkerReplies(@Query() query: GetMarkerRepliesQuery) {
        return this.replyService.getMarkerReplies(query);
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({ type: PostMarkerReplyResponse })
    insertMarkerReply(@User_() user: AuthUser, @Body() body: PostMarkerReplyBody) {
        return this.replyService.insertMarkerReply(user, body);
    }
}
