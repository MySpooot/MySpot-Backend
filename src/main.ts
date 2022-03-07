import { NestFactory } from '@nestjs/core';
import { Module, ValidationPipe } from '@nestjs/common';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule as UserModule } from '../src/user/app.module';
import { AppModule as MapModule } from '../src/map/app.module';
import { AppModule as CommonModule } from '../src/common/app.module';
import { AppModule as MarkerModule } from '../src/marker/app.module';
import { AppModule as ReplyModule } from '../src/reply/app.module';
import { AppModule as AuthModule } from '../src/auth/app.module';

import { version } from 'package.json';

@Module({
    imports: [UserModule, MapModule, MarkerModule, ReplyModule, AuthModule, CommonModule],
    controllers: [],
    providers: []
})
class AppModule {}

(async () => {
    const app = await NestFactory.create(AppModule);
    app.enableCors();
    app.useGlobalPipes(
        new ValidationPipe({ whitelist: true, transform: true, transformOptions: { enableImplicitConversion: true }, disableErrorMessages: false })
    );

    const config = new DocumentBuilder().setTitle('Map').setDescription('The Map API description').setVersion(version).build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    await app.listen(process.env.PORT || 3001);

    /** 일단 주석처리 */
    // if (process.env.NODE_ENV === 'dev')
    //     setInterval(() => {
    //         https.get('https://nestjs-map.herokuapp.com/');
    //     }, 1200000);
})();
