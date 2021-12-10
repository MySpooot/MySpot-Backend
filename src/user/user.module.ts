import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ConfigModule} from '@nestjs/config';

import { ChanHee } from 'src/entities/chanhee';
import { UserController } from './user.controller';
import { UserService } from './user.service';


@Module({
  imports: [TypeOrmModule.forFeature([ChanHee]), ConfigModule],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}