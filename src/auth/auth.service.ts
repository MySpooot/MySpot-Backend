import { BadRequestException, Injectable, } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Connection, Not } from 'typeorm';

import { User, UserActive, UserLevel, UserProvider } from 'src/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(private readonly connection: Connection, private readonly configService: ConfigService, private readonly httpService: HttpService){}

   /**
     * 1. 로그인 버튼 클릭 
     * 2. 카카오서버에서 redirect url로 access code 전송 
     * 3. 프론트에서 code를 body에 담아 백엔드로 전송
     * 4. 백엔드에서 code, redirect url을 가지고 token 요청 -> reponse
     * 5. 프론트에서 localStorage에 token 저장
     */
  async logIn(body) {
    const {code} = body;

    const {data} = await this.httpService
        .post(
            `https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id=${this.configService.get('kakao.clientId')}&redirect_uri=${this.configService.get('kakao.redirectUrl')}&code=${code}}`
        )
        .toPromise(); // observable to promise

    console.log(data)

    if (data.error) {
        console.error(data.error);
    }

    // 카카오에서 개인정보 가져오기
    const {data: profile} = await this.httpService
        .get('https://kapi.kakao.com/v2/user/me', {
            headers: { Authorization: `Bearer ${data.access_token}` }
        })
        .toPromise()
        .catch(e => {
            throw new BadRequestException('사용자 정보가 없습니다.')
        });

    const snsId = profile.id;
    const name = profile.kakao_account.profile.nickname;
    const thumbnail = profile.kakao_account.profile.thumbnail_image_url;

    console.log({snsId, name, thumbnail})

    // 이미 가입한 유저인지 검증
    const user = await this.connection.getRepository(User).findOne({ active: UserActive.Active});

    // 존재하는 유저라면
    if(user){

    }else{

    }

    // // 가입되어 있지 않다면 user에 insert
    // if(!user){
    //     // 먼저 insert하고
    //     await this.connection.getRepository(User).insert({
    //         nickname: name,
    //         snsId: snsId,
    //         thumbnail: thumbnail,
    //         level: UserLevel.User,
    //         provider: UserProvider.Kakao,
    //         active: UserActive.Active
    //     });

    //     // 토큰을 검증한 이후 return
    //     return {
            
    //     }

    }



    // 프론트에 유저 정보 전달
    }
}
