/*
  Warnings:

  - A unique constraint covering the columns `[shipping_id]` on the table `dt_order` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "dt_order_shipping_id_key" ON "dt_order"("shipping_id");
