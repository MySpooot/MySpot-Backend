import { Body, Controller, Get, Param, Post, Put, UseGuards, Headers, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOkResponse } from '@nestjs/swagger';
// import { Express } from 'express';
import multerS3 from 'multer-s3';
import * as AWS from 'aws-sdk';

import { JwtAuthGuard } from '../lib/jwt';
import { AuthUser, User_ } from '../lib/user_decorator';
import { AuthService } from './auth.service';
import { GetMeResponse } from './dto/get_me.dto';
import { PostLoginBody, PostLoginHeaders, PostLoginResponse } from './dto/post_login.dto';
import { PutUserBody, PutUserParam, PutUserResponse } from './dto/put_user.dto';

const s3 = new AWS.S3();
AWS.config.update({
    region: 'ap-northeast-2',
    accessKeyId: 'AKIAUZRO6TALVTQZU2V7',
    secretAccessKey: '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'
});

@Controller('/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('/login')
    @ApiOkResponse({ type: PostLoginResponse })
    login(@Headers() headers: PostLoginHeaders, @Body() body: PostLoginBody) {
        return this.authService.login(headers, body);
    }

    @Get('/me')
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({ type: GetMeResponse })
    me(@User_() user: AuthUser) {
        return this.authService.me(user);
    }

    @Put('/user/:userId')
    @ApiOkResponse({ type: PutUserResponse })
    updateUser(@Param() param: PutUserParam, @Body() body: PutUserBody) {
        return this.authService.updateUser(param, body);
    }

    // @TODO app api는 swagger response 제외
    @Post('/appLogin')
    @ApiOkResponse()
    appLogin(@Body() body) {
        return this.authService.loginProcess(body);
    }

    // @Post('/upload')
    // @UseGuards(JwtAuthGuard)
    // @UseInterceptors(FileInterceptor('file'))
    // // @ApiOkResponse({type: GetFileUploadUrlResponse})
    // uploadImage(@User_() user: AuthUser, @UploadedFile() file) {
    //     return this.authService.uploadImage(user, file);
    // }
    s3 = new AWS.S3();
    @Post('/upload')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: multerS3({
                s3: s3,
                bucket: 'dev-myspot',
                acl: 'public-read',
                key: function (req, file, cb) {
                    cb(null, file.originalname);
                }
            })
        })
    )
    async uploadImage(@UploadedFile() file: Express.Multer.File) {
        console.log(file);
        return this.authService.uploadImage(file);
    }

    // @TODO 로그아웃 추후 개발 예정
    // @Post('/logout')
    // @UseGuards(JwtAuthGuard)
    // logout(@Body() body) {
    //     return this.authService.logout(body);
    // }
}
