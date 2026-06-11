/*
  Warnings:

  - The values [DELIVERY] on the enum `ShipmentStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ShipmentStatus_new" AS ENUM ('CREATED', 'READY_TO_SHIP', 'SHIPPED', 'DELIVERED', 'CANCELLED');
ALTER TABLE "public"."Shipment" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Shipment" ALTER COLUMN "status" TYPE "ShipmentStatus_new" USING ("status"::text::"ShipmentStatus_new");
ALTER TYPE "ShipmentStatus" RENAME TO "ShipmentStatus_old";
ALTER TYPE "ShipmentStatus_new" RENAME TO "ShipmentStatus";
DROP TYPE "public"."ShipmentStatus_old";
ALTER TABLE "Shipment" ALTER COLUMN "status" SET DEFAULT 'CREATED';
COMMIT;
