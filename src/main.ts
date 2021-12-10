import { NestFactory } from '@nestjs/core';
import { Module } from '@nestjs/common';

import { AppModule as UserModule } from './user/app.module'
import { AppModule as AuthModule } from './auth/app.module';

@Module({
  imports: [UserModule, AuthModule],
  controllers: [],
  providers: []
})

class AppModule {}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3001);

}
bootstrap();