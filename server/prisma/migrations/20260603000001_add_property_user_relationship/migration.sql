-- Rename Property table to properties
ALTER TABLE "Property" RENAME TO "properties";

-- Add userId column with foreign key
ALTER TABLE "properties" ADD COLUMN "user_id" INTEGER;

-- Add approval tracking columns
ALTER TABLE "properties" ADD COLUMN "status" TEXT DEFAULT 'pending';
ALTER TABLE "properties" ADD COLUMN "approved_at" TIMESTAMP(3);
ALTER TABLE "properties" ADD COLUMN "rejected_at" TIMESTAMP(3);
ALTER TABLE "properties" ADD COLUMN "approved_by" INTEGER;
ALTER TABLE "properties" ADD COLUMN "rejection_reason" TEXT;

-- Update created_at and updated_at column mapping
ALTER TABLE "properties" RENAME COLUMN "createdAt" TO "created_at";
ALTER TABLE "properties" RENAME COLUMN "updatedAt" TO "updated_at";

-- Create foreign key for user_id
ALTER TABLE "properties" ADD CONSTRAINT "properties_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Create indexes
CREATE INDEX "properties_user_id_idx" ON "properties"("user_id");
CREATE INDEX "properties_status_idx" ON "properties"("status");
CREATE INDEX "properties_city_idx" ON "properties"("city");
CREATE INDEX "properties_purpose_idx" ON "properties"("purpose");
CREATE INDEX "properties_propertyType_idx" ON "properties"("propertyType");
CREATE INDEX "properties_price_idx" ON "properties"("price");

-- Drop old indexes if they exist
DROP INDEX IF EXISTS "Property_city_idx";
DROP INDEX IF EXISTS "Property_purpose_idx";
DROP INDEX IF EXISTS "Property_propertyType_idx";
DROP INDEX IF EXISTS "Property_price_idx";
