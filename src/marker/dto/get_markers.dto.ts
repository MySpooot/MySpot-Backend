import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

import { Marker } from '../../entities/marker.entity';

export class GetMarkersParam {
    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    readonly mapId: number;
}

export class GetMarkersHeaders {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    readonly authorization?: string;
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
    roadAddress?: string;

    @ApiProperty()
    likeCount: number;

    @ApiProperty()
    replyCount: number;

    @ApiProperty({ required: false })
    isLike?: boolean;

    @ApiProperty({ required: false })
    isMyLocation?: boolean;

    constructor(marker: Marker, isLike?: boolean, isMyLocation?: boolean) {
        this.id = marker.id;
        this.name = marker.name;
        this.latitude = marker.latitude;
        this.longitude = marker.longitude;
        this.addressId = marker.address_id;
        this.address = marker.address;
        this.roadAddress = marker.road_address;
        this.likeCount = marker.like_count;
        this.replyCount = marker.reply_count;
        this.isLike = !!isLike;
        this.isMyLocation = !!isMyLocation;
    }
}
