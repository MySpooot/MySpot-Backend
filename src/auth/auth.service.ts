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

    

    const {data} = await this.httpService
        .post(
            `https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id=${this.configService.get('kakao.clientId')}&redirect_uri=${this.configService.get('kakao.rediretUrl')}&code=${code}}`
        )
        .toPromise();

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
