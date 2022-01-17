import { IsNotEmpty, IsNumber } from 'class-validator';

export class PostUserFavoriteMapParam {
    @IsNumber()
    @IsNotEmpty()
    readonly favoriteMapId: number;
}
