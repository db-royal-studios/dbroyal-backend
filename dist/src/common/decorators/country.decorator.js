"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetCountry = void 0;
const common_1 = require("@nestjs/common");
const country_enum_1 = require("../enums/country.enum");
exports.GetCountry = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return request.country || country_enum_1.Country.NIGERIA;
});
//# sourceMappingURL=country.decorator.js.map