import { Controller, Post, UseGuards, UseInterceptors, UploadedFile, Put, Body } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiHeader, ApiOkResponse } from '@nestjs/swagger';
import { AmazonS3FileInterceptor } from 'nestjs-multer-extended';

import { JwtAuthGuard } from '../lib/jwt';
import { AuthUser, User_ } from '../lib/user_decorator';
import { PostUploadImageBody } from './dto/post_upload_image.dto';
import { PutUserNicknameBody, PutUserNicknameResponse } from './dto/put_user_nickname.dto';
import { UserService } from './user.service';

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
        AmazonS3FileInterceptor('file', {
            randomFilename: true
        })
    )
    uploadFile(@User_() user: AuthUser, @UploadedFile() file) {
        return this.userService.uploadImage(user, file);
    }
}
