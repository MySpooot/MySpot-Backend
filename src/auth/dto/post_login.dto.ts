import {IsNotEmpty, IsNumber, IsString} from 'class-validator';

export class PostLoginBody {
    @IsString()
    @IsNotEmpty()
    readonly code: string;
}

export class PostLoginResponse {
    token?: string;
    id: number;
    nickname: string;
    thumbnail?: string;
    active?: number;
}