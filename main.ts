import { NestFactory } from '@nestjs/core';
import {Module} from '@nestjs/common';

import { UserModule} from './src/user.module';

@Module({
  imports: [UserModule],
  controllers: [],
  providers: []
})

class AppModule {}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);

}
bootstrap();