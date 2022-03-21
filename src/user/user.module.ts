import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
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
        AwsModule.forRoot({
            region: process.env.REGION,
            accessKeyId: process.env.ACCESS_KEY_ID,
            secretAccessKey: process.env.SECRET_ACCESS_KEY
        })
    ],
    controllers: [UserController],
    providers: [UserService]
})
export class UserModule {}
