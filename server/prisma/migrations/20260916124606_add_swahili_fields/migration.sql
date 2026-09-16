-- AlterTable
ALTER TABLE "Announcement" ADD COLUMN "messageSw" TEXT;
ALTER TABLE "Announcement" ADD COLUMN "titleSw" TEXT;

-- AlterTable
ALTER TABLE "Department" ADD COLUMN "descriptionSw" TEXT;
ALTER TABLE "Department" ADD COLUMN "nameSw" TEXT;

-- AlterTable
ALTER TABLE "Office" ADD COLUMN "floorSw" TEXT;
ALTER TABLE "Office" ADD COLUMN "locationSw" TEXT;
ALTER TABLE "Office" ADD COLUMN "nameSw" TEXT;
ALTER TABLE "Office" ADD COLUMN "wingSw" TEXT;

-- AlterTable
ALTER TABLE "Service" ADD COLUMN "descriptionSw" TEXT;
ALTER TABLE "Service" ADD COLUMN "nameSw" TEXT;
ALTER TABLE "Service" ADD COLUMN "procedureSw" TEXT;
ALTER TABLE "Service" ADD COLUMN "requirementsSw" TEXT;
