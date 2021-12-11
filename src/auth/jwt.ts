import {Injectable, Module} from '@nestjs/common';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {AuthGuard, PassportModule, PassportStrategy} from '@nestjs/passport';
import {JwtModule, JwtModuleOptions, JwtOptionsFactory} from '@nestjs/jwt';
import {ExtractJwt, Strategy} from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromHeader('authorization'),
            ignoreExpiration: false,
            secretOrKey: configService.get<JwtModuleOptions>('jwt')?.secret ?? configService.get('JWT_SECRET')
        });
    }

    async validate(payload: any) {
        return {
            id: payload.userId,
            level: payload.userLevel
        };
    }
}

@Injectable()
export class JwtConfigService implements JwtOptionsFactory {
    constructor(private readonly configService: ConfigService) {}

    createJwtOptions() {
        const jwtOption = this.configService.get<JwtModuleOptions>('jwt');

        if (!jwtOption) throw new Error('JWT config not found');
        if (!jwtOption.signOptions?.expiresIn) throw new Error('JWT signOptions.expiresIn not found');

        jwtOption.secret ??= this.configService.get('JWT_SECRET');

        return jwtOption;
    }
}

@Module({
    imports: [ConfigModule, PassportModule, JwtModule.registerAsync({imports: [ConfigModule], inject: [ConfigService], useClass: JwtConfigService})],
    providers: [JwtStrategy],
    exports: [JwtModule]
})
export class JwtAuthModule {}

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}