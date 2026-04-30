-- AlterTable: add markupPercentage to concepts
ALTER TABLE "concepts" ADD COLUMN IF NOT EXISTS "markupPercentage" DECIMAL(5,2) DEFAULT 0;

-- AlterTable: add category to quotation_items
ALTER TABLE "quotation_items" ADD COLUMN IF NOT EXISTS "category" TEXT;
