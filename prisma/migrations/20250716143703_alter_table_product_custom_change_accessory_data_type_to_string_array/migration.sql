/*
  Warnings:

  - The `accessory` column on the `dt_product_custom` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "dt_product_custom" DROP COLUMN "accessory",
ADD COLUMN     "accessory" TEXT[];
