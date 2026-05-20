-- CreateTable
CREATE TABLE "Property" (
    "id" SERIAL NOT NULL,
    "purpose" TEXT,
    "propertyType" TEXT,
    "title" TEXT,
    "description" TEXT,
    "areaSize" TEXT,
    "areaUnit" TEXT,
    "bedrooms" TEXT,
    "bathrooms" TEXT,
    "floors" TEXT,
    "parking" TEXT,
    "yearBuilt" TEXT,
    "furnishing" TEXT,
    "possession" TEXT,
    "facing" TEXT,
    "price" BIGINT,
    "negotiable" BOOLEAN NOT NULL DEFAULT false,
    "installmentAvailable" BOOLEAN NOT NULL DEFAULT false,
    "downPayment" BIGINT,
    "monthlyInstallment" BIGINT,
    "duration" TEXT,
    "monthlyRent" BIGINT,
    "securityDeposit" BIGINT,
    "advanceMonths" TEXT,
    "amenities" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "city" TEXT,
    "locality" TEXT,
    "address" TEXT,
    "images" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "videoUrl" TEXT,
    "floorPlan" TEXT,
    "status" TEXT NOT NULL DEFAULT 'published',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Property_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Property_city_idx" ON "Property"("city");

-- CreateIndex
CREATE INDEX "Property_purpose_idx" ON "Property"("purpose");

-- CreateIndex
CREATE INDEX "Property_propertyType_idx" ON "Property"("propertyType");

-- CreateIndex
CREATE INDEX "Property_price_idx" ON "Property"("price");
