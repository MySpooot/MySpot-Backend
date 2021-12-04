import { NestFactory } from '@nestjs/core';
import { Module } from '@nestjs/common';

import { UserModule } from './src/user/user.module'
import { AuthModule } from './src/auth/auth.module';

@Module({
  imports: [UserModule, AuthModule],
  controllers: [],
  providers: []
})

class AppModule {}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);

}
bootstrap();