/*
  Warnings:

  - You are about to drop the `trust_scores` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_notifications` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "trust_scores" DROP CONSTRAINT "trust_scores_user_id_fkey";

-- DropForeignKey
ALTER TABLE "user_notifications" DROP CONSTRAINT "user_notifications_user_id_fkey";

-- DropTable
DROP TABLE "trust_scores";

-- DropTable
DROP TABLE "user_notifications";

-- DropEnum
DROP TYPE "NotificationType";

-- DropEnum
DROP TYPE "RiskLevel";
