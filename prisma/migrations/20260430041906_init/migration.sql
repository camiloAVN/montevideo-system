/*
  Warnings:

  - You are about to drop the column `menajeId` on the `catering_menus_from_items_relations` table. All the data in the column will be lost.
  - You are about to drop the column `includes` on the `catering_packages` table. All the data in the column will be lost.
  - You are about to drop the column `maxGuests` on the `catering_packages` table. All the data in the column will be lost.
  - You are about to drop the column `minGuests` on the `catering_packages` table. All the data in the column will be lost.
  - You are about to drop the column `pricePerPerson` on the `catering_packages` table. All the data in the column will be lost.
  - You are about to drop the `catering_staff` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[menuId,itemId]` on the table `catering_menus_from_items_relations` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `itemId` to the `catering_menus_from_items_relations` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "catering_menus_from_items_relations" DROP CONSTRAINT "catering_menus_from_items_relations_menajeId_fkey";

-- DropIndex
DROP INDEX "catering_menus_from_items_relations_menajeId_idx";

-- DropIndex
DROP INDEX "catering_menus_from_items_relations_menuId_menajeId_key";

-- AlterTable
ALTER TABLE "catering_menus_from_items_relations" DROP COLUMN "menajeId",
ADD COLUMN     "itemId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "catering_packages" DROP COLUMN "includes",
DROP COLUMN "maxGuests",
DROP COLUMN "minGuests",
DROP COLUMN "pricePerPerson",
ADD COLUMN     "computedTotal" DECIMAL(12,2),
ADD COLUMN     "customTotal" DECIMAL(12,2),
ADD COLUMN     "useCustomTotal" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "catering_staff";

-- CreateTable
CREATE TABLE "catering_staff_freelance" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "documentNumber" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "city" TEXT,
    "role" TEXT,
    "ratePerShift" DECIMAL(12,2),
    "ratePerHour" DECIMAL(12,2),
    "nightSurchargePercent" DECIMAL(5,2),
    "travelAllowance" DECIMAL(12,2),
    "hasSocialSecurity" BOOLEAN NOT NULL DEFAULT false,
    "hasFoodHandlingCert" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "catering_staff_freelance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "catering_staff_company" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "supplierId" TEXT,
    "role" TEXT,
    "staffCount" INTEGER,
    "costMode" TEXT NOT NULL DEFAULT 'PER_HOUR',
    "costPerHour" DECIMAL(12,2),
    "costPerShift" DECIMAL(12,2),
    "markupPercent" DECIMAL(10,4),
    "markupAmount" DECIMAL(12,2),
    "total" DECIMAL(12,2),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "catering_staff_company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "catering_package_items" (
    "id" TEXT NOT NULL,
    "packageId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "unitCost" DECIMAL(12,2),
    "subtotal" DECIMAL(12,2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "catering_package_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "catering_package_menaje" (
    "id" TEXT NOT NULL,
    "packageId" TEXT NOT NULL,
    "menajeId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "unitCost" DECIMAL(12,2),
    "subtotal" DECIMAL(12,2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "catering_package_menaje_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "catering_package_menus" (
    "id" TEXT NOT NULL,
    "packageId" TEXT NOT NULL,
    "menuType" TEXT NOT NULL,
    "menuId" TEXT NOT NULL,
    "menuName" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "unitCost" DECIMAL(12,2),
    "subtotal" DECIMAL(12,2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "catering_package_menus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "catering_package_staff" (
    "id" TEXT NOT NULL,
    "packageId" TEXT NOT NULL,
    "staffType" TEXT NOT NULL,
    "staffId" TEXT NOT NULL,
    "staffName" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "unitCost" DECIMAL(12,2),
    "subtotal" DECIMAL(12,2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "catering_package_staff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "personal_categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "personal_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "personal_staff" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "shiftRate" DECIMAL(12,2),
    "categoryId" TEXT,
    "notes" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "personal_staff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quotation_catering_lines" (
    "id" TEXT NOT NULL,
    "quotationId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "refId" TEXT,
    "description" TEXT NOT NULL,
    "category" TEXT,
    "people" INTEGER NOT NULL DEFAULT 1,
    "shifts" INTEGER NOT NULL DEFAULT 1,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "unitPrice" DECIMAL(12,2) NOT NULL,
    "total" DECIMAL(12,2) NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "quotation_catering_lines_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "catering_staff_freelance_role_idx" ON "catering_staff_freelance"("role");

-- CreateIndex
CREATE INDEX "catering_staff_company_supplierId_idx" ON "catering_staff_company"("supplierId");

-- CreateIndex
CREATE INDEX "catering_staff_company_role_idx" ON "catering_staff_company"("role");

-- CreateIndex
CREATE INDEX "catering_package_items_packageId_idx" ON "catering_package_items"("packageId");

-- CreateIndex
CREATE UNIQUE INDEX "catering_package_items_packageId_itemId_key" ON "catering_package_items"("packageId", "itemId");

-- CreateIndex
CREATE INDEX "catering_package_menaje_packageId_idx" ON "catering_package_menaje"("packageId");

-- CreateIndex
CREATE UNIQUE INDEX "catering_package_menaje_packageId_menajeId_key" ON "catering_package_menaje"("packageId", "menajeId");

-- CreateIndex
CREATE INDEX "catering_package_menus_packageId_idx" ON "catering_package_menus"("packageId");

-- CreateIndex
CREATE INDEX "catering_package_staff_packageId_idx" ON "catering_package_staff"("packageId");

-- CreateIndex
CREATE INDEX "quotation_catering_lines_quotationId_idx" ON "quotation_catering_lines"("quotationId");

-- CreateIndex
CREATE INDEX "catering_menus_from_items_relations_itemId_idx" ON "catering_menus_from_items_relations"("itemId");

-- CreateIndex
CREATE UNIQUE INDEX "catering_menus_from_items_relations_menuId_itemId_key" ON "catering_menus_from_items_relations"("menuId", "itemId");

-- AddForeignKey
ALTER TABLE "catering_menus_from_items_relations" ADD CONSTRAINT "catering_menus_from_items_relations_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "catering_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "catering_staff_company" ADD CONSTRAINT "catering_staff_company_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "catering_suppliers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "catering_package_items" ADD CONSTRAINT "catering_package_items_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "catering_packages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "catering_package_items" ADD CONSTRAINT "catering_package_items_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "catering_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "catering_package_menaje" ADD CONSTRAINT "catering_package_menaje_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "catering_packages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "catering_package_menaje" ADD CONSTRAINT "catering_package_menaje_menajeId_fkey" FOREIGN KEY ("menajeId") REFERENCES "catering_menaje"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "catering_package_menus" ADD CONSTRAINT "catering_package_menus_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "catering_packages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "catering_package_staff" ADD CONSTRAINT "catering_package_staff_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "catering_packages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "personal_staff" ADD CONSTRAINT "personal_staff_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "personal_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quotation_catering_lines" ADD CONSTRAINT "quotation_catering_lines_quotationId_fkey" FOREIGN KEY ("quotationId") REFERENCES "quotations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
