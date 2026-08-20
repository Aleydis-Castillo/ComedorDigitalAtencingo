-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('EMPLOYEE', 'PRACTITIONER', 'MANAGER', 'COMEDOR');

-- CreateEnum
CREATE TYPE "ServiceType" AS ENUM ('BREAKFAST', 'LUNCH');

-- CreateEnum
CREATE TYPE "DeliveryType" AS ENUM ('CAFETERIA', 'OFFICE');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'PREPARING', 'READY', 'DELIVERED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "SignatureType" AS ENUM ('BIOMETRIC', 'DRAWN');

-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('SCHEDULED', 'ACTIVE', 'FINISHED', 'CANCELLED');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "employeeNumber" TEXT,
    "name" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "department" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "practitioner_profiles" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "accessCode" TEXT NOT NULL,
    "startDate" DATE NOT NULL,
    "endDate" DATE NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "practitioner_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "menu_days" (
    "id" UUID NOT NULL,
    "date" DATE NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "menu_days_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dishes" (
    "id" UUID NOT NULL,
    "menuDayId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "service" "ServiceType" NOT NULL,
    "available" BOOLEAN NOT NULL DEFAULT true,
    "position" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dishes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" UUID NOT NULL,
    "folio" TEXT NOT NULL,
    "userId" UUID NOT NULL,
    "dishId" UUID NOT NULL,
    "service" "ServiceType" NOT NULL,
    "deliveryType" "DeliveryType" NOT NULL,
    "zone" TEXT,
    "location" TEXT,
    "observations" TEXT,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "orderedFor" DATE NOT NULL,
    "deliveredAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_signatures" (
    "id" UUID NOT NULL,
    "orderId" UUID NOT NULL,
    "type" "SignatureType" NOT NULL,
    "signatureData" TEXT,
    "signedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "order_signatures_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "eventDate" DATE NOT NULL,
    "eventTime" TIME(0) NOT NULL,
    "service" "ServiceType" NOT NULL,
    "people" INTEGER NOT NULL,
    "location" TEXT NOT NULL,
    "observations" TEXT,
    "status" "EventStatus" NOT NULL DEFAULT 'SCHEDULED',
    "createdById" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_employeeNumber_key" ON "users"("employeeNumber");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- CreateIndex
CREATE INDEX "users_active_idx" ON "users"("active");

-- CreateIndex
CREATE UNIQUE INDEX "practitioner_profiles_userId_key" ON "practitioner_profiles"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "practitioner_profiles_accessCode_key" ON "practitioner_profiles"("accessCode");

-- CreateIndex
CREATE INDEX "practitioner_profiles_accessCode_idx" ON "practitioner_profiles"("accessCode");

-- CreateIndex
CREATE INDEX "practitioner_profiles_endDate_idx" ON "practitioner_profiles"("endDate");

-- CreateIndex
CREATE UNIQUE INDEX "menu_days_date_key" ON "menu_days"("date");

-- CreateIndex
CREATE INDEX "menu_days_date_idx" ON "menu_days"("date");

-- CreateIndex
CREATE INDEX "menu_days_published_idx" ON "menu_days"("published");

-- CreateIndex
CREATE INDEX "dishes_menuDayId_service_idx" ON "dishes"("menuDayId", "service");

-- CreateIndex
CREATE INDEX "dishes_available_idx" ON "dishes"("available");

-- CreateIndex
CREATE UNIQUE INDEX "dishes_menuDayId_service_position_key" ON "dishes"("menuDayId", "service", "position");

-- CreateIndex
CREATE UNIQUE INDEX "orders_folio_key" ON "orders"("folio");

-- CreateIndex
CREATE INDEX "orders_userId_idx" ON "orders"("userId");

-- CreateIndex
CREATE INDEX "orders_dishId_idx" ON "orders"("dishId");

-- CreateIndex
CREATE INDEX "orders_status_idx" ON "orders"("status");

-- CreateIndex
CREATE INDEX "orders_orderedFor_idx" ON "orders"("orderedFor");

-- CreateIndex
CREATE INDEX "orders_service_orderedFor_idx" ON "orders"("service", "orderedFor");

-- CreateIndex
CREATE UNIQUE INDEX "order_signatures_orderId_key" ON "order_signatures"("orderId");

-- CreateIndex
CREATE INDEX "events_eventDate_idx" ON "events"("eventDate");

-- CreateIndex
CREATE INDEX "events_status_idx" ON "events"("status");

-- CreateIndex
CREATE INDEX "events_createdById_idx" ON "events"("createdById");

-- AddForeignKey
ALTER TABLE "practitioner_profiles" ADD CONSTRAINT "practitioner_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dishes" ADD CONSTRAINT "dishes_menuDayId_fkey" FOREIGN KEY ("menuDayId") REFERENCES "menu_days"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_dishId_fkey" FOREIGN KEY ("dishId") REFERENCES "dishes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_signatures" ADD CONSTRAINT "order_signatures_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
