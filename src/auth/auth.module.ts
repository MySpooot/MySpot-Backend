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
    ],
    controllers: [AuthController],
    providers: [AuthService, ConfigService]
})
export class AuthModule {}
