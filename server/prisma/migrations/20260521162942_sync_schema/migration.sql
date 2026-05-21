/*
  Warnings:

  - You are about to drop the `Property` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `password_resets` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `seller_details` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_activity_logs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_profiles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_sessions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_verifications` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "password_resets" DROP CONSTRAINT "password_resets_user_id_fkey";

-- DropForeignKey
ALTER TABLE "seller_details" DROP CONSTRAINT "seller_details_user_id_fkey";

-- DropForeignKey
ALTER TABLE "user_activity_logs" DROP CONSTRAINT "user_activity_logs_user_id_fkey";

-- DropForeignKey
ALTER TABLE "user_profiles" DROP CONSTRAINT "user_profiles_user_id_fkey";

-- DropForeignKey
ALTER TABLE "user_sessions" DROP CONSTRAINT "user_sessions_user_id_fkey";

-- DropForeignKey
ALTER TABLE "user_verifications" DROP CONSTRAINT "user_verifications_user_id_fkey";

-- DropTable
DROP TABLE "Property";

-- DropTable
DROP TABLE "password_resets";

-- DropTable
DROP TABLE "seller_details";

-- DropTable
DROP TABLE "user_activity_logs";

-- DropTable
DROP TABLE "user_profiles";

-- DropTable
DROP TABLE "user_sessions";

-- DropTable
DROP TABLE "user_verifications";

-- DropTable
DROP TABLE "users";

-- DropEnum
DROP TYPE "ActivityStatus";

-- DropEnum
DROP TYPE "Gender";

-- DropEnum
DROP TYPE "OtpType";

-- DropEnum
DROP TYPE "Role";
