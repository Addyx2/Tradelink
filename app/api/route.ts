import { NextResponse } from "next/server";
import { listDashboardMetrics } from "@/lib/queries";

export async function GET() {
  return NextResponse.json({
    product: "Tradelink",
    metrics: await listDashboardMetrics(),
    endpoints: ["/api/shipments", "/api/shipments/[id]", "/api/batches", "/api/documents", "/api/suppliers"],
  });
}
