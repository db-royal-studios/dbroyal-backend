import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ApprovalStatus, BookingStatus, Country } from '@prisma/client';

@Injectable()
export class BookingsService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: {
    title?: string;
    eventId?: string;
    clientId: string;
    dateTime: string | Date;
    location?: string;
    approvalStatus?: ApprovalStatus;
    status?: BookingStatus;
    country?: Country;
    assignedUserIds?: string[];
  }) {
    const { assignedUserIds, ...rest } = data;
    if (typeof rest.dateTime === 'string') rest.dateTime = new Date(rest.dateTime);
    return this.prisma.$transaction(async (tx) => {
      const booking = await tx.booking.create({ data: rest as any });
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

  findAll(country?: Country) {
    return this.prisma.booking.findMany({ 
      where: country ? { country } : undefined,
      include: { assigned: true, client: true, event: true } 
    });
  }

  findOne(id: string) {
    return this.prisma.booking.findUnique({ where: { id }, include: { assigned: true, client: true, event: true } });
  }

  update(id: string, data: any) {
    if (data?.dateTime && typeof data.dateTime === 'string') data.dateTime = new Date(data.dateTime);
    return this.prisma.booking.update({ where: { id }, data });
  }

  remove(id: string) {
    return this.prisma.booking.delete({ where: { id } });
  }

  assignUsers(id: string, userIds: string[]) {
    return this.prisma.$transaction([
      this.prisma.bookingAssignment.deleteMany({ where: { bookingId: id } }),
      this.prisma.bookingAssignment.createMany({ data: userIds.map((userId) => ({ bookingId: id, userId })) }),
    ]);
  }
}