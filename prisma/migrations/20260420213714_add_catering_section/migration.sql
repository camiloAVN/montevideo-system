-- CreateTable
CREATE TABLE "catering_suppliers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nit" TEXT,
    "contactName" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "city" TEXT,
    "country" TEXT,
    "website" TEXT,
    "notes" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "catering_suppliers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "catering_items" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT,
    "unit" TEXT,
    "unitCost" DECIMAL(10,2),
    "notes" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "catering_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "catering_menaje" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "condition" TEXT,
    "location" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "catering_menaje_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "catering_menus" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT,
    "pricePerPerson" DECIMAL(10,2),
    "minGuests" INTEGER,
    "maxGuests" INTEGER,
    "notes" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "catering_menus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "catering_menu_courses" (
    "id" TEXT NOT NULL,
    "menuId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "items" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "catering_menu_courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "catering_staff" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "dailyRate" DECIMAL(10,2),
    "notes" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "catering_staff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "catering_packages" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT,
    "pricePerPerson" DECIMAL(10,2),
    "minGuests" INTEGER,
    "maxGuests" INTEGER,
    "includes" TEXT,
    "notes" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "catering_packages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "catering_package_suppliers" (
    "packageId" TEXT NOT NULL,
    "supplierId" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "catering_package_suppliers_pkey" PRIMARY KEY ("packageId","supplierId")
);

-- CreateIndex
CREATE INDEX "catering_items_category_idx" ON "catering_items"("category");

-- CreateIndex
CREATE INDEX "catering_menaje_category_idx" ON "catering_menaje"("category");

-- CreateIndex
CREATE INDEX "catering_menus_type_idx" ON "catering_menus"("type");

-- CreateIndex
CREATE INDEX "catering_menu_courses_menuId_idx" ON "catering_menu_courses"("menuId");

-- CreateIndex
CREATE INDEX "catering_staff_role_idx" ON "catering_staff"("role");

-- AddForeignKey
ALTER TABLE "catering_menu_courses" ADD CONSTRAINT "catering_menu_courses_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "catering_menus"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "catering_package_suppliers" ADD CONSTRAINT "catering_package_suppliers_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "catering_packages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "catering_package_suppliers" ADD CONSTRAINT "catering_package_suppliers_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "catering_suppliers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
