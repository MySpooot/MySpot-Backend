import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { MulterExtendedModule } from 'nestjs-multer-extended';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthModule } from '../lib/jwt';

@Module({
    imports: [
        ConfigModule,
        HttpModule,
        JwtAuthModule,
        // @TODO 추구 별도 모듈로 분리
        MulterExtendedModule.register({
            awsConfig: {
                accessKeyId: process.env.ACCESS_KEY_ID,
                secretAccessKey: process.env.SECRET_ACCESS_KEY,
                region: process.env.REGION
            },
            bucket: 'dev-myspot',
            basePath: 'user/thumbnail',
            fileSize: 1 * 1024 * 1024 // 1MB
            // acl: 'public-read'
        })
    ],
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
