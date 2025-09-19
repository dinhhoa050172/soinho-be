/*
  Warnings:

  - Added the required column `created_by` to the `bs_cart` table without a default value. This is not possible if the table is not empty.
  - Added the required column `created_by` to the `bs_cart_item` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "bs_cart" ADD COLUMN     "created_by" VARCHAR(36) NOT NULL,
ADD COLUMN     "modified_by" VARCHAR(36),
ALTER COLUMN "created_date" DROP NOT NULL,
ALTER COLUMN "modified_date" DROP NOT NULL;

-- AlterTable
ALTER TABLE "bs_cart_item" ADD COLUMN     "created_by" VARCHAR(36) NOT NULL,
ADD COLUMN     "modified_by" VARCHAR(36),
ALTER COLUMN "created_date" DROP NOT NULL,
ALTER COLUMN "modified_date" DROP NOT NULL;
