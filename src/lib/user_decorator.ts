import {createParamDecorator, ExecutionContext} from '@nestjs/common';

export enum UserLevel {
    User = 1,
    Admin = 10
}

export interface AuthUser {
    id: number;
    level: UserLevel;
}

export const User_ = createParamDecorator(
    (_, input: ExecutionContext): AuthUser => {
        return input.switchToHttp().getRequest().user;
    }
);