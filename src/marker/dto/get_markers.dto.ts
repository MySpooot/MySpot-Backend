import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

import { Marker } from '../../entities/marker.entity';

export class GetMarkersParam {
    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    readonly mapId: number;
}

export class GetMarkersResponse {
    @ApiProperty()
    id: number;

    @ApiProperty()
    name: string;

    @ApiProperty()
    latitude: string;

    @ApiProperty()
    longitude: string;

    @ApiProperty()
    addressId: number;

    @ApiProperty({ required: false })
    address?: string;

    @ApiProperty({ required: false })
    openingHours?: string;

    @ApiProperty()
    likeCount: number;

    @ApiProperty()
    isLike: boolean;

    // static from(marker: Marker, isLike: boolean): GetMarkersResponse {
    //     return new GetMarkersResponse(marker, isLike);
    // }

    constructor(marker: Marker, isLike: boolean) {
        this.id = marker.id;
        this.name = marker.name;
        this.latitude = marker.latitude;
        this.longitude = marker.longitude;
        this.addressId = marker.address_id;
        this.address = marker.address;
        this.openingHours = marker.opening_hours;
        this.likeCount = marker.like_count;
        this.isLike = !!isLike;
    }
}
