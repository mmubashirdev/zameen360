-- Rename Property table to properties
ALTER TABLE "Property" RENAME TO "properties";

-- Rename camelCase columns to snake_case
ALTER TABLE "properties" RENAME COLUMN "propertyType" TO "property_type";
ALTER TABLE "properties" RENAME COLUMN "areaSize" TO "area_size";
ALTER TABLE "properties" RENAME COLUMN "areaUnit" TO "area_unit";
ALTER TABLE "properties" RENAME COLUMN "yearBuilt" TO "year_built";
ALTER TABLE "properties" RENAME COLUMN "installmentAvailable" TO "installment_available";
ALTER TABLE "properties" RENAME COLUMN "downPayment" TO "down_payment";
ALTER TABLE "properties" RENAME COLUMN "monthlyInstallment" TO "monthly_installment";
ALTER TABLE "properties" RENAME COLUMN "monthlyRent" TO "monthly_rent";
ALTER TABLE "properties" RENAME COLUMN "securityDeposit" TO "security_deposit";
ALTER TABLE "properties" RENAME COLUMN "advanceMonths" TO "advance_months";
ALTER TABLE "properties" RENAME COLUMN "videoUrl" TO "video_url";
ALTER TABLE "properties" RENAME COLUMN "floorPlan" TO "floor_plan";
ALTER TABLE "properties" RENAME COLUMN "createdAt" TO "created_at";
ALTER TABLE "properties" RENAME COLUMN "updatedAt" TO "updated_at";

-- Add userId column with foreign key
ALTER TABLE "properties" ADD COLUMN "user_id" INTEGER;

-- Update status column to default 'pending' instead of 'published'
ALTER TABLE "properties" ALTER COLUMN "status" SET DEFAULT 'pending';

-- Add approval tracking columns
ALTER TABLE "properties" ADD COLUMN "approved_at" TIMESTAMP(3);
ALTER TABLE "properties" ADD COLUMN "rejected_at" TIMESTAMP(3);
ALTER TABLE "properties" ADD COLUMN "approved_by" INTEGER;
ALTER TABLE "properties" ADD COLUMN "rejection_reason" TEXT;

-- Create foreign key for user_id
ALTER TABLE "properties" ADD CONSTRAINT "properties_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Drop old indexes
DROP INDEX IF EXISTS "Property_city_idx";
DROP INDEX IF EXISTS "Property_purpose_idx";
DROP INDEX IF EXISTS "Property_propertyType_idx";
DROP INDEX IF EXISTS "Property_price_idx";

-- Create new indexes
CREATE INDEX "properties_user_id_idx" ON "properties"("user_id");
CREATE INDEX "properties_status_idx" ON "properties"("status");
CREATE INDEX "properties_city_idx" ON "properties"("city");
CREATE INDEX "properties_purpose_idx" ON "properties"("purpose");
CREATE INDEX "properties_property_type_idx" ON "properties"("property_type");
CREATE INDEX "properties_price_idx" ON "properties"("price");
