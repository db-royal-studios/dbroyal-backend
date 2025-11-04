"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CountryGuard = void 0;
const common_1 = require("@nestjs/common");
const country_enum_1 = require("../enums/country.enum");
let CountryGuard = class CountryGuard {
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        let country = request.headers['x-country']?.toUpperCase();
        if (!country) {
            const host = request.headers.host || '';
            if (host.startsWith('ng.')) {
                country = 'NG';
            }
            else if (host.startsWith('uk.')) {
                country = 'UK';
            }
        }
        if (!country && request.query?.country) {
            country = request.query.country.toUpperCase();
        }
        if (country && !Object.values(country_enum_1.Country).includes(country)) {
            throw new common_1.BadRequestException(`Invalid country code. Supported countries: ${Object.values(country_enum_1.Country).join(', ')}`);
        }
        request.country = country || country_enum_1.Country.NIGERIA;
        return true;
    }
};
exports.CountryGuard = CountryGuard;
exports.CountryGuard = CountryGuard = __decorate([
    (0, common_1.Injectable)()
], CountryGuard);
//# sourceMappingURL=country.guard.js.map