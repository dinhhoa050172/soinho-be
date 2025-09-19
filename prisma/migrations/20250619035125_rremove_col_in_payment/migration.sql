/*
  Warnings:

  - You are about to drop the column `order_id` on the `dt_payment` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "dt_payment_order_id_key";

-- AlterTable
ALTER TABLE "dt_payment" DROP COLUMN "order_id";
