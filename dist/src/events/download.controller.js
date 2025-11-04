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
exports.DownloadController = void 0;
const common_1 = require("@nestjs/common");
const events_service_1 = require("./events.service");
const google_drive_service_1 = require("../google-drive/google-drive.service");
const archiver = require("archiver");
let DownloadController = class DownloadController {
    constructor(eventsService, googleDriveService) {
        this.eventsService = eventsService;
        this.googleDriveService = googleDriveService;
    }
    async getDownloadSelection(token) {
        return this.eventsService.getDownloadSelection(token);
    }
    async downloadAsZip(token, res) {
        const selection = await this.eventsService.getDownloadSelection(token);
        res.setHeader('Content-Type', 'application/zip');
        res.setHeader('Content-Disposition', `attachment; filename="${selection.event.name}-photos.zip"`);
        const archive = archiver('zip', {
            zlib: { level: 9 },
        });
        archive.pipe(res);
        for (const image of selection.images) {
            try {
                const { buffer, filename } = await this.googleDriveService.downloadFileAsBuffer(image.id);
                archive.append(buffer, { name: filename });
            }
            catch (error) {
                console.error(`Failed to download file ${image.id}:`, error.message);
            }
        }
        await archive.finalize();
    }
};
exports.DownloadController = DownloadController;
__decorate([
    (0, common_1.Get)(':token'),
    __param(0, (0, common_1.Param)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DownloadController.prototype, "getDownloadSelection", null);
__decorate([
    (0, common_1.Get)(':token/zip'),
    __param(0, (0, common_1.Param)('token')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], DownloadController.prototype, "downloadAsZip", null);
exports.DownloadController = DownloadController = __decorate([
    (0, common_1.Controller)('download'),
    __metadata("design:paramtypes", [events_service_1.EventsService,
        google_drive_service_1.GoogleDriveService])
], DownloadController);
//# sourceMappingURL=download.controller.js.map