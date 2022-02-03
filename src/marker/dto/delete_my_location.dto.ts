import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class DeleteMyLocationParam {
    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    readonly addressId: number;
}
