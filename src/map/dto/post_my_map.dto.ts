import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class PostMyMapBody {
    @IsString()
    @IsNotEmpty()
    @MaxLength(24)
    readonly mapName: string;
}
