-- DropForeignKey
ALTER TABLE "properties" DROP CONSTRAINT "properties_user_id_fkey";

-- DropIndex
DROP INDEX "properties_status_idx";

-- DropIndex
DROP INDEX "properties_user_id_idx";

-- AlterTable
ALTER TABLE "properties" RENAME CONSTRAINT "Property_pkey" TO "properties_pkey";

-- CreateTable
CREATE TABLE "admins" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL DEFAULT 'ismalumair912@gmail.com',
    "passwordHash" TEXT NOT NULL DEFAULT '12345678Aa@',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "properties" ADD CONSTRAINT "properties_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
