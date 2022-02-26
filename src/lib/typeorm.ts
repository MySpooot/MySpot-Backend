import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
    constructor(private readonly configService: ConfigService) {}

    createTypeOrmOptions() {
        const options = this.configService.get('typeorm');

        if (!options) throw new Error('Typeorm config not found');

        options.username ??= this.configService.get('database.username');
        options.password ??= this.configService.get('database.password');
        options.database ??= this.configService.get('database.database');
        options.host ??= this.configService.get('database.host');

        return options as TypeOrmModuleOptions;
    }
}
