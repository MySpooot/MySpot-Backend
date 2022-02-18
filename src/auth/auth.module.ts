import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterExtendedModule } from 'nestjs-multer-extended';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthModule } from '../lib/jwt';

@Module({
    imports: [
        ConfigModule,
        HttpModule,
        JwtAuthModule,
        MulterExtendedModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => configService.get('s3Options')
        })
        // MulterExtendedModule.register({
        //     awsConfig: {
        //         accessKeyId: process.env.AWS_S3_ACCESS_KEY,
        //         secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
        //         region: 'ap-northeast-2'
        //         // ... any options you want to pass to the AWS instance
        //     },
        //     bucket: 'dev-myspot',
        //     basePath: 'user/thumbnail',
        //     fileSize: 1 * 1024 * 1024 // 1MB 제한
        // })
    ],
    controllers: [AuthController],
    providers: [AuthService, ConfigService]
})
export class AuthModule {}
