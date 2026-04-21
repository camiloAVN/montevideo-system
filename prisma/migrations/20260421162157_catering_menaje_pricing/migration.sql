/*
  Warnings:

  - You are about to drop the column `condition` on the `catering_menaje` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `catering_menaje` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `catering_menaje` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `catering_menaje` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "catering_menaje" DROP COLUMN "condition",
DROP COLUMN "location",
DROP COLUMN "notes",
DROP COLUMN "quantity",
ADD COLUMN     "costMode" TEXT NOT NULL DEFAULT 'UNIT',
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "markupAmount" DECIMAL(12,2),
ADD COLUMN     "markupPercent" DECIMAL(10,4),
ADD COLUMN     "packageCost" DECIMAL(12,2),
ADD COLUMN     "replacementCost" DECIMAL(12,2),
ADD COLUMN     "supplierId" TEXT,
ADD COLUMN     "total" DECIMAL(12,2),
ADD COLUMN     "totalQuantity" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "unitCost" DECIMAL(12,2);

-- CreateIndex
CREATE INDEX "catering_menaje_supplierId_idx" ON "catering_menaje"("supplierId");

-- AddForeignKey
ALTER TABLE "catering_menaje" ADD CONSTRAINT "catering_menaje_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "catering_suppliers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
