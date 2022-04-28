import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';

import { CommonModule } from './common.module';

@Module({
    imports: [LoggerModule.forRoot(), CommonModule],
    controllers: [],
    providers: []
})
export class AppModule {}
