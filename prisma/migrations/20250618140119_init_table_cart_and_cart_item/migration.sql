-- CreateTable
CREATE TABLE "bs_cart" (
    "id" BIGSERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "created_date" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_date" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "bs_cart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bs_cart_item" (
    "id" BIGSERIAL NOT NULL,
    "cart_id" BIGINT NOT NULL,
    "product_id" BIGINT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "price" DECIMAL(10,3) NOT NULL,
    "created_date" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_date" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "bs_cart_item_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "bs_cart_user_id_key" ON "bs_cart"("user_id");

-- AddForeignKey
ALTER TABLE "bs_cart" ADD CONSTRAINT "bs_cart_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "dt_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bs_cart_item" ADD CONSTRAINT "bs_cart_item_cart_id_fkey" FOREIGN KEY ("cart_id") REFERENCES "bs_cart"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bs_cart_item" ADD CONSTRAINT "bs_cart_item_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "bs_product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
