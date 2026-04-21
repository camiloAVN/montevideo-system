-- CreateTable
CREATE TABLE "catering_menus_from_items" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "computedTotal" DECIMAL(12,2),
    "customTotal" DECIMAL(12,2),
    "useCustomTotal" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "catering_menus_from_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "catering_menus_from_items_relations" (
    "id" TEXT NOT NULL,
    "menuId" TEXT NOT NULL,
    "menajeId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "catering_menus_from_items_relations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "catering_menus_custom" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "supplierId" TEXT,
    "plateCount" INTEGER,
    "costMode" TEXT NOT NULL DEFAULT 'PER_PLATE',
    "plateCost" DECIMAL(12,2),
    "packageCost" DECIMAL(12,2),
    "markupPercent" DECIMAL(10,4),
    "markupAmount" DECIMAL(12,2),
    "total" DECIMAL(12,2),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "catering_menus_custom_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "catering_menus_from_items_relations_menuId_idx" ON "catering_menus_from_items_relations"("menuId");

-- CreateIndex
CREATE INDEX "catering_menus_from_items_relations_menajeId_idx" ON "catering_menus_from_items_relations"("menajeId");

-- CreateIndex
CREATE UNIQUE INDEX "catering_menus_from_items_relations_menuId_menajeId_key" ON "catering_menus_from_items_relations"("menuId", "menajeId");

-- CreateIndex
CREATE INDEX "catering_menus_custom_supplierId_idx" ON "catering_menus_custom"("supplierId");

-- AddForeignKey
ALTER TABLE "catering_menus_from_items_relations" ADD CONSTRAINT "catering_menus_from_items_relations_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "catering_menus_from_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "catering_menus_from_items_relations" ADD CONSTRAINT "catering_menus_from_items_relations_menajeId_fkey" FOREIGN KEY ("menajeId") REFERENCES "catering_menaje"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "catering_menus_custom" ADD CONSTRAINT "catering_menus_custom_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "catering_suppliers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
