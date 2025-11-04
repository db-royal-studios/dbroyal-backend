import { UsersService } from './users.service';
import { Role } from '@prisma/client';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(body: {
        name: string;
        email: string;
        passwordHash: string;
        role?: Role;
        phone?: string;
        countryCode?: string;
    }): import(".prisma/client").Prisma.Prisma__UserClient<{
        id: string;
        email: string;
        name: string;
        passwordHash: string;
        role: import(".prisma/client").$Enums.Role;
        phone: string | null;
        countryCode: string | null;
        country: import(".prisma/client").$Enums.Country;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        email: string;
        name: string;
        passwordHash: string;
        role: import(".prisma/client").$Enums.Role;
        phone: string | null;
        countryCode: string | null;
        country: import(".prisma/client").$Enums.Country;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(id: string): import(".prisma/client").Prisma.Prisma__UserClient<{
        id: string;
        email: string;
        name: string;
        passwordHash: string;
        role: import(".prisma/client").$Enums.Role;
        phone: string | null;
        countryCode: string | null;
        country: import(".prisma/client").$Enums.Country;
        createdAt: Date;
        updatedAt: Date;
    }, null, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    update(id: string, body: any): import(".prisma/client").Prisma.Prisma__UserClient<{
        id: string;
        email: string;
        name: string;
        passwordHash: string;
        role: import(".prisma/client").$Enums.Role;
        phone: string | null;
        countryCode: string | null;
        country: import(".prisma/client").$Enums.Country;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    remove(id: string): import(".prisma/client").Prisma.Prisma__UserClient<{
        id: string;
        email: string;
        name: string;
        passwordHash: string;
        role: import(".prisma/client").$Enums.Role;
        phone: string | null;
        countryCode: string | null;
        country: import(".prisma/client").$Enums.Country;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
}
