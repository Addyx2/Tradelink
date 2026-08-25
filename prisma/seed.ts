import { PrismaClient, ComplianceStatus, EbdlStatus, ForestRisk, ShipmentStatus, TelemetryStatus, UserRole } from "@prisma/client";
import { batches, ebdlRecords, shipments, suppliers } from "@/lib/data";

const prisma = new PrismaClient();

async function main() {
  await prisma.telemetryEvent.deleteMany();
  await prisma.shipmentAlert.deleteMany();
  await prisma.shipmentBatch.deleteMany();
  await prisma.incident.deleteMany();
  await prisma.shipment.deleteMany();
  await prisma.batch.deleteMany();
  await prisma.ebdlRecord.deleteMany();
  await prisma.supplier.deleteMany();
  await prisma.user.deleteMany();
  await prisma.organization.deleteMany();

  const organization = await prisma.organization.create({
    data: {
      name: "Giants.earth",
      slug: "giants-earth",
    },
  });

  await prisma.user.createMany({
    data: [
      {
        name: "Ama Mensah",
        email: "ama@giants.earth",
        role: UserRole.TRADEMASTER,
        organizationId: organization.id,
      },
      {
        name: "Jonas Ritter",
        email: "jonas@giants.earth",
        role: UserRole.TRADE_OFFICER_COMPLIANCE,
        organizationId: organization.id,
      },
      {
        name: "Nadia Okoro",
        email: "nadia@giants.earth",
        role: UserRole.TRADE_OFFICER_INSPECTION,
        organizationId: organization.id,
      },
      {
        name: "Kojo Supplier",
        email: "kojo@atlasagro.example",
        role: UserRole.SUPPLIER,
        organizationId: organization.id,
      },
      {
        name: "Elena Fischer",
        email: "elena@northatlanticfoods.example",
        role: UserRole.CLIENT,
        organizationId: organization.id,
      },
    ],
  });

  const supplierMap = new Map<string, string>();
  for (const supplier of suppliers) {
    const created = await prisma.supplier.create({
      data: {
        externalId: supplier.id,
        name: supplier.name,
        country: supplier.country,
        trustScore: supplier.trustScore,
        activeBatches: supplier.activeBatches,
        compliancePassRate: supplier.compliancePassRate,
        incidents: supplier.incidents,
        organizationId: organization.id,
      },
    });

    supplierMap.set(supplier.id, created.id);
  }

  const batchMap = new Map<string, string>();
  for (const batch of batches) {
    const created = await prisma.batch.create({
      data: {
        externalId: batch.id,
        commodity: batch.commodity,
        volume: batch.volume,
        originCountry: batch.originCountry,
        forestRisk: batch.forestRisk.toUpperCase() as ForestRisk,
        coordinates: batch.coordinates,
        evidenceComplete: batch.evidenceComplete,
        complianceStatus: batch.complianceStatus.toUpperCase() as ComplianceStatus,
        organizationId: organization.id,
        supplierId: supplierMap.get(batch.supplierId)!,
      },
    });

    batchMap.set(batch.id, created.id);
  }

  const documentMap = new Map<string, string>();
  for (const record of ebdlRecords) {
    const created = await prisma.ebdlRecord.create({
      data: {
        externalId: record.id,
        issueDate: new Date(record.issueDate),
        version: record.version,
        shipper: record.shipper,
        consignee: record.consignee,
        carrier: record.carrier,
        cargo: record.cargo,
        status: record.status.toUpperCase() as EbdlStatus,
        organizationId: organization.id,
      },
    });

    documentMap.set(record.id, created.id);
  }

  for (const shipment of shipments) {
    const createdShipment = await prisma.shipment.create({
      data: {
        externalId: shipment.id,
        route: shipment.route,
        origin: shipment.origin,
        destination: shipment.destination,
        eta: new Date(shipment.eta.replace(" UTC", "Z").replace(" ", "T")),
        status: shipment.status.toUpperCase() as ShipmentStatus,
        carrier: shipment.carrier,
        vehicle: shipment.vehicle,
        telemetryHealth: shipment.telemetryHealth,
        riskScore: shipment.riskScore,
        organizationId: organization.id,
        ebdlRecordId: documentMap.get(shipment.ebdlId),
      },
    });

    await prisma.shipmentAlert.createMany({
      data: shipment.alerts.map((message) => ({
        shipmentId: createdShipment.id,
        message,
      })),
    });

    await prisma.telemetryEvent.createMany({
      data: shipment.telemetry.map((event) => ({
        externalId: event.id,
        shipmentId: createdShipment.id,
        timestamp: new Date(event.timestamp.replace(" UTC", "Z").replace(" ", "T")),
        location: event.location,
        temperatureC: event.temperatureC,
        humidity: event.humidity,
        status: event.status.toUpperCase() as TelemetryStatus,
        note: event.note,
      })),
    });

    await prisma.shipmentBatch.createMany({
      data: shipment.batchIds.map((batchId) => ({
        shipmentId: createdShipment.id,
        batchId: batchMap.get(batchId)!,
      })),
    });
  }

  await prisma.incident.createMany({
    data: [
      {
        title: "Humidity anomaly review",
        severity: "medium",
        status: "open",
        organizationId: organization.id,
      },
      {
        title: "Blocked batch due diligence",
        severity: "high",
        status: "in_review",
        organizationId: organization.id,
      },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
