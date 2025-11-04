import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ClientsService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: { name: string; email?: string; phone?: string; avatarUrl?: string }) {
    return this.prisma.client.create({ data });
  }

  findAll() {
    return this.prisma.client.findMany();
  }

  findOne(id: string) {
    return this.prisma.client.findUnique({ where: { id } });
  }

  update(id: string, data: Partial<{ name: string; email: string; phone: string; avatarUrl: string }>) {
    return this.prisma.client.update({ where: { id }, data });
  }

  remove(id: string) {
    return this.prisma.client.delete({ where: { id } });
  }
}