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
        let kakaoRedirectUrl;

        if (origin.includes('local')) {
            kakaoRedirectUrl = this.configService.get('kakao.localRedirectUrl');
        } else {
            kakaoRedirectUrl = this.configService.get('kakao.devRedirectUrl');
        }

        const { data } = await this.httpService
            .post(
                `https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id=${this.configService.get(
                    'kakao.clientId'
                )}&redirect_uri=${kakaoRedirectUrl}/auth/kakao&code=${code}}`
            )
            .toPromise(); // observable to promise

        if (data.error) {
            throw new BadRequestException('카카오 로그인 에러');
        }

        return await this.loginProcess(data);
    }

    // 카카오 유저 정보 가져오기
    async getKaKaoUserData(data) {
        const { data: profile } = await this.httpService
            .get('https://kapi.kakao.com/v2/user/me', {
                headers: { Authorization: `Bearer ${data.access_token}` }
            })
            .toPromise()
            .catch(() => {
                throw new BadRequestException('사용자 정보가 없습니다.');
            });

        return {
            snsId: profile.id,
            name: profile.kakao_account.profile.nickname,
            thumbnail: profile.kakao_account.profile.thumbnail_image_url
        };
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

    // 유저 썸네일 업로드
    async uploadImage({ userId }: AuthUser, file) {
        await this.connection.getRepository(User).update(
            { id: userId },
            {
                // user_id: userId,
                thumbnail: file.Location
            }
        );
        return file.Location;
    }

    // // @TODO 로그아웃 추후 개발 예정
    // async logout({ code }: PostLogOutBody) {}
}
