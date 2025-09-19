/*
  Warnings:

  - You are about to drop the column `payment_id` on the `dt_order` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[order_id]` on the table `dt_payment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `order_id` to the `dt_payment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "dt_order" DROP CONSTRAINT "dt_order_payment_id_fkey";

-- DropIndex
DROP INDEX "dt_order_payment_id_key";

-- AlterTable
ALTER TABLE "dt_order" DROP COLUMN "payment_id";

-- AlterTable
ALTER TABLE "dt_payment" ADD COLUMN     "order_id" BIGINT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "dt_payment_order_id_key" ON "dt_payment"("order_id");

-- AddForeignKey
ALTER TABLE "dt_payment" ADD CONSTRAINT "dt_payment_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "dt_order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
