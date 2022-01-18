import { IsNotEmpty, IsNumber } from 'class-validator';

export class DeleteUserFavoriteMapParam {
    @IsNumber()
    @IsNotEmpty()
    readonly favoriteMapId: number;
}
