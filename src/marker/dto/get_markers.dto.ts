import { IsNotEmpty, IsNumber } from 'class-validator';

import { Marker } from '../../entities/marker.entity';

export class GetMarkersParam {
    @IsNumber()
    @IsNotEmpty()
    readonly mapId: number;
}

export class GetMarkersResponse {
    id: number;
    name: string;
    latitude: string;
    longitude: string;
    kakaoAddressId: number;
    kakaoAddress?: string;
    kakaoOpeningHours?: string;

    static from(marker: Marker): GetMarkersResponse {
        return new GetMarkersResponse(marker);
    }

    constructor(marker: Marker) {
        this.id = marker.id;
        this.name = marker.name;
        this.latitude = marker.latitude;
        this.longitude = marker.longitude;
        this.kakaoAddressId = marker.kakao_address_id;
        this.kakaoAddress = marker.kakao_address;
        this.kakaoOpeningHours = marker.kakao_opening_hours;
    }
}
