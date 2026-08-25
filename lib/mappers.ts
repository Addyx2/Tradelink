import type {
  Batch,
  BatchWithSupplier,
  ComplianceStatus,
  DashboardMetrics,
  EbdlRecord,
  EbdlStatus,
  ForestRisk,
  Shipment,
  ShipmentDetails,
  ShipmentStatus,
  Supplier,
  TelemetryEvent,
  TelemetryStatus,
} from "@/lib/types";

type PrismaBatch = {
  externalId: string;
  commodity: string;
  volume: string;
  originCountry: string;
  coordinates: string;
  evidenceComplete: number;
  forestRisk: string;
  complianceStatus: string;
  supplier: {
    externalId: string;
    name: string;
    country: string;
    trustScore: number;
    activeBatches: number;
    compliancePassRate: number;
    incidents: number;
  } | null;
};

type PrismaTelemetryEvent = {
  externalId: string;
  timestamp: Date;
  location: string;
  temperatureC: number;
  humidity: number;
  status: string;
  note: string;
};

type PrismaShipment = {
  externalId: string;
  route: string;
  origin: string;
  destination: string;
  eta: Date;
  status: string;
  carrier: string;
  vehicle: string;
  telemetryHealth: number;
  riskScore: number;
  alerts: Array<{ message: string }>;
  shipmentBatches: Array<{ batch: PrismaBatch }>;
  ebdlRecord: {
    externalId: string;
    issueDate: Date;
    version: string;
    shipper: string;
    consignee: string;
    carrier: string;
    cargo: string;
    status: string;
  } | null;
  telemetryEvents: PrismaTelemetryEvent[];
};

type PrismaSupplier = {
  externalId: string;
  name: string;
  country: string;
  trustScore: number;
  activeBatches: number;
  compliancePassRate: number;
  incidents: number;
};

type PrismaDocument = {
  externalId: string;
  issueDate: Date;
  version: string;
  shipper: string;
  consignee: string;
  carrier: string;
  cargo: string;
  status: string;
};

function normalizeEnum<T extends string>(value: string): T {
  return value.toLowerCase() as T;
}

function formatDateTime(value: Date): string {
  return value.toISOString().replace("T", " ").replace(".000Z", " UTC");
}

function formatDate(value: Date): string {
  return value.toISOString().slice(0, 10);
}

export function mapSupplierRecord(record: PrismaSupplier): Supplier {
  return {
    id: record.externalId,
    name: record.name,
    country: record.country,
    trustScore: record.trustScore,
    activeBatches: record.activeBatches,
    compliancePassRate: record.compliancePassRate,
    incidents: record.incidents,
  };
}

export function mapBatchRecord(record: PrismaBatch): BatchWithSupplier {
  return {
    id: record.externalId,
    commodity: record.commodity,
    volume: record.volume,
    supplierId: record.supplier?.externalId ?? "",
    originCountry: record.originCountry,
    forestRisk: normalizeEnum<ForestRisk>(record.forestRisk),
    complianceStatus: normalizeEnum<ComplianceStatus>(record.complianceStatus),
    evidenceComplete: record.evidenceComplete,
    coordinates: record.coordinates,
    supplier: record.supplier ? mapSupplierRecord(record.supplier) : null,
  };
}

export function mapTelemetryRecord(record: PrismaTelemetryEvent): TelemetryEvent {
  return {
    id: record.externalId,
    timestamp: formatDateTime(record.timestamp),
    location: record.location,
    temperatureC: record.temperatureC,
    humidity: record.humidity,
    status: normalizeEnum<TelemetryStatus>(record.status),
    note: record.note,
  };
}

export function mapDocumentRecord(record: PrismaDocument): EbdlRecord {
  return {
    id: record.externalId,
    issueDate: formatDate(record.issueDate),
    version: record.version,
    shipper: record.shipper,
    consignee: record.consignee,
    carrier: record.carrier,
    cargo: record.cargo,
    status: normalizeEnum<EbdlStatus>(record.status),
  };
}

export function mapShipmentRecord(record: PrismaShipment): Shipment {
  return {
    id: record.externalId,
    route: record.route,
    origin: record.origin,
    destination: record.destination,
    eta: formatDateTime(record.eta),
    status: normalizeEnum<ShipmentStatus>(record.status),
    carrier: record.carrier,
    vehicle: record.vehicle,
    telemetryHealth: record.telemetryHealth,
    riskScore: record.riskScore,
    batchIds: record.shipmentBatches.map(({ batch }) => batch.externalId),
    ebdlId: record.ebdlRecord?.externalId ?? "",
    alerts: record.alerts.map((alert) => alert.message),
    telemetry: record.telemetryEvents.map(mapTelemetryRecord),
  };
}

export function mapShipmentDetailsRecord(record: PrismaShipment): ShipmentDetails {
  return {
    ...mapShipmentRecord(record),
    ebdl: record.ebdlRecord ? mapDocumentRecord(record.ebdlRecord) : null,
    batches: record.shipmentBatches.map(({ batch }) => mapBatchRecord(batch)),
  };
}

export function calculateDashboardMetrics(shipmentRows: Shipment[], batchRows: Batch[]): DashboardMetrics {
  const activeShipments = shipmentRows.length;
  const eudrReadyRate = batchRows.length
    ? Math.round((batchRows.filter((batch) => batch.complianceStatus === "ready").length / batchRows.length) * 100)
    : 0;
  const telemetryHealthyRate = activeShipments
    ? Math.round(shipmentRows.reduce((total, shipment) => total + shipment.telemetryHealth, 0) / activeShipments)
    : 0;
  const atRiskShipments = shipmentRows.filter((shipment) => shipment.riskScore >= 40 || shipment.status === "customs_hold").length;
  const evidenceCompletionRate = batchRows.length
    ? Math.round(batchRows.reduce((total, batch) => total + batch.evidenceComplete, 0) / batchRows.length)
    : 0;

  return {
    activeShipments,
    eudrReadyRate,
    telemetryHealthyRate,
    atRiskShipments,
    evidenceCompletionRate,
  };
}
