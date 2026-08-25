import type { UserRole } from "@/lib/types";

export const roleAccess = {
  dashboard: ["trademaster", "trade_officer_compliance", "trade_officer_inspection", "supplier", "client"],
  shipments: ["trademaster", "trade_officer_compliance", "trade_officer_inspection", "client"],
  shipmentDetail: ["trademaster", "trade_officer_compliance", "trade_officer_inspection", "client"],
  batches: ["trademaster", "trade_officer_compliance", "trade_officer_inspection", "supplier"],
  documents: ["trademaster", "trade_officer_compliance", "client"],
  suppliers: ["trademaster", "trade_officer_compliance", "trade_officer_inspection"],
  copilot: ["trademaster", "trade_officer_compliance", "trade_officer_inspection", "supplier", "client"],
} satisfies Record<string, UserRole[]>;
