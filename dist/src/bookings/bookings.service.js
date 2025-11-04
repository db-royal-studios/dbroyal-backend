"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let BookingsService = class BookingsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    create(data) {
        const { assignedUserIds, ...rest } = data;
        if (typeof rest.dateTime === 'string')
            rest.dateTime = new Date(rest.dateTime);
        return this.prisma.$transaction(async (tx) => {
            const booking = await tx.booking.create({ data: rest });
            if (assignedUserIds?.length) {
                await tx.bookingAssignment.createMany({
                    data: assignedUserIds.map((userId) => ({ bookingId: booking.id, userId })),
                });
            }
            return tx.booking.findUnique({
                where: { id: booking.id },
                include: { assigned: true, client: true, event: true },
            });
        });
    }
    findAll(country) {
        return this.prisma.booking.findMany({
            where: country ? { country } : undefined,
            include: { assigned: true, client: true, event: true }
        });
    }
    findOne(id) {
        return this.prisma.booking.findUnique({ where: { id }, include: { assigned: true, client: true, event: true } });
    }
    update(id, data) {
        if (data?.dateTime && typeof data.dateTime === 'string')
            data.dateTime = new Date(data.dateTime);
        return this.prisma.booking.update({ where: { id }, data });
    }
    remove(id) {
        return this.prisma.booking.delete({ where: { id } });
    }
    assignUsers(id, userIds) {
        return this.prisma.$transaction([
            this.prisma.bookingAssignment.deleteMany({ where: { bookingId: id } }),
            this.prisma.bookingAssignment.createMany({ data: userIds.map((userId) => ({ bookingId: id, userId })) }),
        ]);
    }
};
exports.BookingsService = BookingsService;
exports.BookingsService = BookingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BookingsService);
//# sourceMappingURL=bookings.service.js.map