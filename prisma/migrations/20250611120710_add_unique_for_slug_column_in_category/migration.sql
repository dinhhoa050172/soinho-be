/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `dt_category` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "dt_category" ALTER COLUMN "slug" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "dt_category_slug_key" ON "dt_category"("slug");
