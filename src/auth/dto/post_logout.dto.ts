import { IsNotEmpty, IsString } from 'class-validator';

export class PostLogOutBody {
    @IsString()
    @IsNotEmpty()
    readonly code: string;
}
