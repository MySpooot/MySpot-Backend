import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';

export class PostUserMapHeaders {
    @IsNumber()
    @IsNotEmpty()
    readonly isPublic: number;
}

export class PostUserMapBody {
    @IsString()
    @IsNotEmpty()
    @MaxLength(24)
    readonly mapName: string;
}
