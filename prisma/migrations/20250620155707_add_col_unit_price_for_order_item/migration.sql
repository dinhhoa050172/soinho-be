/*
  Warnings:

  - You are about to drop the column `total_amount` on the `dt_order_item` table. All the data in the column will be lost.
  - Added the required column `price` to the `dt_order_item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unit_price` to the `dt_order_item` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "dt_order_item" DROP COLUMN "total_amount",
ADD COLUMN     "price" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "unit_price" DECIMAL(10,2) NOT NULL;
