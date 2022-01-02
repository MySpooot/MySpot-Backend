import { User } from '../../entities/user.entity';

export class GetMeResponse {
    id: number;
    nickname: string;
    thumbnail: string;

    static from(me?: User): GetMeResponse | undefined {
        return me && new GetMeResponse(me);
    }

    constructor(me: User) {
        this.id = me.id;
        this.nickname = me.nickname;
        this.thumbnail = me.thumbnail;
    }
}
