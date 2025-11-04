"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventsController = void 0;
const common_1 = require("@nestjs/common");
const events_service_1 = require("./events.service");
const client_1 = require("@prisma/client");
const country_decorator_1 = require("../common/decorators/country.decorator");
let EventsController = class EventsController {
    constructor(eventsService) {
        this.eventsService = eventsService;
    }
    create(country, body) {
        return this.eventsService.create({ ...body, country });
    }
    findAll(country) {
        return this.eventsService.findAll(country);
    }
    findOne(id) {
        return this.eventsService.findOne(id);
    }
    update(id, body) {
        return this.eventsService.update(id, body);
    }
    remove(id) {
        return this.eventsService.remove(id);
    }
    addPhotos(id, body) {
        return this.eventsService.addPhotos(id, body.photos || []);
    }
    listPhotos(id) {
        return this.eventsService.listPhotos(id);
    }
    syncPhotosFromGoogleDrive(id) {
        return this.eventsService.syncPhotosFromGoogleDrive(id);
    }
    createShareableLink(id, body) {
        return this.eventsService.createShareableLink(body.photoIds);
    }
    async getGoogleDriveImages(id) {
        return this.eventsService.getGoogleDriveImages(id);
    }
    async createDownloadSelection(id, body) {
        if (body.photoIds && body.photoIds.length > 0) {
            return this.eventsService.createDownloadSelectionFromPhotos(id, body.photoIds, body.expirationHours);
        }
        else if (body.driveFileIds && body.driveFileIds.length > 0) {
            return this.eventsService.createDownloadSelection(id, body.driveFileIds, body.expirationHours);
        }
        else {
            throw new Error("Either photoIds or driveFileIds must be provided");
        }
    }
    async getDownloadSelection(token) {
        return this.eventsService.getDownloadSelection(token);
    }
    async cleanupExpiredSelections() {
        return this.eventsService.cleanupExpiredSelections();
    }
};
exports.EventsController = EventsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, country_decorator_1.GetCountry)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], EventsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, country_decorator_1.GetCountry)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EventsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EventsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], EventsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EventsController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(":id/photos"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], EventsController.prototype, "addPhotos", null);
__decorate([
    (0, common_1.Get)(":id/photos"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EventsController.prototype, "listPhotos", null);
__decorate([
    (0, common_1.Post)(":id/sync-google-drive"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EventsController.prototype, "syncPhotosFromGoogleDrive", null);
__decorate([
    (0, common_1.Post)(":id/create-shareable-link"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], EventsController.prototype, "createShareableLink", null);
__decorate([
    (0, common_1.Get)(":id/google-drive-images"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "getGoogleDriveImages", null);
__decorate([
    (0, common_1.Post)(":id/download-selection"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "createDownloadSelection", null);
__decorate([
    (0, common_1.Get)("download/:token"),
    __param(0, (0, common_1.Param)("token")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "getDownloadSelection", null);
__decorate([
    (0, common_1.Delete)("download/cleanup"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "cleanupExpiredSelections", null);
exports.EventsController = EventsController = __decorate([
    (0, common_1.Controller)("events"),
    __metadata("design:paramtypes", [events_service_1.EventsService])
], EventsController);
//# sourceMappingURL=events.controller.js.map