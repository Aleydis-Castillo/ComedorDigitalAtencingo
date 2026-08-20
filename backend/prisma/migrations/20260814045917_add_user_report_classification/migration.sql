-- CreateEnum
CREATE TYPE "ReportGroup" AS ENUM ('EXTERNAL_PERSONNEL', 'FACTORY_SUGAR_WAREHOUSE', 'ADMINISTRATION_FIELD', 'CORPORATE_PERSONNEL', 'PRACTITIONERS', 'FACTORY_LABORATORY', 'HR_SAFETY_TRAINING');

-- CreateEnum
CREATE TYPE "ExternalPersonnelType" AS ENUM ('VISIT', 'SCHEDULED', 'OTHER_MILL');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "externalType" "ExternalPersonnelType",
ADD COLUMN     "reportGroup" "ReportGroup",
ADD COLUMN     "workLocation" TEXT;

-- CreateIndex
CREATE INDEX "users_reportGroup_idx" ON "users"("reportGroup");
