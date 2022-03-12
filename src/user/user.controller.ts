import { Controller, Post, UseGuards, UseInterceptors, UploadedFile, Put, Body } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiHeader, ApiOkResponse } from '@nestjs/swagger';
import { v4 } from 'uuid';
import multerS3 from 'multer-s3';
import AWS from 'aws-sdk';

import { JwtAuthGuard } from '../lib/jwt';
import { AuthUser, User_ } from '../lib/user_decorator';
import { PostUploadImageBody } from './dto/post_upload_image.dto';
import { PutUserNicknameBody, PutUserNicknameResponse } from './dto/put_user_nickname.dto';
import { UserService } from './user.service';

AWS.config.update({
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    region: process.env.REGION
});
const s3 = new AWS.S3();

@Controller('/user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Put()
    @UseGuards(JwtAuthGuard)
    @ApiHeader({ name: 'Authorization', required: true })
    @ApiOkResponse({ type: PutUserNicknameResponse })
    updateUserNickname(@User_() user: AuthUser, @Body() body: PutUserNicknameBody) {
        return this.userService.updateUserNickname(user, body);
    }

    @Post('/upload')
    @UseGuards(JwtAuthGuard)
    @ApiHeader({ name: 'Authorization', required: true })
    @ApiOkResponse({ type: String })
    @ApiBody({ type: PostUploadImageBody })
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: new multerS3({
                s3: s3,
                bucket: 'myspot-dev/user/thumbnail',
                acl: 'public-read',
                contentType: 'image/png',
                key: function (_, __, cb) {
                    cb(null, `${Date.now().toString()} - ${v4()}`);
                }
            }),
            limits: { fileSize: 1024 * 1024 }
        })
    )
    uploadFile(@User_() user: AuthUser, @UploadedFile() file) {
        return this.userService.uploadImage(user, file);
    }
}
