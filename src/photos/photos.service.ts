import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PhotosService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.photo.findMany();
  }

  findOne(id: string) {
    return this.prisma.photo.findUnique({ where: { id } });
  }

  update(id: string, data: any) {
    return this.prisma.photo.update({ where: { id }, data });
  }

  remove(id: string) {
    return this.prisma.photo.delete({ where: { id } });
  }
}