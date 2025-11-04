import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { EventsService } from './events.service';
import { GoogleDriveService } from '../google-drive/google-drive.service';
import * as archiver from 'archiver';

@Controller('download')
export class DownloadController {
  constructor(
    private readonly eventsService: EventsService,
    private readonly googleDriveService: GoogleDriveService,
  ) {}

  /**
   * View download selection details
   */
  @Get(':token')
  async getDownloadSelection(@Param('token') token: string) {
    return this.eventsService.getDownloadSelection(token);
  }

  /**
   * Download selected photos as ZIP file
   */
  @Get(':token/zip')
  async downloadAsZip(
    @Param('token') token: string,
    @Res() res: Response,
  ) {
    const selection = await this.eventsService.getDownloadSelection(token);
    
    // Set response headers for ZIP download
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${selection.event.name}-photos.zip"`,
    );

    // Create ZIP archive
    const archive = archiver('zip', {
      zlib: { level: 9 }, // Maximum compression
    });

    // Pipe archive to response
    archive.pipe(res);

    // Add each file to the archive
    for (const image of selection.images) {
      try {
        const { buffer, filename } = await this.googleDriveService.downloadFileAsBuffer(
          image.id,
        );
        archive.append(buffer, { name: filename });
      } catch (error) {
        console.error(`Failed to download file ${image.id}:`, error.message);
        // Continue with other files even if one fails
      }
    }

    // Finalize the archive
    await archive.finalize();
  }
}
