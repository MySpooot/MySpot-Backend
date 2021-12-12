import {IsNotEmpty, IsNumber, IsString, MaxLength} from 'class-validator';

export class PutUserParam {
    @IsNumber()
    @IsNotEmpty()
    readonly userId: number;
}

export class PutUserBody {
    @IsString()
    @IsNotEmpty()
    @MaxLength(12)
    readonly nickname: string;
}

export class PutUserReponse {
    token: string;
    id: number;
    nickname: string;
    thumbnail: string;
    active: number;
}