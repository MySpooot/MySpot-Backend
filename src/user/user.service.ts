import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { ChanHee } from '../entities/chanhee.entity';

@Injectable()
export class UserService {
  constructor(private readonly connection: Connection){}

  async getHello(): Promise<void> {
    const test = await this.connection.getRepository(ChanHee).find({})
  }
}
