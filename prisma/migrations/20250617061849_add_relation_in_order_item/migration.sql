/*
  Warnings:

  - You are about to drop the column `product_variant_id` on the `dt_order_item` table. All the data in the column will be lost.
  - Added the required column `product_id` to the `dt_order_item` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "dt_order_item" DROP COLUMN "product_variant_id",
ADD COLUMN     "product_id" BIGINT NOT NULL;

-- AddForeignKey
ALTER TABLE "dt_order_item" ADD CONSTRAINT "dt_order_item_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "dt_order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dt_order_item" ADD CONSTRAINT "dt_order_item_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "bs_product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
