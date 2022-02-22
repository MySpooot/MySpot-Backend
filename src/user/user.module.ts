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
