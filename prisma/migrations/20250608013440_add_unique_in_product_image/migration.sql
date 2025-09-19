/*
  Warnings:

  - A unique constraint covering the columns `[product_id,image_url]` on the table `dt_product_image` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "bs_product" ADD COLUMN     "is_active" BOOLEAN DEFAULT true;

-- CreateIndex
CREATE UNIQUE INDEX "dt_product_image_product_id_image_url_key" ON "dt_product_image"("product_id", "image_url");
