import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthModule } from '../lib/jwt';
import { User } from '../entities/user.entity';

@Module({
    imports: [ConfigModule, HttpModule, JwtAuthModule, TypeOrmModule.forFeature([User])],
    controllers: [AuthController],
    providers: [AuthService]
})
export class AuthModule {}
