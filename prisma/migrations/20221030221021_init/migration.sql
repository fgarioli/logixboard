-- CreateTable
CREATE TABLE "shipment" (
    "referenceId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "estimatedTimeArrival" TEXT,

    CONSTRAINT "shipment_pkey" PRIMARY KEY ("referenceId")
);

-- CreateTable
CREATE TABLE "shipment_organization" (
    "shipmentId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,

    CONSTRAINT "shipment_organization_pkey" PRIMARY KEY ("shipmentId","organizationId")
);

-- CreateTable
CREATE TABLE "organization" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "code" TEXT NOT NULL,

    CONSTRAINT "organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transport_pack" (
    "id" SERIAL NOT NULL,
    "shipmentId" TEXT NOT NULL,
    "weight" TEXT NOT NULL,
    "unit" TEXT NOT NULL,

    CONSTRAINT "transport_pack_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "organization_code_key" ON "organization"("code");

-- AddForeignKey
ALTER TABLE "shipment_organization" ADD CONSTRAINT "shipment_organization_shipmentId_fkey" FOREIGN KEY ("shipmentId") REFERENCES "shipment"("referenceId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipment_organization" ADD CONSTRAINT "shipment_organization_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transport_pack" ADD CONSTRAINT "transport_pack_shipmentId_fkey" FOREIGN KEY ("shipmentId") REFERENCES "shipment"("referenceId") ON DELETE RESTRICT ON UPDATE CASCADE;
