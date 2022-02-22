import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthModule } from '../lib/jwt';

@Module({
    imports: [ConfigModule, HttpModule, JwtAuthModule],
    controllers: [AuthController],
    providers: [AuthService]
})
export class AuthModule {}

/**
 *  @TODO 추구 별도 모듈로 분리
 *  MulterExtendedModule.registerAsync({
 *  imports: [ConfigModule],
 *  inject: [ConfigService],
 *  useFactory: (configService: ConfigService) => configService.get('s3Options')
 * })
 */
