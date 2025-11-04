/*
  Warnings:

  - Added the required column `passwordHash` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Booking" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT,
    "eventId" TEXT,
    "clientId" TEXT NOT NULL,
    "dateTime" DATETIME NOT NULL,
    "location" TEXT,
    "approvalStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "status" TEXT NOT NULL DEFAULT 'SCHEDULED',
    "country" TEXT NOT NULL DEFAULT 'NG',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Booking_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Booking_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Booking" ("approvalStatus", "clientId", "createdAt", "dateTime", "eventId", "id", "location", "status", "title", "updatedAt") SELECT "approvalStatus", "clientId", "createdAt", "dateTime", "eventId", "id", "location", "status", "title", "updatedAt" FROM "Booking";
DROP TABLE "Booking";
ALTER TABLE "new_Booking" RENAME TO "Booking";
CREATE INDEX "Booking_clientId_idx" ON "Booking"("clientId");
CREATE INDEX "Booking_eventId_idx" ON "Booking"("eventId");
CREATE INDEX "Booking_dateTime_idx" ON "Booking"("dateTime");
CREATE INDEX "Booking_country_idx" ON "Booking"("country");
CREATE TABLE "new_Client" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "avatarUrl" TEXT,
    "country" TEXT NOT NULL DEFAULT 'NG',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Client" ("avatarUrl", "createdAt", "email", "id", "name", "phone", "updatedAt") SELECT "avatarUrl", "createdAt", "email", "id", "name", "phone", "updatedAt" FROM "Client";
DROP TABLE "Client";
ALTER TABLE "new_Client" RENAME TO "Client";
CREATE TABLE "new_Event" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT,
    "date" DATETIME,
    "location" TEXT,
    "coverImageUrl" TEXT,
    "country" TEXT NOT NULL DEFAULT 'NG',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "clientId" TEXT,
    CONSTRAINT "Event_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Event" ("category", "clientId", "coverImageUrl", "createdAt", "date", "description", "id", "location", "name", "slug", "updatedAt") SELECT "category", "clientId", "coverImageUrl", "createdAt", "date", "description", "id", "location", "name", "slug", "updatedAt" FROM "Event";
DROP TABLE "Event";
ALTER TABLE "new_Event" RENAME TO "Event";
CREATE UNIQUE INDEX "Event_slug_key" ON "Event"("slug");
CREATE INDEX "Event_category_idx" ON "Event"("category");
CREATE INDEX "Event_date_idx" ON "Event"("date");
CREATE INDEX "Event_country_idx" ON "Event"("country");
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'PHOTOGRAPHER',
    "phone" TEXT,
    "countryCode" TEXT,
    "country" TEXT NOT NULL DEFAULT 'NG',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_User" ("countryCode", "createdAt", "email", "id", "name", "phone", "role", "updatedAt") SELECT "countryCode", "createdAt", "email", "id", "name", "phone", "role", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
