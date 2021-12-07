import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Connection } from 'typeorm';

import { ChanHee } from '../entities/chanhee';
import { User } from 'src/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(private readonly connection: Connection, private readonly configService: ConfigService, private readonly httpService: HttpService){}

  async logIn(body) {
    const { code } = body;

    // 1. 로그인 버튼 클릭 
    // 2. 카카오서버에서 redirect url로 access code 전송 
    // 3. 프론트에서 code를 body에 담아 백엔드로 전송
    // 4. 백엔드에서 code, redirect url을 가지고 token 요청 -> reponse
    // 5. 프론트에서 localStorage에 token 저장

    const { data } = await this.httpService
    .post(
        `https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id=025b493068d0d400f8c6b9f91b175936&redirect_uri=http://localhost:3000/auth/kakao&code=${code}}`
    )
    .toPromise(); // observable to promise

    // test 123454

    console.log(data)

    if (data.error) {
        console.error(data.error);
    }

    // const { data: profile } = await this.httpService
    //     .get(`https://kapi.kakao.com/v2/user/me`, {
    //         headers: { Authorization: `Bearer ${data.access_token}` }
    //     })
    //     .toPromise();

    // const snsId = profile.id;
    // const name = profile.kakao_account.profile.nickname;
    // const thumbnail = profile.kakao_account.profile.thumbnail_image_url;

    // const user = await this.connection.getRepository(User).findOne({ where: { snsId, level: Not(0) } });

    // if (user) {
    //     return {
    //         id: user.id,
    //         name: user.name,
    //         thumbnail: user.thumbnail,
    //         token: jwt.sign({ id: user.id, nickname: user.nickname }, process.env.JWT_KEY, { expiresIn: '30d' })
    //     };
    // }

    // const newUser = await this.connection.getRepository(User).insert({
    //     snsId,
    //     name,
    //     thumbnail,
    //     provider: 'kakao'
    // });

    // const newUserId = newUser.generatedMaps[0].id;
    // return {
    //     id: newUserId,
    //     name,
    //     thumbnail,
    //     token: jwt.sign({ id: newUserId, name }, process.env.JWT_KEY, { expiresIn: '30d' })
    // };
}
}
