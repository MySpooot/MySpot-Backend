import { ArgumentsHost, Catch, HttpException, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Response } from 'express';

interface HttpExceptionResponseType {
    message: string;
}

@Catch()
export class CustomExceptionHandler extends BaseExceptionFilter {
    async catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        const errorResult = await this.returnCustomException(exception);

        response.json(errorResult);
    }

    async returnCustomException(exception) {
        if (exception instanceof HttpException) {
            const { message } = exception.getResponse() as HttpExceptionResponseType;

            return {
                code: exception.getStatus(),
                message: Array.isArray(message) ? message[0] : message
            };
        }
        // HttpException 외의 error에 대한 처리
        else {
            return {
                code: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Please try again later.'
            };
        }
    }
}
