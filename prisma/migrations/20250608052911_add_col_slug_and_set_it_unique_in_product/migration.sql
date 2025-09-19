/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `bs_product` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `bs_product` table without a default value. This is not possible if the table is not empty.
  - Made the column `name` on table `bs_product` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "bs_product" ADD COLUMN     "slug" VARCHAR(255) NOT NULL,
ALTER COLUMN "name" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "bs_product_slug_key" ON "bs_product"("slug");
