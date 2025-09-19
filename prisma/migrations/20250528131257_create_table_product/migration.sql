-- CreateTable
CREATE TABLE "bs_product" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(255),
    "price" DECIMAL(10,3),
    "height" DECIMAL(10,3),
    "width" DECIMAL(10,3),
    "length" DECIMAL(10,3),
    "stock_qty" INTEGER,
    "description" TEXT,
    "category_id" BIGINT,
    "material_id" BIGINT,
    "created_date" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by" VARCHAR(36) NOT NULL,
    "modified_date" TIMESTAMPTZ(3),
    "modified_by" VARCHAR(36),

    CONSTRAINT "bs_product_pkey" PRIMARY KEY ("id")
);
