"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var CountryContextInterceptor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CountryContextInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
let CountryContextInterceptor = CountryContextInterceptor_1 = class CountryContextInterceptor {
    constructor() {
        this.logger = new common_1.Logger(CountryContextInterceptor_1.name);
    }
    intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        const country = request.country;
        const method = request.method;
        const url = request.url;
        this.logger.log(`[${country}] ${method} ${url}`);
        return next.handle().pipe((0, operators_1.tap)(() => {
            this.logger.debug(`[${country}] Request completed: ${method} ${url}`);
        }));
    }
};
exports.CountryContextInterceptor = CountryContextInterceptor;
exports.CountryContextInterceptor = CountryContextInterceptor = CountryContextInterceptor_1 = __decorate([
    (0, common_1.Injectable)()
], CountryContextInterceptor);
//# sourceMappingURL=country-context.interceptor.js.map