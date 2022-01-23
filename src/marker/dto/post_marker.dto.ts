import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class PostMarkerParam {
    @IsNumber()
    @IsNotEmpty()
    readonly mapId: number;
}

export class PostMarkerBody {
    @IsString()
    @IsNotEmpty()
    readonly locationName: string;

    @IsString()
    @IsNotEmpty()
    readonly latitude: string;

    @IsString()
    @IsNotEmpty()
    readonly longitude: string;

    @IsNumber()
    @IsNotEmpty()
    readonly locationUniqNum: number;
}
