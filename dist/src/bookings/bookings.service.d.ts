import { PrismaService } from '../prisma/prisma.service';
import { ApprovalStatus, BookingStatus, Country } from '@prisma/client';
export declare class BookingsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
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
    }): Promise<{
        client: {
            id: string;
            email: string | null;
            name: string;
            phone: string | null;
            country: import(".prisma/client").$Enums.Country;
            createdAt: Date;
            updatedAt: Date;
            avatarUrl: string | null;
        };
        event: {
            id: string;
            name: string;
            country: import(".prisma/client").$Enums.Country;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            category: import(".prisma/client").$Enums.EventCategory;
            description: string | null;
            date: Date | null;
            location: string | null;
            coverImageUrl: string | null;
            googleDriveUrl: string | null;
            driveFolderId: string | null;
            clientId: string | null;
        };
        assigned: {
            bookingId: string;
            userId: string;
            assignedAt: Date;
        }[];
    } & {
        id: string;
        country: import(".prisma/client").$Enums.Country;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.BookingStatus;
        location: string | null;
        clientId: string;
        eventId: string | null;
        title: string | null;
        dateTime: Date;
        approvalStatus: import(".prisma/client").$Enums.ApprovalStatus;
    }>;
    findAll(country?: Country): import(".prisma/client").Prisma.PrismaPromise<({
        client: {
            id: string;
            email: string | null;
            name: string;
            phone: string | null;
            country: import(".prisma/client").$Enums.Country;
            createdAt: Date;
            updatedAt: Date;
            avatarUrl: string | null;
        };
        event: {
            id: string;
            name: string;
            country: import(".prisma/client").$Enums.Country;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            category: import(".prisma/client").$Enums.EventCategory;
            description: string | null;
            date: Date | null;
            location: string | null;
            coverImageUrl: string | null;
            googleDriveUrl: string | null;
            driveFolderId: string | null;
            clientId: string | null;
        };
        assigned: {
            bookingId: string;
            userId: string;
            assignedAt: Date;
        }[];
    } & {
        id: string;
        country: import(".prisma/client").$Enums.Country;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.BookingStatus;
        location: string | null;
        clientId: string;
        eventId: string | null;
        title: string | null;
        dateTime: Date;
        approvalStatus: import(".prisma/client").$Enums.ApprovalStatus;
    })[]>;
    findOne(id: string): import(".prisma/client").Prisma.Prisma__BookingClient<{
        client: {
            id: string;
            email: string | null;
            name: string;
            phone: string | null;
            country: import(".prisma/client").$Enums.Country;
            createdAt: Date;
            updatedAt: Date;
            avatarUrl: string | null;
        };
        event: {
            id: string;
            name: string;
            country: import(".prisma/client").$Enums.Country;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            category: import(".prisma/client").$Enums.EventCategory;
            description: string | null;
            date: Date | null;
            location: string | null;
            coverImageUrl: string | null;
            googleDriveUrl: string | null;
            driveFolderId: string | null;
            clientId: string | null;
        };
        assigned: {
            bookingId: string;
            userId: string;
            assignedAt: Date;
        }[];
    } & {
        id: string;
        country: import(".prisma/client").$Enums.Country;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.BookingStatus;
        location: string | null;
        clientId: string;
        eventId: string | null;
        title: string | null;
        dateTime: Date;
        approvalStatus: import(".prisma/client").$Enums.ApprovalStatus;
    }, null, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    update(id: string, data: any): import(".prisma/client").Prisma.Prisma__BookingClient<{
        id: string;
        country: import(".prisma/client").$Enums.Country;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.BookingStatus;
        location: string | null;
        clientId: string;
        eventId: string | null;
        title: string | null;
        dateTime: Date;
        approvalStatus: import(".prisma/client").$Enums.ApprovalStatus;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    remove(id: string): import(".prisma/client").Prisma.Prisma__BookingClient<{
        id: string;
        country: import(".prisma/client").$Enums.Country;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.BookingStatus;
        location: string | null;
        clientId: string;
        eventId: string | null;
        title: string | null;
        dateTime: Date;
        approvalStatus: import(".prisma/client").$Enums.ApprovalStatus;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    assignUsers(id: string, userIds: string[]): Promise<[import(".prisma/client").Prisma.BatchPayload, import(".prisma/client").Prisma.BatchPayload]>;
}
