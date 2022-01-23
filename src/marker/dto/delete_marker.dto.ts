import { IsNotEmpty, IsNumber } from 'class-validator';

export class DeleteMarkerParam {
    @IsNumber()
    @IsNotEmpty()
    readonly markerId: number;
}
