/*
  Warnings:

  - You are about to drop the `_ProductCustomMaterial` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ProductCustomMaterial" DROP CONSTRAINT "_ProductCustomMaterial_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProductCustomMaterial" DROP CONSTRAINT "_ProductCustomMaterial_B_fkey";

-- DropTable
DROP TABLE "_ProductCustomMaterial";

-- CreateTable
CREATE TABLE "dt_product_custom_material" (
    "product_custom_id" BIGINT NOT NULL,
    "material_id" BIGINT NOT NULL,

    CONSTRAINT "dt_product_custom_material_pkey" PRIMARY KEY ("product_custom_id","material_id")
);

-- AddForeignKey
ALTER TABLE "dt_product_custom_material" ADD CONSTRAINT "dt_product_custom_material_product_custom_id_fkey" FOREIGN KEY ("product_custom_id") REFERENCES "dt_product_custom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dt_product_custom_material" ADD CONSTRAINT "dt_product_custom_material_material_id_fkey" FOREIGN KEY ("material_id") REFERENCES "bs_material"("id") ON DELETE CASCADE ON UPDATE CASCADE;
