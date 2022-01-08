import { IsNotEmpty, IsNumber } from 'class-validator';

export class DeleteUserMapParam {
    @IsNumber()
    @IsNotEmpty()
    readonly mapId: number;
}
