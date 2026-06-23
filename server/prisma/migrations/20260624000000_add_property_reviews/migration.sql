-- CreateTable
CREATE TABLE "property_reviews" (
    "id" SERIAL NOT NULL,
    "property_id" INTEGER NOT NULL,
    "user_id" INTEGER,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "rating" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "property_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "property_reviews_property_id_idx" ON "property_reviews"("property_id");

-- CreateIndex
CREATE INDEX "property_reviews_rating_idx" ON "property_reviews"("rating");

-- AddForeignKey
ALTER TABLE "property_reviews" ADD CONSTRAINT "property_reviews_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "property_reviews" ADD CONSTRAINT "property_reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
