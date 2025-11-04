import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { EventsService } from "./events.service";
import { EventCategory, Country } from "@prisma/client";
import { GetCountry } from "../common/decorators/country.decorator";

@Controller("events")
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  create(
    @GetCountry() country: Country,
    @Body()
    body: {
      name: string;
      slug: string;
      category: EventCategory;
      description?: string;
      date?: string | Date;
      location?: string;
      coverImageUrl?: string;
      googleDriveUrl?: string;
      clientId?: string;
    }
  ) {
    return this.eventsService.create({ ...body, country });
  }

  @Get()
  findAll(@GetCountry() country: Country) {
    return this.eventsService.findAll(country);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.eventsService.findOne(id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() body: any) {
    return this.eventsService.update(id, body);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.eventsService.remove(id);
  }

  @Post(":id/photos")
  addPhotos(
    @Param("id") id: string,
    @Body()
    body: { photos: { url: string; caption?: string; uploadedById?: string }[] }
  ) {
    return this.eventsService.addPhotos(id, body.photos || []);
  }

  @Get(":id/photos")
  listPhotos(@Param("id") id: string) {
    return this.eventsService.listPhotos(id);
  }

  @Post(":id/sync-google-drive")
  syncPhotosFromGoogleDrive(@Param("id") id: string) {
    return this.eventsService.syncPhotosFromGoogleDrive(id);
  }

  @Post(":id/create-shareable-link")
  createShareableLink(
    @Param("id") id: string,
    @Body() body: { photoIds: string[] }
  ) {
    return this.eventsService.createShareableLink(body.photoIds);
  }

  @Get(":id/google-drive-images")
  async getGoogleDriveImages(@Param("id") id: string) {
    return this.eventsService.getGoogleDriveImages(id);
  }

  @Post(":id/download-selection")
  async createDownloadSelection(
    @Param("id") id: string,
    @Body() body: { photoIds?: string[]; driveFileIds?: string[]; expirationHours?: number }
  ) {
    // Support both photo IDs (from database) and direct drive file IDs
    if (body.photoIds && body.photoIds.length > 0) {
      return this.eventsService.createDownloadSelectionFromPhotos(
        id,
        body.photoIds,
        body.expirationHours
      );
    } else if (body.driveFileIds && body.driveFileIds.length > 0) {
      return this.eventsService.createDownloadSelection(
        id,
        body.driveFileIds,
        body.expirationHours
      );
    } else {
      throw new Error("Either photoIds or driveFileIds must be provided");
    }
  }

  @Get("download/:token")
  async getDownloadSelection(@Param("token") token: string) {
    return this.eventsService.getDownloadSelection(token);
  }

  @Delete("download/cleanup")
  async cleanupExpiredSelections() {
    return this.eventsService.cleanupExpiredSelections();
  }
}
