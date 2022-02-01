import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

export class PostMyLocationBody {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    readonly locationName: string;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    readonly addressId: number;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    @MaxLength(128)
    readonly address?: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    @MaxLength(128)
    readonly roadAddress?: string;
}
