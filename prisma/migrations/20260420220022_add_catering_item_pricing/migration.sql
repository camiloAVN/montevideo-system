/*
  Warnings:

  - You are about to drop the column `unit` on the `catering_items` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "catering_items" DROP COLUMN "unit",
ADD COLUMN     "markupAmount" DECIMAL(10,2),
ADD COLUMN     "markupPercent" DECIMAL(10,4),
ADD COLUMN     "supplierId" TEXT,
ADD COLUMN     "total" DECIMAL(10,2);

-- CreateIndex
CREATE INDEX "catering_items_supplierId_idx" ON "catering_items"("supplierId");

-- AddForeignKey
ALTER TABLE "catering_items" ADD CONSTRAINT "catering_items_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "catering_suppliers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
