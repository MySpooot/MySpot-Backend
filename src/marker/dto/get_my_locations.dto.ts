import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

import { MyLocation } from '../../entities/my_location.entity';

export class GetMyLocationsQuery {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    readonly offset?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    readonly limit?: number;
}

export class GetMyLocationsResponse {
    @ApiProperty()
    id: number;

    @ApiProperty()
    name: string;

    @ApiProperty()
    addressId: number;

    @ApiProperty({ required: false })
    address?: string;

    @ApiProperty({ required: false })
    roadAddress?: string;

    static from(locations?: MyLocation): GetMyLocationsResponse {
        return new GetMyLocationsResponse(locations);
    }

    constructor(locations: MyLocation) {
        this.id = locations.id;
        this.name = locations.name;
        this.addressId = locations.address_id;
        this.address = locations.address;
        this.roadAddress = locations.road_address;
    }
}
