import { CanActivate, ExecutionContext } from '@nestjs/common';
export declare class CountryGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean;
}
