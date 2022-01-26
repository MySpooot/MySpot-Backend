import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class PostUserFavoriteMapParam {
    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    readonly favoriteMapId: number;
}
