import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Country } from '../enums/country.enum';

export const GetCountry = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): Country => {
    const request = ctx.switchToHttp().getRequest();
    return request.country || Country.NIGERIA; // Default to Nigeria if not set
  },
);
