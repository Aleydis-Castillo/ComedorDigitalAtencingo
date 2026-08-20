-- AlterEnum
ALTER TYPE "UserRole" ADD VALUE 'EXTERNAL';

-- CreateTable
CREATE TABLE "external_personnel_profiles" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "accessCode" TEXT NOT NULL,
    "type" "ExternalPersonnelType" NOT NULL,
    "startDate" DATE NOT NULL,
    "endDate" DATE NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "external_personnel_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "external_personnel_profiles_userId_key" ON "external_personnel_profiles"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "external_personnel_profiles_accessCode_key" ON "external_personnel_profiles"("accessCode");

-- CreateIndex
CREATE INDEX "external_personnel_profiles_accessCode_idx" ON "external_personnel_profiles"("accessCode");

-- CreateIndex
CREATE INDEX "external_personnel_profiles_type_idx" ON "external_personnel_profiles"("type");

-- CreateIndex
CREATE INDEX "external_personnel_profiles_endDate_idx" ON "external_personnel_profiles"("endDate");

-- CreateIndex
CREATE INDEX "external_personnel_profiles_active_idx" ON "external_personnel_profiles"("active");

-- AddForeignKey
ALTER TABLE "external_personnel_profiles" ADD CONSTRAINT "external_personnel_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
