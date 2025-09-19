-- CreateTable
CREATE TABLE "dt_product_image" (
    "id" BIGSERIAL NOT NULL,
    "image_url" TEXT NOT NULL,
    "is_thumbnail" BOOLEAN NOT NULL,
    "product_id" BIGINT NOT NULL,
    "created_date" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by" VARCHAR(36) NOT NULL,
    "modified_date" TIMESTAMPTZ(3),
    "modified_by" VARCHAR(36),

    CONSTRAINT "dt_product_image_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "dt_product_image" ADD CONSTRAINT "dt_product_image_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "bs_product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
