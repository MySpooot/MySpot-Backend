import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from '../lib/typeorm';
import Joi from 'joi';

import configuration from '../configuration';
import { UserModule } from './user.module';

@Module({
    imports: [
        // ConfigModule.forRoot({
        //     envFilePath: '.env',
        //     validationSchema: Joi.object({
        //         POSTGRES_HOST: Joi.string().required(),
        //         POSTGRES_PORT: Joi.string().required(),
        //         POSTGRES_USERNAME: Joi.string().required(),
        //         POSTGRES_PASSWORD: Joi.string().required(),
        //         POSTGRES_DATABASE: Joi.string().required(),
        //         AWS_ACCESS_KEY_ID: Joi.string().required(),
        //         AWS_SECRET_ACCESS_KEY: Joi.string().required(),
        //         REGION: Joi.string().required()
        //     }),
        //     load: [configuration]
        // }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useClass: TypeOrmConfigService
        }),
        UserModule
    ],
    controllers: [],
    providers: []
})
export class AppModule {}
