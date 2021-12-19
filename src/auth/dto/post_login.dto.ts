import {IsNotEmpty, IsNumber, IsString, IsUrl} from 'class-validator';

export class PostLoginBody {
    @IsString()
    @IsNotEmpty()
    readonly code: string;
}

export class PostLoginHeaders {
    @IsString()
    @IsNotEmpty()
    readonly origin: string;
}

export class PostLoginResponse {
    token?: string;
    id: number;
    nickname: string;
    thumbnail?: string;
    active?: number;
}