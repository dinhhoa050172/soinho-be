/*
  Warnings:

  - A unique constraint covering the columns `[user_id,full_name,phone,street,ward,district,province,country,postal_code]` on the table `dt_address` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "dt_address_user_id_full_name_phone_street_ward_district_pro_key" ON "dt_address"("user_id", "full_name", "phone", "street", "ward", "district", "province", "country", "postal_code");
