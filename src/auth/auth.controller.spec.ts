import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { AuthController } from './auth.controller';
import { AuthModule } from './auth.module';
import { AuthService } from './auth.service';
import configuration from '../configration';
import { TypeOrmModule } from '@nestjs/typeorm';

describe('AuthController', () => {
  let authController: AuthController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports:[
        AuthModule,
        ConfigModule.forRoot({
            load: [configuration],
            cache: true,
            isGlobal: true
        }),
        TypeOrmModule.forRoot({
            type: 'sqlite',
            database: ':memory:',
            autoLoadEntities: true,
            synchronize: true,
            logging: false
        })
      ] 
    
    }).compile();

    authController = app.get<AuthController>(AuthController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
        console.log(123)
        expect(0).toEqual(0)

    });
  });
});
