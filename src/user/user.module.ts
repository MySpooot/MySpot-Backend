import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AwsModule } from 'nest-aws';

import { User } from '../entities/user.entity';
import { JwtAuthModule } from '../lib/jwt';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        JwtAuthModule,
        ConfigModule,
        AwsModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                region: 'ap-northeast-2',
                accessKeyId: configService.get('aws.access_key_id'),
                secretAccessKey: configService.get('aws.secret_access_key')
            }),
            inject: [ConfigService]
        })
    ],
    controllers: [UserController],
    providers: [UserService]
})
export class UserModule {}
