import { IsNotEmpty, IsNumber } from 'class-validator';

export class PostUserRecentMapParam {
    @IsNumber()
    @IsNotEmpty()
    readonly recentMapId: number;
}
