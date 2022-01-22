import { IsNotEmpty, IsNumber } from 'class-validator';

export class GetMapAccessibleParam {
    @IsNumber()
    @IsNotEmpty()
    readonly mapId: number;
}
