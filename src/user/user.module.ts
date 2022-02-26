import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterExtendedModule } from 'nestjs-multer-extended';
import { User } from '../entities/user.entity';
import { JwtAuthModule } from '../lib/jwt';

import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        JwtAuthModule,
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
