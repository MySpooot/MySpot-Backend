import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from '../lib/typeorm';
import Joi from 'joi';

import configuration from '../configuration';
import { UserModule } from './user.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            // ENV를 이곳에 적용한다.
            envFilePath: '.env',
            validationSchema: Joi.object({
                POSTGRES_HOST: Joi.string().required(),
                POSTGRES_PORT: Joi.string().required(),
                POSTGRES_USERNAME: Joi.string().required(),
                POSTGRES_PASSWORD: Joi.string().required(),
                POSTGRES_DATABASE: Joi.string().required(),
                ACCESS_KEY_ID: Joi.string().required(),
                SECRET_ACCESS_KEY: Joi.string().required(),
                REGION: Joi.string().required(),
                BASE_PATH: Joi.string().required(),
                BUCKET: Joi.string().required(),
                FILE_SIZE: Joi.string().required()
            }),
            load: [configuration]
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useClass: TypeOrmConfigService
        }),
        UserModule
    ]
})
export class AppModule {}