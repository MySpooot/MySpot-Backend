import { NestFactory } from '@nestjs/core';
import { Module } from '@nestjs/common';
import Joi from 'joi';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import https from 'https';

import configration from './configration';
import { UserModule } from './user/user.modul';
import { AuthModule } from './auth/auth.module';

import { User } from './entities/user.entity';
import { ChanHee } from './entities/chanhee.entity';

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
      }),
      load: [configration],
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
        entities: [User, ChanHee],
        ssl: {
          rejectUnauthorized: false,
        },
      }),
    }),
    UserModule,
    AuthModule
  ],
})

class AppModule {}

(async () => {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  await app.listen(process.env.PORT || 3001);

  if (process.env.NODE_ENV === 'production')
      setInterval(() => {
          https.get('https://nestjs-map.herokuapp.com/');
      }, 1200000);
})();
