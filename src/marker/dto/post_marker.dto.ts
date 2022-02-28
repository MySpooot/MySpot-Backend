import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

import { Marker } from '../../entities/marker.entity';

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

export class PostMarkerResponse {
    @ApiProperty()
    id: number;

    @ApiProperty()
    userId: number;

    @ApiProperty()
    mapId: number;

    @ApiProperty()
    locationName: string;

    @ApiProperty()
    latitude: string;

    @ApiProperty()
    longitude: string;

    @ApiProperty()
    addressId: number;

    @ApiProperty({ required: false })
    address?: string;

    @ApiProperty({ required: false })
    roadAddress?: string;

    constructor(marker: Marker) {
        this.id = marker.id;
        this.userId = marker.user_id;
        this.mapId = marker.map_id;
        this.locationName = marker.name;
        this.latitude = marker.latitude;
        this.longitude = marker.longitude;
        this.addressId = marker.address_id;
        this.address = marker.address;
        this.roadAddress = marker.road_address;
    }
}
