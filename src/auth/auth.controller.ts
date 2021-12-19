import { Body, Controller, Get, Param, Post, Put, UseGuards ,Headers} from '@nestjs/common';

import { JwtAuthGuard } from '../lib/jwt_guard';
import { AuthUser, User_ } from '../lib/user_decorator'
import { AuthService } from './auth.service';
import { PostLoginBody, PostLoginHeaders } from './dto/post_login.dto';
import { PutUserBody, PutUserParam } from './dto/put_user.dto';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  login(@Headers() headers: PostLoginHeaders, @Body() body: PostLoginBody){
    return this.authService.login(headers, body);
  }

  @Get('/me') 
  @UseGuards(JwtAuthGuard)
  me(@User_() user: AuthUser){
    return this.authService.me(user);
  }

  @Put('/user/:userId')
  updateUser(@Param() param: PutUserParam, @Body() body: PutUserBody){
    return this.authService.updateUser(param, body)
  }

  @Post('/logout')
  @UseGuards(JwtAuthGuard)
  logout(@Body() body){
    return this.authService.logout(body)
  }
}
