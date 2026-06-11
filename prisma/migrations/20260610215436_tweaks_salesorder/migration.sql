/*
  Warnings:

  - A unique constraint covering the columns `[orderNumber]` on the table `SalesOrder` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `customerName` to the `SalesOrder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderNumber` to the `SalesOrder` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SalesOrder" ADD COLUMN     "customerName" TEXT NOT NULL,
ADD COLUMN     "orderNumber" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "SalesOrder_orderNumber_key" ON "SalesOrder"("orderNumber");
