-- CreateTable
CREATE TABLE "Product" (
    "id_product" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id_product")
);

-- CreateTable
CREATE TABLE "Client" (
    "id_client" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id_client")
);

-- CreateTable
CREATE TABLE "Order" (
    "id_order" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_client" TEXT NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id_order")
);

-- CreateTable
CREATE TABLE "OrderItem" (
    "id_order_item" TEXT NOT NULL,
    "id_order" TEXT NOT NULL,
    "id_product" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id_order_item")
);

-- CreateIndex
CREATE UNIQUE INDEX "Product_name_key" ON "Product"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Client_email_key" ON "Client"("email");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_id_client_fkey" FOREIGN KEY ("id_client") REFERENCES "Client"("id_client") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_id_order_fkey" FOREIGN KEY ("id_order") REFERENCES "Order"("id_order") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_id_product_fkey" FOREIGN KEY ("id_product") REFERENCES "Product"("id_product") ON DELETE RESTRICT ON UPDATE CASCADE;
