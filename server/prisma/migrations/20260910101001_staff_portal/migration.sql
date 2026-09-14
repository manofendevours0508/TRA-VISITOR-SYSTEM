/*
  Warnings:

  - Added the required column `updatedAt` to the `Document` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FileMovement" ADD COLUMN "remarks" TEXT;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Document" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "referenceNo" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "sender" TEXT,
    "recipient" TEXT,
    "documentType" TEXT NOT NULL,
    "dateReceived" DATETIME,
    "dateDispatched" DATETIME,
    "deliveryMethod" TEXT,
    "filePath" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "departmentId" INTEGER,
    "assignedToId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Document_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Document_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Document" ("createdAt", "dateDispatched", "dateReceived", "documentType", "filePath", "id", "recipient", "referenceNo", "sender", "status", "subject") SELECT "createdAt", "dateDispatched", "dateReceived", "documentType", "filePath", "id", "recipient", "referenceNo", "sender", "status", "subject" FROM "Document";
DROP TABLE "Document";
ALTER TABLE "new_Document" RENAME TO "Document";
CREATE UNIQUE INDEX "Document_referenceNo_key" ON "Document"("referenceNo");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
