import { IsNotEmpty, IsNumber } from 'class-validator';

export class DeleteMyMapParam {
    @IsNumber()
    @IsNotEmpty()
    readonly mapId: number;
}
