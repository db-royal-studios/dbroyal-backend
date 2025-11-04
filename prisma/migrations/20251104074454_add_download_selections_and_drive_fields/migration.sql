-- AlterTable
ALTER TABLE "Event" ADD COLUMN "driveFolderId" TEXT;
ALTER TABLE "Event" ADD COLUMN "googleDriveUrl" TEXT;

-- AlterTable
ALTER TABLE "Photo" ADD COLUMN "driveFileId" TEXT;

-- CreateTable
CREATE TABLE "DownloadSelection" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "eventId" TEXT NOT NULL,
    "photoIds" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "DownloadSelection_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "DownloadSelection_token_key" ON "DownloadSelection"("token");

-- CreateIndex
CREATE INDEX "DownloadSelection_token_idx" ON "DownloadSelection"("token");

-- CreateIndex
CREATE INDEX "DownloadSelection_eventId_idx" ON "DownloadSelection"("eventId");

-- CreateIndex
CREATE INDEX "Photo_driveFileId_idx" ON "Photo"("driveFileId");
