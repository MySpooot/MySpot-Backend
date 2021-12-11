import { Body, Controller, Get, Post, UseGuards, Headers, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../lib/jwt_guard';

import {User} from '../lib/user_decorator'
import { AuthService } from './auth.service';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/logIn')
  kakao(@Body() body){
    return this.authService.logIn(body);
  }

  @Get('/me') 
  @UseGuards(JwtAuthGuard)
  me(@User() headers){
    return this.authService.me(headers);
  }
}
