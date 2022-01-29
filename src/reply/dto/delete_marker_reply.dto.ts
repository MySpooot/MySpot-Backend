import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class DeleteMarkerReplyParam {
    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    readonly replyId: number;
}
