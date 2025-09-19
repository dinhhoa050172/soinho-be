/*
  Warnings:

  - The `status` column on the `dt_transaction` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `order_id` to the `dt_transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "dt_transaction" ADD COLUMN     "order_id" BIGINT NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "StatusTransaction" NOT NULL DEFAULT 'PENDING';
