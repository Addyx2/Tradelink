export type TelemetryStatus = "healthy" | "warning" | "critical";
export type ComplianceStatus = "ready" | "review" | "blocked";
export type ShipmentStatus = "in_transit" | "at_port" | "customs_hold" | "delivered";
export type EbdlStatus = "issued" | "amended" | "awaiting_release";
export type ForestRisk = "low" | "medium" | "high";
export type UserRole = "trademaster" | "trade_officer_compliance" | "trade_officer_inspection" | "supplier" | "client";

export interface TelemetryEvent {
  id: string;
  timestamp: string;
  location: string;
  temperatureC: number;
  humidity: number;
  status: TelemetryStatus;
  note: string;
}

export interface Batch {
  id: string;
  commodity: string;
  volume: string;
  supplierId: string;
  originCountry: string;
  forestRisk: ForestRisk;
  complianceStatus: ComplianceStatus;
  evidenceComplete: number;
  coordinates: string;
}

export interface EbdlRecord {
  id: string;
  issueDate: string;
  version: string;
  shipper: string;
  consignee: string;
  carrier: string;
  cargo: string;
  status: EbdlStatus;
}

export interface Shipment {
  id: string;
  route: string;
  origin: string;
  destination: string;
  eta: string;
  status: ShipmentStatus;
  carrier: string;
  vehicle: string;
  telemetryHealth: number;
  riskScore: number;
  batchIds: string[];
  ebdlId: string;
  alerts: string[];
  telemetry: TelemetryEvent[];
}

export interface Supplier {
  id: string;
  name: string;
  country: string;
  trustScore: number;
  activeBatches: number;
  compliancePassRate: number;
  incidents: number;
}

export interface BatchWithSupplier extends Batch {
  supplier: Supplier | null;
}

export interface ShipmentDetails extends Shipment {
  ebdl: EbdlRecord | null;
  batches: BatchWithSupplier[];
}

export interface DashboardMetrics {
  activeShipments: number;
  eudrReadyRate: number;
  telemetryHealthyRate: number;
  atRiskShipments: number;
  evidenceCompletionRate: number;
}
