/*
  Warnings:

  - A unique constraint covering the columns `[cart_id,product_id]` on the table `bs_cart_item` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "bs_cart_item_cart_id_product_id_key" ON "bs_cart_item"("cart_id", "product_id");
