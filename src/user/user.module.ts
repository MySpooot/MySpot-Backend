import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Joi from 'joi';

import configration from '../configration';
import { ChanHee } from '../entities/chanhee';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    ConfigModule.forRoot({ // ENV를 이곳에 적용한다.
      envFilePath: '.env',
      validationSchema: Joi.object({
        DATABASE_HOST: Joi.string().required(),
        DATABASE_PORT: Joi.string().required(),
        DATABASE_USER: Joi.string().required(),
        DATABASE_PASSWORD: Joi.string().required(),
        DATABASE_NAME: Joi.string().required()
      }),
      load: [configration],
    }),
    TypeOrmModule.forRoot({ //connection에 필요한 정보 입력
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [ChanHee],
      synchronize: true,
      ssl: {
        rejectUnauthorized: false
      }
    }),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
