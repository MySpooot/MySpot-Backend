import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

export class PostMarkerParam {
    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    readonly mapId: number;
}

export class PostMarkerBody {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MaxLength(24)
    readonly locationName: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MaxLength(32)
    readonly latitude: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MaxLength(32)
    readonly longitude: string;

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
