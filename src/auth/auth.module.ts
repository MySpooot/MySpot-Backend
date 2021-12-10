import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ConfigModule} from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

import { User } from 'src/entities/user.entity';
import {AuthController} from './auth.controller';
import {AuthService} from './auth.service';


@Module({
  imports: [TypeOrmModule.forFeature([User]), ConfigModule, HttpModule],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}