/*
  Warnings:

  - A unique constraint covering the columns `[externalId]` on the table `Order` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `externalId` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gateway` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "externalId" TEXT NOT NULL,
ADD COLUMN     "gateway" TEXT NOT NULL,
ADD COLUMN     "paymentUrl" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Order_externalId_key" ON "Order"("externalId");
