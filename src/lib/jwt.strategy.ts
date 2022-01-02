import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromHeader('authorization'), // 헤더에 담겨서 넘어올 시 이름
            ignoreExpiration: false, // 만료된 토큰의 사용 여부
            secretOrKey: configService.get<JwtModuleOptions>('jwt')?.secret ?? configService.get('JWT_SECRET')
        });
    }

    // 토큰 검증
    async validate(payload: any) {
        if (!payload.userId || !payload.userLevel) throw new BadRequestException('JWT Token 검증에 실패하였습니다.');

        return {
            userId: payload.userId,
            userLevel: payload.userLevel
        };
    }
}
