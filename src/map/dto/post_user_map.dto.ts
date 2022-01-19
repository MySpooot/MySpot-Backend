import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class PostUserMapBody {
    @IsString()
    @IsNotEmpty()
    @MaxLength(24)
    readonly mapName: string;

    @IsBoolean()
    @IsNotEmpty()
    readonly isPrivate: boolean;

    @IsString()
    @IsOptional()
    @MaxLength(4)
    readonly code?: string;
}
