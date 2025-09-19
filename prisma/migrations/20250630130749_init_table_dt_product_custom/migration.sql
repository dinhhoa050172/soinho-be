/*
  Warnings:

  - You are about to drop the `bs_cart` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `bs_cart_item` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "bs_cart" DROP CONSTRAINT "bs_cart_user_id_fkey";

-- DropForeignKey
ALTER TABLE "bs_cart_item" DROP CONSTRAINT "bs_cart_item_cart_id_fkey";

-- DropForeignKey
ALTER TABLE "bs_cart_item" DROP CONSTRAINT "bs_cart_item_product_id_fkey";

-- AlterTable
ALTER TABLE "bs_material" ADD COLUMN     "color" VARCHAR(20);

-- AlterTable
ALTER TABLE "dt_product_image" ADD COLUMN     "product_custom_id" BIGINT;

-- DropTable
DROP TABLE "bs_cart";

-- DropTable
DROP TABLE "bs_cart_item";

-- CreateTable
CREATE TABLE "dt_cart" (
    "id" BIGSERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "created_date" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by" VARCHAR(36) NOT NULL,
    "modified_date" TIMESTAMPTZ(3),
    "modified_by" VARCHAR(36),

    CONSTRAINT "dt_cart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dt_cart_item" (
    "id" BIGSERIAL NOT NULL,
    "cart_id" BIGINT NOT NULL,
    "product_id" BIGINT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "price" DECIMAL(10,3) NOT NULL,
    "created_date" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by" VARCHAR(36) NOT NULL,
    "modified_date" TIMESTAMPTZ(3),
    "modified_by" VARCHAR(36),

    CONSTRAINT "dt_cart_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dt_product_custom" (
    "id" BIGSERIAL NOT NULL,
    "character_name" VARCHAR(255) NOT NULL,
    "character_design" VARCHAR(255) NOT NULL,
    "height" DECIMAL(10,3),
    "width" DECIMAL(10,3),
    "length" DECIMAL(10,3),
    "note" TEXT,
    "is_active" BOOLEAN DEFAULT true,
    "material_id" BIGINT,
    "created_date" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by" VARCHAR(36) NOT NULL,
    "modified_date" TIMESTAMPTZ(3),
    "modified_by" VARCHAR(36),

    CONSTRAINT "dt_product_custom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_MaterialToProductCustom" (
    "A" BIGINT NOT NULL,
    "B" BIGINT NOT NULL,

    CONSTRAINT "_MaterialToProductCustom_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "dt_cart_user_id_key" ON "dt_cart"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "dt_cart_item_cart_id_product_id_key" ON "dt_cart_item"("cart_id", "product_id");

-- CreateIndex
CREATE INDEX "_MaterialToProductCustom_B_index" ON "_MaterialToProductCustom"("B");

-- AddForeignKey
ALTER TABLE "dt_cart" ADD CONSTRAINT "dt_cart_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "dt_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dt_cart_item" ADD CONSTRAINT "dt_cart_item_cart_id_fkey" FOREIGN KEY ("cart_id") REFERENCES "dt_cart"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dt_cart_item" ADD CONSTRAINT "dt_cart_item_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "bs_product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dt_product_image" ADD CONSTRAINT "dt_product_image_product_custom_id_fkey" FOREIGN KEY ("product_custom_id") REFERENCES "dt_product_custom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MaterialToProductCustom" ADD CONSTRAINT "_MaterialToProductCustom_A_fkey" FOREIGN KEY ("A") REFERENCES "bs_material"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MaterialToProductCustom" ADD CONSTRAINT "_MaterialToProductCustom_B_fkey" FOREIGN KEY ("B") REFERENCES "dt_product_custom"("id") ON DELETE CASCADE ON UPDATE CASCADE;
