import { ConfigService } from "@nestjs/config";
export declare class GoogleDriveService {
    private configService;
    private readonly logger;
    private drive;
    constructor(configService: ConfigService);
    extractFolderId(url: string): string | null;
    fetchImagesFromFolder(folderUrl: string): Promise<{
        id: string;
        name: string;
        webViewLink: string;
        thumbnailLink: string;
        downloadLink: string;
    }[]>;
    createShareableLinkForPhotos(photoIds: string[]): Promise<string>;
    getDownloadLink(fileId: string): Promise<string>;
    downloadMultiplePhotos(fileIds: string[]): Promise<string>;
    getFilesMetadata(fileIds: string[]): Promise<{
        id: string;
        name: string;
        mimeType: string;
        size: string;
        webViewLink: string;
        thumbnailLink: string;
        downloadLink: string;
    }[]>;
    downloadFileAsBuffer(fileId: string): Promise<{
        buffer: Buffer;
        filename: string;
    }>;
}
