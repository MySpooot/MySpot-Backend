// import { ConfigModule } from '@nestjs/config';
// import { Test, TestingModule } from '@nestjs/testing';

// import { MapController } from './map.controller';
// import { MapModule } from './map.module';
// import configuration from '../configuration';
// import { TypeOrmModule } from '@nestjs/typeorm';

// describe('MapController', () => {
//     let mapController: MapController;

//     beforeEach(async () => {
//         const app: TestingModule = await Test.createTestingModule({
//             imports: [
//                 MapModule,
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

//         mapController = app.get<MapController>(MapController);
//     });

//     describe('root', () => {
//         it('should return "Hello World!"', () => {
//             expect(0).toEqual(0);
//         });
//     });
// });
