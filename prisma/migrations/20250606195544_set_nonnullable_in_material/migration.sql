/*
  Warnings:

  - Made the column `threshold_qty` on table `bs_material` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "bs_material" ALTER COLUMN "threshold_qty" SET NOT NULL;
