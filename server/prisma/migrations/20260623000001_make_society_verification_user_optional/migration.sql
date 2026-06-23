DO $$ BEGIN
  CREATE TYPE "SocietyVerificationStatus" AS ENUM ('PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS "society_verifications" (
  "id" SERIAL NOT NULL,
  "user_id" INTEGER,
  "societyName" TEXT NOT NULL,
  "societyType" TEXT NOT NULL,
  "city" TEXT NOT NULL,
  "areaSector" TEXT NOT NULL,
  "address" TEXT NOT NULL,
  "googleMapsLocation" TEXT,
  "website" TEXT,
  "officialEmail" TEXT,
  "officialContact" TEXT NOT NULL,
  "developerCompany" TEXT NOT NULL,
  "ownerName" TEXT NOT NULL,
  "cnicNumber" TEXT NOT NULL,
  "designation" TEXT NOT NULL,
  "contactNumber" TEXT NOT NULL,
  "emailAddress" TEXT NOT NULL,
  "cnicFront" TEXT,
  "cnicBack" TEXT,
  "companyRegistration" TEXT,
  "ntnCertificate" TEXT,
  "authorityLetter" TEXT,
  "nocStatus" TEXT NOT NULL,
  "approvingAuthority" TEXT NOT NULL,
  "nocNumber" TEXT,
  "nocIssueDate" TEXT,
  "nocExpiryDate" TEXT,
  "nocCopy" TEXT,
  "ownershipDocuments" TEXT,
  "fardRegistry" TEXT,
  "landTransfer" TEXT,
  "availablePlotSizes" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "status" "SocietyVerificationStatus" NOT NULL DEFAULT 'PENDING',
  "adminNotes" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "society_verifications_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "society_verifications" DROP CONSTRAINT IF EXISTS "society_verifications_user_id_fkey";

ALTER TABLE "society_verifications"
ADD CONSTRAINT "society_verifications_user_id_fkey"
FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
