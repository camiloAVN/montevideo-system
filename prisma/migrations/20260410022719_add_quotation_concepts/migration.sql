-- CreateEnum
CREATE TYPE "MarkupType" AS ENUM ('PERCENTAGE', 'FIXED_AMOUNT');

-- CreateTable
CREATE TABLE "quotation_concepts" (
    "id" TEXT NOT NULL,
    "quotationId" TEXT NOT NULL,
    "conceptId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "basePrice" DECIMAL(10,2) NOT NULL,
    "markupType" "MarkupType" NOT NULL DEFAULT 'PERCENTAGE',
    "markupValue" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "unitPrice" DECIMAL(10,2) NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "total" DECIMAL(10,2) NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "quotation_concepts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "quotation_concepts_quotationId_idx" ON "quotation_concepts"("quotationId");

-- CreateIndex
CREATE INDEX "quotation_concepts_conceptId_idx" ON "quotation_concepts"("conceptId");

-- AddForeignKey
ALTER TABLE "quotation_concepts" ADD CONSTRAINT "quotation_concepts_quotationId_fkey" FOREIGN KEY ("quotationId") REFERENCES "quotations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quotation_concepts" ADD CONSTRAINT "quotation_concepts_conceptId_fkey" FOREIGN KEY ("conceptId") REFERENCES "concepts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
