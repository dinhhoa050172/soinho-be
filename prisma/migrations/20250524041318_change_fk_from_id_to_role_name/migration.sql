/*
  Warnings:

  - You are about to drop the column `role_id` on the `dt_user` table. All the data in the column will be lost.
  - Added the required column `role_name` to the `dt_user` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "dt_user" DROP CONSTRAINT "dt_user_role_id_fkey";

-- AlterTable
ALTER TABLE "dt_user" DROP COLUMN "role_id",
ADD COLUMN     "role_name" VARCHAR(50) NOT NULL,
ALTER COLUMN "is_active" SET DEFAULT true;

-- AddForeignKey
ALTER TABLE "dt_user" ADD CONSTRAINT "dt_user_role_name_fkey" FOREIGN KEY ("role_name") REFERENCES "dt_role"("role_name") ON DELETE RESTRICT ON UPDATE CASCADE;
