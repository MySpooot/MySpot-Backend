import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class DeleteMarkerLikeParam {
    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    readonly markerId: number;
}
