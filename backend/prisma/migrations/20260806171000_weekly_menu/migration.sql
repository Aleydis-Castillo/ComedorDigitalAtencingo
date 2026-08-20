-- CreateTable
CREATE TABLE "weekly_menu" (
    "id" UUID NOT NULL,
    "day" TEXT NOT NULL,
    "serviceType" "ServiceType" NOT NULL,
    "dishName" TEXT NOT NULL,
    "description" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "available" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "weekly_menu_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "weekly_menu_day_idx" ON "weekly_menu"("day");

-- CreateIndex
CREATE INDEX "weekly_menu_serviceType_idx" ON "weekly_menu"("serviceType");
