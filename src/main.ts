import { NestFactory } from '@nestjs/core';
import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
// import https from 'https';
import Joi from 'joi';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import configuration from './configuration';
import { MapModule } from './map/map.module';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { MarkerModule } from './marker/marker.module';
import { ReplyModule } from './reply/reply.module';

import { User } from './entities/user.entity';
import { Map } from './entities/map.entity';
import { Marker } from './entities/marker.entity';
import { UserRecentMap } from './entities/user_recent_map.entity';
import { UserFavoriteMap } from './entities/user_favorite_map.entity';
import { UserAccessibleMap } from './entities/user_accessible_map.entity';
import { MapMarkerReply } from './entities/map_marker_reply.entity';
import { MapMarkerLike } from './entities/map_marker_like.entity';
import { MyLocation } from './entities/my_location.entity';

import { version } from 'package.json';

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
                POSTGRES_DATABASE: Joi.string().required()
            }),
            load: [configuration]
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                type: 'postgres',
                username: configService.get('database.username'),
                password: configService.get('database.password'),
                host: configService.get('database.host'),
                port: configService.get('database.port'),
                database: configService.get('database.database'),
                entities: [Map, User, Marker, UserRecentMap, UserFavoriteMap, UserAccessibleMap, MapMarkerReply, MapMarkerLike, MyLocation],
                ssl: {
                    rejectUnauthorized: false
                }
            })
        }),
        MapModule,
        AuthModule,
        CommonModule,
        MarkerModule,
        ReplyModule
    ]
})
class AppModule {}

(async () => {
    const app = await NestFactory.create(AppModule);
    app.enableCors();
    app.useGlobalPipes(
        new ValidationPipe({ whitelist: true, transform: true, transformOptions: { enableImplicitConversion: true }, disableErrorMessages: false })
    );

    const config = new DocumentBuilder().setTitle('Map').setDescription('The Map API description').setVersion(version).build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    await app.listen(process.env.PORT || 3001);

    /** 일단 주석처리 */
    // if (process.env.NODE_ENV === 'dev')
    //     setInterval(() => {
    //         https.get('https://nestjs-map.herokuapp.com/');
    //     }, 1200000);
})();
