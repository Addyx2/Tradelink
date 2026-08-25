import { Prisma } from "@prisma/client";
import { batches, ebdlRecords, getBatchById, getEbdlById, getShipmentById, getSupplierById, metrics, shipments, suppliers } from "@/lib/data";
import { calculateDashboardMetrics, mapBatchRecord, mapDocumentRecord, mapShipmentDetailsRecord, mapShipmentRecord, mapSupplierRecord } from "@/lib/mappers";
import { prisma } from "@/lib/prisma";
import type { Batch, BatchWithSupplier, DashboardMetrics, EbdlRecord, Shipment, ShipmentDetails, Supplier } from "@/lib/types";

const shipmentInclude = {
  alerts: { orderBy: { createdAt: "desc" as const } },
  ebdlRecord: true,
  telemetryEvents: { orderBy: { timestamp: "desc" as const } },
  shipmentBatches: {
    include: {
      batch: {
        include: {
          supplier: true,
        },
      },
    },
  },
} satisfies Prisma.ShipmentInclude;

function listShipmentsFromMock(): Shipment[] {
  return shipments;
}

function getShipmentDetailsFromMock(id: string): ShipmentDetails | null {
  const shipment = getShipmentById(id);

  if (!shipment) {
    return null;
  }

  const linkedBatches = shipment.batchIds
    .map((batchId) => getBatchById(batchId))
    .filter((batch): batch is NonNullable<typeof batch> => Boolean(batch))
    .map((batch) => ({
      ...batch,
      supplier: getSupplierById(batch.supplierId) ?? null,
    }));

  return {
    ...shipment,
    ebdl: getEbdlById(shipment.ebdlId) ?? null,
    batches: linkedBatches,
  };
}

function listBatchesFromMock(): BatchWithSupplier[] {
  return batches.map((batch) => ({
    ...batch,
    supplier: getSupplierById(batch.supplierId) ?? null,
  }));
}

function listDocumentsFromMock(): EbdlRecord[] {
  return ebdlRecords;
}

function listSuppliersFromMock(): Supplier[] {
  return suppliers;
}

function listDashboardMetricsFromMock(): DashboardMetrics {
  return metrics;
}

function isPrismaUnavailable(error: unknown) {
  return error instanceof Error;
}

export async function listShipments(): Promise<Shipment[]> {
  try {
    const rows = await prisma.shipment.findMany({
      orderBy: { eta: "asc" },
      include: shipmentInclude,
    });

    return rows.map(mapShipmentRecord);
  } catch (error) {
    if (isPrismaUnavailable(error)) {
      return listShipmentsFromMock();
    }

    throw error;
  }
}

export async function getShipmentDetails(id: string): Promise<ShipmentDetails | null> {
  try {
    const row = await prisma.shipment.findFirst({
      where: { externalId: id },
      include: shipmentInclude,
    });

    return row ? mapShipmentDetailsRecord(row) : null;
  } catch (error) {
    if (isPrismaUnavailable(error)) {
      return getShipmentDetailsFromMock(id);
    }

    throw error;
  }
}

export async function listBatches(): Promise<BatchWithSupplier[]> {
  try {
    const rows = await prisma.batch.findMany({
      orderBy: { externalId: "asc" },
      include: { supplier: true },
    });

    return rows.map(mapBatchRecord);
  } catch (error) {
    if (isPrismaUnavailable(error)) {
      return listBatchesFromMock();
    }

    throw error;
  }
}

export async function listDocuments(): Promise<EbdlRecord[]> {
  try {
    const rows = await prisma.ebdlRecord.findMany({
      orderBy: { issueDate: "desc" },
    });

    return rows.map(mapDocumentRecord);
  } catch (error) {
    if (isPrismaUnavailable(error)) {
      return listDocumentsFromMock();
    }

    throw error;
  }
}

export async function listSuppliers(): Promise<Supplier[]> {
  try {
    const rows = await prisma.supplier.findMany({
      orderBy: { name: "asc" },
    });

    return rows.map(mapSupplierRecord);
  } catch (error) {
    if (isPrismaUnavailable(error)) {
      return listSuppliersFromMock();
    }

    throw error;
  }
}

export async function listDashboardMetrics(): Promise<DashboardMetrics> {
  try {
    const [shipmentRows, batchRows] = await Promise.all([listShipments(), listBatches()]);
    return calculateDashboardMetrics(shipmentRows, batchRows as Batch[]);
  } catch (error) {
    if (isPrismaUnavailable(error)) {
      return listDashboardMetricsFromMock();
    }

    throw error;
  }
}
