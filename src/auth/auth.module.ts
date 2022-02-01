import { Module } from '@nestjs/common';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from '../lib/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import configuration from '../configuration';
import { JwtAuthModule } from '../lib/jwt';

@Module({
    imports: [ConfigModule, HttpModule, JwtAuthModule],
    controllers: [AuthController],
    providers: [AuthService]
})
export class AuthModule {}
