import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { Connection } from 'typeorm';

import { AuthService } from './auth.service';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/logIn')
  kakao(@Body() body){
    return this.authService.logIn(body);
  }
}
