import { NestFactory } from '@nestjs/core';
import { Module, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule as UserModule } from './user/app.module';
import { AppModule as MapModule } from '../src/map/app.module';
import { AppModule as CommonModule } from '../src/common/app.module';
import { AppModule as MarkerModule } from '../src/marker/app.module';
import { AppModule as ReplyModule } from '../src/reply/app.module';
import { AppModule as AuthModule } from '../src/auth/app.module';

import { CustomExceptionHandler } from './lib/custom_exception_handler';
import { version } from 'package.json';
import { CustomResponseInterCeptor } from './lib/custom_response_interceptor';

@Module({
    imports: [UserModule, MapModule, MarkerModule, ReplyModule, AuthModule, CommonModule],
    controllers: [],
    providers: []
})
class AppModule {}

/**
 *  app.useGlobalPipes()
 *  whiteList: true - 엔티티 데코레이터에 없는 프로퍼티 값은 무조건 거름
 *  transform: true - 컨트롤러가 값을 받을때 컨트롤러에 정의한 타입으로 형변환
 */

(async () => {
    const app = await NestFactory.create(AppModule);
    app.useGlobalInterceptors(new CustomResponseInterCeptor());
    app.useGlobalPipes(
        new ValidationPipe({ whitelist: true, transform: true, transformOptions: { enableImplicitConversion: true }, disableErrorMessages: false })
    );
    app.useGlobalFilters(new CustomExceptionHandler());
    app.enableCors();

    const config = new DocumentBuilder().setTitle('Map').setDescription('The Map API description').setVersion(version).build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    await app.listen(process.env.PORT || 3001);
})();
