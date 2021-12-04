import { Controller, Get, Post } from '@nestjs/common';
import { Connection } from 'typeorm';

import { UserService } from './user.service';

@Controller('/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  getHello(): Promise<void> {
    return this.userService.getHello();
  }
}
