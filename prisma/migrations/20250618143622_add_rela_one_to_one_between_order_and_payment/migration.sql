/*
  Warnings:

  - A unique constraint covering the columns `[payment_id]` on the table `dt_order` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[order_id]` on the table `dt_payment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `amount` to the `dt_payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order_id` to the `dt_payment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "dt_order" DROP CONSTRAINT "dt_order_payment_id_fkey";

-- DropForeignKey
ALTER TABLE "dt_order" DROP CONSTRAINT "dt_order_shipping_id_fkey";

-- AlterTable
ALTER TABLE "dt_payment" ADD COLUMN     "amount" INTEGER NOT NULL,
ADD COLUMN     "description" VARCHAR(255),
ADD COLUMN     "order_id" BIGINT NOT NULL,
ADD COLUMN     "pay_url" VARCHAR(255);

-- CreateIndex
CREATE UNIQUE INDEX "dt_order_payment_id_key" ON "dt_order"("payment_id");

-- CreateIndex
CREATE UNIQUE INDEX "dt_payment_order_id_key" ON "dt_payment"("order_id");

-- AddForeignKey
ALTER TABLE "dt_order" ADD CONSTRAINT "dt_order_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "dt_payment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dt_order" ADD CONSTRAINT "dt_order_shipping_id_fkey" FOREIGN KEY ("shipping_id") REFERENCES "dt_shipping"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
