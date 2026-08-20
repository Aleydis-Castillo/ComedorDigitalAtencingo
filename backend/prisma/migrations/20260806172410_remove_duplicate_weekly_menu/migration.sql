/*
  Warnings:

  - You are about to drop the `weekly_menu` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "weekly_menu";

-- CreateIndex
CREATE INDEX "order_signatures_signedAt_idx" ON "order_signatures"("signedAt");

-- CreateIndex
CREATE INDEX "practitioner_profiles_active_idx" ON "practitioner_profiles"("active");
