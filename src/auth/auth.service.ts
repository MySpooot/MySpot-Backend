import { BadRequestException, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Connection } from 'typeorm';

import { User, UserActive, UserProvider } from '../entities/user.entity';
import { UserLevel, AuthUser } from '../lib/user_decorator';
import { PostLoginBody, PostLoginHeaders, PostLoginResponse } from './dto/post_login.dto';
import { GetMeResponse } from './dto/get_me.dto';
import { PutUserBody, PutUserParam, PutUserResponse } from './dto/put_user.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly connection: Connection,
        private readonly configService: ConfigService,
        private readonly httpService: HttpService,
        private readonly jwtService: JwtService
    ) {}

    // login
    async login({ origin }: PostLoginHeaders, { code }: PostLoginBody): Promise<PostLoginResponse> {
        let kakaoRedirectUrl: string | undefined;

        // @TODO 주석 테스트 기간엔 냅둠 추후 제거

        console.log('****** origin ****** :: ', origin);
        console.log('****** process.env.stage ****** :: ', process.env.stage);
        console.log(' **** process.env.NODE_ENV **** ::', process.env.NODE_ENV);

        if (origin.includes('local')) {
            kakaoRedirectUrl = this.configService.get('kakao.localRedirectUrl');
        } else {
            // 환경 dev인 경우
            if (process.env.stage === 'dev') {
                console.log(' !! stage DEV !!');
                kakaoRedirectUrl = this.configService.get('kakao.devRedirectUrl');
            }
            // 환경 prod인 경우
            else if (process.env.stage === 'prod') {
                console.log(' !! stage PROD !!');
                kakaoRedirectUrl = this.configService.get('kakao.prodRedirectUrl');
            }
        }

        console.log(' **** kakaoRedirectUrl **** ', kakaoRedirectUrl);

        // if (origin.includes('local')) {
        //     kakaoRedirectUrl = this.configService.get('kakao.localRedirectUrl');
        // } else {
        //     kakaoRedirectUrl = this.configService.get('kakao.devRedirectUrl');
        // }

        const data = await this.getKakaoData(kakaoRedirectUrl, code);

        if (!data) throw new BadRequestException('Kakao Api Error');

        if (data.error) {
            throw new BadRequestException('Kakao Login Error');
        }

        return await this.loginProcess(data);
    }

    // 카카오 api 호출
    async getKakaoData(kakaoRedirectUrl, code) {
        const { data } = await this.httpService
            .post(
                `https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id=${this.configService.get(
                    'kakao.clientId'
                )}&redirect_uri=${kakaoRedirectUrl}/auth/kakao&code=${code}}`
            )
            .toPromise(); // observable to promise
        return data;
    }

    // 카카오 user api 호출
    async getKakaoUser(data) {
        const { data: profile } = await this.httpService
            .get('https://kapi.kakao.com/v2/user/me', {
                headers: { Authorization: `Bearer ${data.access_token}` }
            })
            .toPromise();

        return profile;
    }

    // 카카오 user data return
    async getKaKaoUserData(data) {
        const profile = await this.getKakaoUser(data);

        if (!profile) throw new BadRequestException('User Profile Is Not Exist');

        return {
            snsId: profile.id,
            name: profile.kakao_account.profile.nickname,
            thumbnail: profile.kakao_account.profile.thumbnail_image_url
        };
    }

    // login process
    async loginProcess(data: { access_token: string }) {
        // 카카오에서 개인정보 가져오기
        const kakaoUser = await this.getKaKaoUserData(data);

        // 이미 가입함 + 닉네임까지 입력을 다 한 유저인지 확인
        const user = await this.connection.getRepository(User).findOne({ sns_id: kakaoUser.snsId, active: UserActive.Active });

        // 가입함 + 닉네임 완료인 유저일 시
        if (user) {
            console.log('가입함 + 닉네임 완료인 유저일 시 ');
            return {
                token: this.jwtService.sign(
                    { userId: user.id, userLevel: user.level },
                    { secret: this.configService.get('JWT_SECRET'), expiresIn: this.configService.get('jwt.signOptions.expiresIn') }
                ),
                id: user.id,
                nickname: user.nickname,
                thumbnail: user.thumbnail,
                active: user.active
            };
        } else {
            // 가입 + 닉네임 입력 안한 유저인지 확인
            const pendingUser = await this.connection.getRepository(User).findOne({ sns_id: kakaoUser.snsId, active: UserActive.Pending });

            // 가입은 했는데 닉네임을 입력하지 않은 유저인 경우, db에 insert하지 않고 바로 return
            if (pendingUser) {
                console.log('가입은 했는데 닉네임을 입력하지 않은 유저인 경우, db에 insert하지 않고 바로 return');
                return {
                    id: pendingUser.id,
                    nickname: kakaoUser.name, // 카카오 닉네임을 return한다. (프론트에서 사용)
                    active: pendingUser.active
                };
            } else {
                // 아예 첫 가입인 유저인 경우
                console.log('아예 첫 가입인 유저인 경우');
                const newUser = await this.connection.getRepository(User).insert({
                    sns_id: kakaoUser.snsId,
                    thumbnail: kakaoUser.thumbnail,
                    level: UserLevel.User,
                    provider: UserProvider.Kakao,
                    active: UserActive.Pending // 닉네임을 입력받기 전이라 pending상태로 insert한다.
                });
                // 닉네임 입력을 받아야 로그인이 되기 때문에 토큰은 닉네임 입력 이후에 전달
                return {
                    id: newUser.generatedMaps[0].id,
                    nickname: kakaoUser.name, // 카카오 닉네임을 return한다. (프론트에서 사용)
                    active: newUser.generatedMaps[0].active
                };
            }
        }
    }

    // me api
    async me({ userId, userLevel }: AuthUser): Promise<GetMeResponse> {
        const user = await this.connection.getRepository(User).findOne({ id: userId, level: userLevel });

        return GetMeResponse.from(user);
    }

    // insert nickname
    async updateUser({ userId }: PutUserParam, { nickname }: PutUserBody): Promise<PutUserResponse> {
        await this.connection.getRepository(User).update({ id: userId }, { nickname: nickname, active: UserActive.Active });

        // update된 user 재조회
        const user = await this.connection.getRepository(User).findOneOrFail({ id: userId });

        return {
            token: this.jwtService.sign(
                { userId: user.id, userLevel: user.level },
                { secret: this.configService.get('JWT_SECRET'), expiresIn: this.configService.get('jwt.signOptions.expiresIn') }
            ),
            id: user.id,
            nickname: user.nickname,
            thumbnail: user.thumbnail,
            active: user.active
        };
    }

    // // @TODO 로그아웃 추후 개발 예정
    // async logout({ code }: PostLogOutBody) {}
}
