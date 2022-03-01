import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

import configuration from '../configuration';
import { UserController } from './user.controller';
import { UserModule } from './user.module';
import { User } from '../entities/user.entity';
import { file, seedImageUploadMe, seedImageUploadUser } from './user.seed';

describe('UserController', () => {
    let userController: UserController;
    let connection: Connection;

    beforeAll(async () => {
        const app: TestingModule = await Test.createTestingModule({
            imports: [
                UserModule,
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

        connection = app.get(Connection);
        userController = app.get(UserController);
    });

    describe('POST /user/upload', () => {
        it('should upload user thumbnail to S3 and update user db, return file.location', async () => {
            const user = await connection.getRepository(User).save(seedImageUploadUser);

            const beforeUser = await connection.getRepository(User).findOne({ id: user.id });

            const result = await userController.uploadFile(seedImageUploadMe, file);

            const afterUser = await connection.getRepository(User).findOne({ id: user.id });

            expect(result).toBeDefined();
            expect(result).toEqual(file.Location);

            expect(beforeUser).toBeDefined();
            expect(afterUser).toBeDefined();
            expect(beforeUser.thumbnail).toBeNull();
            expect(afterUser.thumbnail).toEqual(file.Location);
        });
    });
});