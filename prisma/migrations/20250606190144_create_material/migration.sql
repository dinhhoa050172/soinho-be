-- CreateTable
CREATE TABLE "bs_material" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "unit" VARCHAR(100) NOT NULL,
    "stock_qty" INTEGER NOT NULL DEFAULT 0,
    "threshold_qty" INTEGER NOT NULL DEFAULT 10,
    "price" DECIMAL(10,2),
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "created_date" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by" VARCHAR(36) NOT NULL,
    "modified_date" TIMESTAMPTZ(3),
    "modified_by" VARCHAR(36),

    CONSTRAINT "bs_material_pkey" PRIMARY KEY ("id")
);
