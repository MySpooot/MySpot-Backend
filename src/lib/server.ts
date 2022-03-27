import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import ServerlessExpress from '@vendia/serverless-express';
import express from 'express';

let cachedServer;

export const bootstrapServer = async (module: any) => {
    if (!cachedServer) {
        const expressApp = express();
        const isProd = process.env.stage === 'prod';

        const app = await NestFactory.create(module, new ExpressAdapter(expressApp));
        app.useGlobalPipes(
            new ValidationPipe({
                whitelist: true,
                transform: true,
                transformOptions: { enableImplicitConversion: true },
                /**
                 * @todo prod error handling
                 * disableErrorMessages: If set to true, validation errors will not be returned to the client.
                 */
                disableErrorMessages: false
            })
        );
        app.enableCors({
            origin: isProd ? /myspot\.co\.kr$/ : '*',
            allowedHeaders: '*'
        });

        await app.init();

        cachedServer = ServerlessExpress({
            app: expressApp,
            // allowed api gateway content-type
            binarySettings: {
                contentTypes: ['image/jpeg', 'image/png', 'image/jpg', 'multipart/form-data']
            }
        });
    }

    return cachedServer;
};
