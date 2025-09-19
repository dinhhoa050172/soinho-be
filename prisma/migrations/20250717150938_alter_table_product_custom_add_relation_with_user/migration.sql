/*
  Warnings:

  - Added the required column `user_id` to the `dt_product_custom` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "dt_product_custom" ADD COLUMN     "user_id" BIGINT NOT NULL;

-- AddForeignKey
ALTER TABLE "dt_product_custom" ADD CONSTRAINT "dt_product_custom_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "dt_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
