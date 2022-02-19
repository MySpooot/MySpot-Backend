import { Controller, Post, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { AmazonS3FileInterceptor } from 'nestjs-multer-extended';

import { JwtAuthGuard } from '../lib/jwt';
import { AuthUser, User_ } from '../lib/user_decorator';
import { UserService } from './user.service';

@Controller('/user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post('/upload')
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({ type: String })
    @UseInterceptors(
        AmazonS3FileInterceptor('file', {
            randomFilename: true
        })
    )
    uploadFile(@User_() user: AuthUser, @UploadedFile() file) {
        return this.userService.uploadImage(user, file);
    }
}
