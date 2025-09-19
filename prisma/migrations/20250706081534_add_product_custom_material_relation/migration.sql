/*
  Warnings:

  - You are about to drop the column `material_id` on the `dt_product_custom` table. All the data in the column will be lost.
  - You are about to drop the `_MaterialToProductCustom` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_MaterialToProductCustom" DROP CONSTRAINT "_MaterialToProductCustom_A_fkey";

-- DropForeignKey
ALTER TABLE "_MaterialToProductCustom" DROP CONSTRAINT "_MaterialToProductCustom_B_fkey";

-- AlterTable
ALTER TABLE "dt_product_custom" DROP COLUMN "material_id";

-- DropTable
DROP TABLE "_MaterialToProductCustom";

-- CreateTable
CREATE TABLE "_ProductCustomMaterial" (
    "A" BIGINT NOT NULL,
    "B" BIGINT NOT NULL,

    CONSTRAINT "_ProductCustomMaterial_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ProductCustomMaterial_B_index" ON "_ProductCustomMaterial"("B");

-- AddForeignKey
ALTER TABLE "_ProductCustomMaterial" ADD CONSTRAINT "_ProductCustomMaterial_A_fkey" FOREIGN KEY ("A") REFERENCES "bs_material"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductCustomMaterial" ADD CONSTRAINT "_ProductCustomMaterial_B_fkey" FOREIGN KEY ("B") REFERENCES "dt_product_custom"("id") ON DELETE CASCADE ON UPDATE CASCADE;
