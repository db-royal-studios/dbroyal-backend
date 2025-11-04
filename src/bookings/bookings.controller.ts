import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { ApprovalStatus, BookingStatus, Country } from '@prisma/client';
import { GetCountry } from '../common/decorators/country.decorator';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  create(
    @GetCountry() country: Country,
    @Body()
    body: {
      title?: string;
      eventId?: string;
      clientId: string;
      dateTime: string | Date;
      location?: string;
      approvalStatus?: ApprovalStatus;
      status?: BookingStatus;
      assignedUserIds?: string[];
    },
  ) {
    return this.bookingsService.create({ ...body, country });
  }

  @Get()
  findAll(@GetCountry() country: Country) {
    return this.bookingsService.findAll(country);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookingsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.bookingsService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookingsService.remove(id);
  }

  @Post(':id/assign')
  assign(@Param('id') id: string, @Body() body: { userIds: string[] }) {
    return this.bookingsService.assignUsers(id, body.userIds || []);
  }
}