-- CreateTable
CREATE TABLE "dt_category" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "desc" VARCHAR(100),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_date" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by" VARCHAR(36) NOT NULL,
    "modified_date" TIMESTAMPTZ(3),
    "modified_by" VARCHAR(36),

    CONSTRAINT "dt_category_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "dt_category_name_key" ON "dt_category"("name");
