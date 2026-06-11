/*
  Warnings:

  - You are about to drop the column `delveredAt` on the `Shipment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Shipment" DROP COLUMN "delveredAt",
ADD COLUMN     "deliveredAt" TIMESTAMP(3);
