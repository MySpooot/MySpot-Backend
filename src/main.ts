import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { Module, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { LoggingInterceptor } from '@algoan/nestjs-logging-interceptor';
import { Logger } from 'nestjs-pino';
import express from 'express';

import { AppModule as UserModule } from './user/app.module';
import { AppModule as MapModule } from '../src/map/app.module';
import { AppModule as CommonModule } from '../src/common/app.module';
import { AppModule as MarkerModule } from '../src/marker/app.module';
import { AppModule as ReplyModule } from '../src/reply/app.module';
import { AppModule as AuthModule } from '../src/auth/app.module';

import { CustomExceptionHandler } from './lib/custom_exception_handler';
import { CustomResponseInterCeptor } from './lib/custom_response_interceptor';
import { version } from 'package.json';

@Module({
    imports: [UserModule, MapModule, MarkerModule, ReplyModule, AuthModule, CommonModule],
    controllers: [],
    providers: []
})
class AppModule {}

/**
 *  - useGlobalPipes()
 *      HttpRequest 로 넘어온 파라미터나 쿼리 또는 Body 를 Validation 해주거나
 *      원시타입을 조작하거나 원하는 타입이 넘어오지 못했을 때 에러를 발생시킬 수 있는 기능을 담당
 *      - ValidationPipe()
 *          whiteList: true - 엔티티 데코레이터에 없는 프로퍼티 값은 무조건 거름
 *          transform: true - 컨트롤러가 값을 받을때 컨트롤러에 정의한 타입으로 형변환
 *
 *  - useGlobalFilters()
 *      전역적인 에러 핸들링을 위함
 *
 *  - useGlobalInterceptors()
 *      response를 intercept하여 원하는 구조로 바꿔준다
 *
 *   - response 구조 (httpException, unHandledException, 올바른 response 모두 동일한 response 구조를 따른다.)
 *      code: statusCode,
 *      data: {}
 */

(async () => {
    const expressApp = express();
    const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));

    app.useLogger(app.get(Logger));
    app.useGlobalInterceptors(new CustomResponseInterCeptor(), new LoggingInterceptor());
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
