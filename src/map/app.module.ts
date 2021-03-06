import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'nestjs-pino';
import Joi from 'joi';

import { TypeOrmConfigService } from '../lib/typeorm';
import configuration from '../configuration';
import { MapModule } from './map.module';

@Module({
    imports: [
        LoggerModule.forRoot(),
        ConfigModule.forRoot({
            envFilePath: '.env',
            validationSchema: Joi.object({
                POSTGRES_HOST: Joi.string().required(),
                POSTGRES_PORT: Joi.string().required(),
                POSTGRES_USERNAME: Joi.string().required(),
                POSTGRES_PASSWORD: Joi.string().required(),
                POSTGRES_DATABASE: Joi.string().required()
            }),
            load: [configuration]
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useClass: TypeOrmConfigService
        }),
        MapModule
    ],
    controllers: [],
    providers: []
})
export class AppModule {}
