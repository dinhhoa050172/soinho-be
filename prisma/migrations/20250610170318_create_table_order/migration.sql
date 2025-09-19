-- CreateEnum
CREATE TYPE "StatusOrder" AS ENUM ('PENDING', 'COMPLETED', 'CANCELLED', 'REFUNDED', 'DELIVERED');

-- CreateTable
CREATE TABLE "dt_order" (
    "id" BIGSERIAL NOT NULL,
    "total_amount" DECIMAL(10,2) NOT NULL,
    "status" "StatusOrder" NOT NULL DEFAULT 'PENDING',
    "user_id" BIGINT NOT NULL,
    "payment_id" BIGINT NOT NULL,
    "shipping_id" BIGINT NOT NULL,
    "address_id" BIGINT NOT NULL,
    "created_date" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by" VARCHAR(36) NOT NULL,
    "modified_date" TIMESTAMPTZ(3),
    "modified_by" VARCHAR(36),

    CONSTRAINT "dt_order_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "dt_order" ADD CONSTRAINT "dt_order_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "dt_user"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;
