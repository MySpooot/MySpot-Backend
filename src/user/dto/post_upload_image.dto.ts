import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class PostUploadImageBody {
    @ApiProperty({ type: 'file' })
    @IsNotEmpty()
    file: any;
}
