import { ClientsService } from './clients.service';
export declare class ClientsController {
    private readonly clientsService;
    constructor(clientsService: ClientsService);
    create(body: {
        name: string;
        email?: string;
        phone?: string;
        avatarUrl?: string;
    }): import(".prisma/client").Prisma.Prisma__ClientClient<{
        id: string;
        email: string | null;
        name: string;
        phone: string | null;
        country: import(".prisma/client").$Enums.Country;
        createdAt: Date;
        updatedAt: Date;
        avatarUrl: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        email: string | null;
        name: string;
        phone: string | null;
        country: import(".prisma/client").$Enums.Country;
        createdAt: Date;
        updatedAt: Date;
        avatarUrl: string | null;
    }[]>;
    findOne(id: string): import(".prisma/client").Prisma.Prisma__ClientClient<{
        id: string;
        email: string | null;
        name: string;
        phone: string | null;
        country: import(".prisma/client").$Enums.Country;
        createdAt: Date;
        updatedAt: Date;
        avatarUrl: string | null;
    }, null, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    update(id: string, body: any): import(".prisma/client").Prisma.Prisma__ClientClient<{
        id: string;
        email: string | null;
        name: string;
        phone: string | null;
        country: import(".prisma/client").$Enums.Country;
        createdAt: Date;
        updatedAt: Date;
        avatarUrl: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    remove(id: string): import(".prisma/client").Prisma.Prisma__ClientClient<{
        id: string;
        email: string | null;
        name: string;
        phone: string | null;
        country: import(".prisma/client").$Enums.Country;
        createdAt: Date;
        updatedAt: Date;
        avatarUrl: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
}
