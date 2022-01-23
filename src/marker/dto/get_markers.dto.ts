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

    static from(marker: Marker): GetMarkersResponse {
        return new GetMarkersResponse(marker);
    }

    constructor(marker: Marker) {
        this.id = marker.id;
        this.name = marker.name;
        this.latitude = marker.latitude;
        this.longitude = marker.longitude;
    }
}
