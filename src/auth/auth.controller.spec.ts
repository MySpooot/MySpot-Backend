// import { ConfigModule } from '@nestjs/config';
// import { Test, TestingModule } from '@nestjs/testing';
// import { TypeOrmModule } from '@nestjs/typeorm';

// import configuration from '../configuration';
// import { AuthController } from './auth.controller';
// import { AuthModule } from './auth.module';

// describe('AuthController', () => {
//     let authController: AuthController;

//     beforeAll(async () => {
//         const app: TestingModule = await Test.createTestingModule({
//             imports: [
//                 AuthModule,
//                 ConfigModule.forRoot({
//                     load: [configuration],
//                     cache: true,
//                     isGlobal: true
//                 }),
//                 TypeOrmModule.forRoot({
//                     type: 'sqlite',
//                     database: ':memory:',
//                     autoLoadEntities: true,
//                     synchronize: true,
//                     logging: false
//                 })
//             ]
//         }).compile();

//         authController = app.get(AuthController);
//     });

//     describe('POST /auth/login', () => {

//     });
// });
