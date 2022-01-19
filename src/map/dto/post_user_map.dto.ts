import { IsBoolean, IsNotEmpty, IsNumberString, IsOptional, IsString, MaxLength } from 'class-validator';

export class PostUserMapBody {
    @IsString()
    @IsNotEmpty()
    @MaxLength(24)
    readonly mapName: string;

    @IsBoolean()
    @IsNotEmpty()
    readonly isPrivate: boolean;

    @IsNumberString()
    @IsOptional()
    @MaxLength(4)
    readonly code?: string;
}
