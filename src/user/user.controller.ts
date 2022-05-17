import { Controller, Post, UseGuards, UseInterceptors, UploadedFile, Put, Body, BadRequestException } from '@nestjs/common';
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
    accessKeyId: process.env.A_KEY,
    secretAccessKey: process.env.A_S_KEY,
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
            storage: multerS3({
                s3: s3,
                bucket:
                    process.env.NODE_ENV === 'test'
                        ? 'myspot-dev/test'
                        : process.env.stage === 'dev'
                        ? 'myspot-dev/user/thumbnail'
                        : 'myspot-prod/user/thumbnail',
                acl: 'public-read',
                contentType: multerS3.AUTO_CONTENT_TYPE,
                key: (_, __, cb) => {
                    cb(null, `${Date.now().toString()} - ${v4()}`);
                }
            }),
            limits: { fileSize: 1024 * 1024 * 5 },
            fileFilter: (_, file, cb) => {
                if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
                    cb(null, true);
                } else throw new BadRequestException('only png, jpeg, jpg types are allowed');
            }
        })
    )
    uploadFile(@User_() user: AuthUser, @UploadedFile() file) {
        return this.userService.uploadImage(user, file);
    }
}
