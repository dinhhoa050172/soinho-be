-- AddForeignKey
ALTER TABLE "bs_product" ADD CONSTRAINT "bs_product_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "dt_category"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "bs_product" ADD CONSTRAINT "bs_product_material_id_fkey" FOREIGN KEY ("material_id") REFERENCES "bs_material"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
