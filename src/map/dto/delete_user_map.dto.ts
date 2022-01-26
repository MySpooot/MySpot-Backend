import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class DeleteUserMapParam {
    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    readonly mapId: number;
}
