import { NestFactory } from '@nestjs/core';
import { Module } from '@nestjs/common';
import express from 'express';
import Joi from 'joi';

import { ExpressAdapter } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configration from './configration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { HttpModule } from '@nestjs/axios';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
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
    HttpModule,
  ],
  controllers: [AuthController, UserController],
  providers: [AuthService, UserService],
})
class AppModule {}

async function bootstrap() {
  const expressApp = express();

  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
  );
  await app.listen(3001);
}

bootstrap().then(() => {
  console.log('adsasfsafs');
});
