import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';

@Injectable()
export class MapService {
  constructor(private readonly connection: Connection){}

  async getHello(): Promise<void> {
    // const test = await this.connection.getRepository(ChanHee).find({})
  }
}
