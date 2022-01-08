import { IsNotEmpty, IsNumber } from 'class-validator';

export class DeleteUserRecentMapParam {
    @IsNumber()
    @IsNotEmpty()
    readonly recentMapId: number;
}
