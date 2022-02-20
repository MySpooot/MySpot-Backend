import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterExtendedModule } from 'nestjs-multer-extended';

import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
    imports: [
        MulterExtendedModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => configService.get('s3Options')
        })
    ],
    controllers: [UserController],
    providers: [UserService]
})
export class UserModule {}

/**
 *  @TODO 추구 별도 모듈로 분리
 *  MulterExtendedModule.registerAsync({
 *  imports: [ConfigModule],
 *  inject: [ConfigService],
 *  useFactory: (configService: ConfigService) => configService.get('s3Options')
 * })
 */

//  // @TODO 추구 별도 모듈로 분리
//  MulterExtendedModule.register({
//     awsConfig: {
//         accessKeyId: process.env.ACCESS_KEY_ID,
//         secretAccessKey: process.env.SECRET_ACCESS_KEY,
//         region: process.env.REGION
//     },
//     bucket: 'dev-myspot',
//     basePath: 'user/thumbnail',
//     fileSize: 1 * 1024 * 1024 // 1MB
//     // acl: 'public-read'
// })
