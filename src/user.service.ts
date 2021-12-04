import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { ChanHee } from './entities/chanhee';

@Injectable()
export class UserService {
  constructor(private readonly connection: Connection){}

  async getHello(): Promise<void> {
    console.log('test')
    await this.connection.getRepository(ChanHee).insert({
      name: 'chanhee_test'
    })
  }
}
