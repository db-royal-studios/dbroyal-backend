import { EventsService } from "./events.service";
import { EventCategory, Country } from "@prisma/client";
export declare class EventsController {
    private readonly eventsService;
    constructor(eventsService: EventsService);
    create(country: Country, body: {
        name: string;
        slug: string;
        category: EventCategory;
        description?: string;
        date?: string | Date;
        location?: string;
        coverImageUrl?: string;
        googleDriveUrl?: string;
        clientId?: string;
    }): import(".prisma/client").Prisma.Prisma__EventClient<{
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
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    findAll(country: Country): import(".prisma/client").Prisma.PrismaPromise<({
        photos: {
            id: string;
            createdAt: Date;
            status: import(".prisma/client").$Enums.UploadStatus;
            url: string;
            eventId: string;
            driveFileId: string | null;
            caption: string | null;
            uploadedById: string | null;
        }[];
    } & {
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
    })[]>;
    findOne(id: string): import(".prisma/client").Prisma.Prisma__EventClient<{
        photos: {
            id: string;
            createdAt: Date;
            status: import(".prisma/client").$Enums.UploadStatus;
            url: string;
            eventId: string;
            driveFileId: string | null;
            caption: string | null;
            uploadedById: string | null;
        }[];
    } & {
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
    }, null, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    update(id: string, body: any): import(".prisma/client").Prisma.Prisma__EventClient<{
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
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    remove(id: string): import(".prisma/client").Prisma.Prisma__EventClient<{
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
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    addPhotos(id: string, body: {
        photos: {
            url: string;
            caption?: string;
            uploadedById?: string;
        }[];
    }): import(".prisma/client").Prisma.PrismaPromise<import(".prisma/client").Prisma.BatchPayload>;
    listPhotos(id: string): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.UploadStatus;
        url: string;
        eventId: string;
        driveFileId: string | null;
        caption: string | null;
        uploadedById: string | null;
    }[]>;
    syncPhotosFromGoogleDrive(id: string): Promise<{
        synced: number;
        photos: {
            id: string;
            name: string;
            webViewLink: string;
            thumbnailLink: string;
            downloadLink: string;
        }[];
    }>;
    createShareableLink(id: string, body: {
        photoIds: string[];
    }): Promise<string>;
    getGoogleDriveImages(id: string): Promise<{
        eventId: string;
        eventName: string;
        googleDriveUrl: string;
        totalImages: number;
        images: {
            id: string;
            name: string;
            webViewLink: string;
            thumbnailLink: string;
            downloadLink: string;
        }[];
    }>;
    createDownloadSelection(id: string, body: {
        photoIds?: string[];
        driveFileIds?: string[];
        expirationHours?: number;
    }): Promise<{
        token: string;
        shareLink: string;
        expiresAt: Date;
    }>;
    getDownloadSelection(token: string): Promise<{
        event: {
            id: string;
            name: string;
        };
        images: {
            id: string;
            downloadLink: string;
            viewLink: string;
        }[];
        createdAt: Date;
        expiresAt: Date;
    }>;
    cleanupExpiredSelections(): Promise<{
        deleted: number;
    }>;
}
