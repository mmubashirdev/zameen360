-- AlterTable
ALTER TABLE "properties" ADD COLUMN     "latitude" DECIMAL(10,7),
ADD COLUMN     "longitude" DECIMAL(10,7);

-- CreateIndex
CREATE INDEX "properties_latitude_longitude_idx" ON "properties"("latitude", "longitude");
