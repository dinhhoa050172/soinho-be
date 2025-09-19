/*
  Warnings:

  - You are about to drop the column `address_id` on the `dt_order` table. All the data in the column will be lost.
  - Added the required column `shipping_full_name` to the `dt_order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shipping_street` to the `dt_order` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "StatusPayment" AS ENUM ('PENDING', 'SUCCESSED', 'FAILED');

-- CreateEnum
CREATE TYPE "StatusShipping" AS ENUM ('CREATED', 'IN_TRANSIT', 'DELIVERED', 'FAILED', 'RETURNED');

-- DropForeignKey
ALTER TABLE "dt_order" DROP CONSTRAINT "dt_order_user_id_fkey";

-- AlterTable
ALTER TABLE "dt_order" DROP COLUMN "address_id",
ADD COLUMN     "shipping_country" VARCHAR(100) NOT NULL DEFAULT 'Vietnam',
ADD COLUMN     "shipping_district" VARCHAR(100),
ADD COLUMN     "shipping_full_name" VARCHAR(100) NOT NULL,
ADD COLUMN     "shipping_phone" VARCHAR(20),
ADD COLUMN     "shipping_postal_code" VARCHAR(20),
ADD COLUMN     "shipping_province" VARCHAR(100),
ADD COLUMN     "shipping_street" VARCHAR(255) NOT NULL,
ADD COLUMN     "shipping_ward" VARCHAR(100);

-- CreateTable
CREATE TABLE "bs_payment_method" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" VARCHAR(255),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_date" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by" VARCHAR(36) NOT NULL,
    "modified_date" TIMESTAMPTZ(3),
    "modified_by" VARCHAR(36),

    CONSTRAINT "bs_payment_method_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bs_shipping_method" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" VARCHAR(255),
    "estimated_days" INTEGER,
    "base_fee" DECIMAL(10,2) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_date" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by" VARCHAR(36) NOT NULL,
    "modified_date" TIMESTAMPTZ(3),
    "modified_by" VARCHAR(36),

    CONSTRAINT "bs_shipping_method_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dt_address" (
    "id" BIGSERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "full_name" VARCHAR(100) NOT NULL,
    "phone" VARCHAR(20),
    "street" VARCHAR(255) NOT NULL,
    "ward" VARCHAR(100),
    "district" VARCHAR(100),
    "province" VARCHAR(100),
    "country" VARCHAR(100) NOT NULL DEFAULT 'VietNam',
    "postal_code" VARCHAR(20),
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "created_date" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by" VARCHAR(36) NOT NULL,
    "modified_date" TIMESTAMPTZ(3),
    "modified_by" VARCHAR(36),

    CONSTRAINT "dt_address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dt_order_item" (
    "id" BIGSERIAL NOT NULL,
    "total_amount" DECIMAL(10,2) NOT NULL,
    "quantity" INTEGER NOT NULL,
    "address_id" BIGINT NOT NULL,
    "product_variant_id" BIGINT NOT NULL,
    "created_date" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by" VARCHAR(36) NOT NULL,
    "modified_date" TIMESTAMPTZ(3),
    "modified_by" VARCHAR(36),

    CONSTRAINT "dt_order_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dt_payment" (
    "id" BIGSERIAL NOT NULL,
    "status" "StatusPayment" NOT NULL DEFAULT 'PENDING',
    "payment_method_id" BIGINT NOT NULL,
    "created_date" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by" VARCHAR(36) NOT NULL,
    "modified_date" TIMESTAMPTZ(3),
    "modified_by" VARCHAR(36),

    CONSTRAINT "dt_payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dt_shipping" (
    "id" BIGSERIAL NOT NULL,
    "tracking_code" VARCHAR(100),
    "shipped_at" TIMESTAMPTZ(3),
    "delivered_at" TIMESTAMPTZ(3),
    "status" "StatusShipping" NOT NULL DEFAULT 'CREATED',
    "shipping_method_id" BIGINT NOT NULL,
    "created_date" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by" VARCHAR(36) NOT NULL,
    "modified_date" TIMESTAMPTZ(3),
    "modified_by" VARCHAR(36),

    CONSTRAINT "dt_shipping_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "bs_payment_method_name_key" ON "bs_payment_method"("name");

-- CreateIndex
CREATE UNIQUE INDEX "bs_shipping_method_name_key" ON "bs_shipping_method"("name");

-- AddForeignKey
ALTER TABLE "dt_address" ADD CONSTRAINT "dt_address_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "dt_user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dt_order" ADD CONSTRAINT "dt_order_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "dt_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dt_order" ADD CONSTRAINT "dt_order_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "dt_payment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dt_order" ADD CONSTRAINT "dt_order_shipping_id_fkey" FOREIGN KEY ("shipping_id") REFERENCES "dt_shipping"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dt_payment" ADD CONSTRAINT "dt_payment_payment_method_id_fkey" FOREIGN KEY ("payment_method_id") REFERENCES "bs_payment_method"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dt_shipping" ADD CONSTRAINT "dt_shipping_shipping_method_id_fkey" FOREIGN KEY ("shipping_method_id") REFERENCES "bs_shipping_method"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
