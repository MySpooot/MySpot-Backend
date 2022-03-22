import { Body, Controller, Get, Param, Post, Put, UseGuards, Headers } from '@nestjs/common';
import { ApiHeader, ApiOkResponse } from '@nestjs/swagger';

import { JwtAuthGuard } from '../lib/jwt';
import { AuthUser, User_ } from '../lib/user_decorator';
import { AuthService } from './auth.service';
import { GetMeResponse } from './dto/get_me.dto';
import { PostLoginBody, PostLoginHeaders, PostLoginResponse } from './dto/post_login.dto';
import { PutUserBody, PutUserParam, PutUserResponse } from './dto/put_user.dto';

@Controller('/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('/login')
    @ApiHeader({ name: 'Authorization', required: false })
    @ApiOkResponse({ type: PostLoginResponse })
    login(@Headers() headers: PostLoginHeaders, @Body() body: PostLoginBody) {
        console.log('tests');
        return this.authService.login(headers, body);
    }

    @Get('/me')
    @UseGuards(JwtAuthGuard)
    @ApiHeader({ name: 'Authorization', required: true })
    @ApiOkResponse({ type: GetMeResponse })
    me(@User_() user: AuthUser) {
        return this.authService.me(user);
    }

    @Put('/user/:userId')
    @ApiHeader({ name: 'Authorization', required: true })
    @ApiOkResponse({ type: PutUserResponse })
    updateUser(@Param() param: PutUserParam, @Body() body: PutUserBody) {
        return this.authService.updateUser(param, body);
    }

    // app api는 swagger response 제외
    @Post('/app/login')
    @ApiOkResponse()
    appLogin(@Body() body) {
        return this.authService.loginProcess(body);
    }

    // @TODO 로그아웃 추후 개발 예정
    // @Post('/logout')
    // @UseGuards(JwtAuthGuard)
    // logout(@Body() body) {
    //     return this.authService.logout(body);
    // }
}
