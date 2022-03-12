import { Controller, Post, UseGuards, UseInterceptors, UploadedFile, Put, Body } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiHeader, ApiOkResponse } from '@nestjs/swagger';
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
    region: 'ap-northeast-2'
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
                contentType: multerS3.AUTO_CONTENT_TYPE,
                key: function (req, file, cb) {
                    cb(null, file.originalname);
                }
            }),
            limits: { fileSize: 1024 * 1024 }
        })
    )
    uploadFile(@User_() user: AuthUser, @UploadedFile() file) {
        console.log(process.env.ACCESS_KEY_ID);
        console.log(typeof process.env.ACCESS_KEY_ID);
        return this.userService.uploadImage(user, file);
    }
}
