import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class DeleteUserRecentMapParam {
    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    readonly recentMapId: number;
}
