import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class DeleteMarkerParam {
    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    readonly markerId: number;
}
