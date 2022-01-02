import { Module } from '@nestjs/common';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from '../lib/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import configration from '../configration';

@Module({
    imports: [
        ConfigModule,
        HttpModule,
        PassportModule,
        JwtModule.register({ secret: process.env.JWT_SECRET, signOptions: { expiresIn: configration().jwt.signOptions.expiresIn } })
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy]
})
export class AuthModule {}
