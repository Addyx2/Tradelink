import { ComplianceStatus, ShipmentStatus, TelemetryStatus } from "@/lib/types";

export function StatusBadge({ status }: { status: ComplianceStatus | ShipmentStatus | TelemetryStatus | string }) {
  const className =
    status === "ready" || status === "healthy" || status === "delivered"
      ? "badge-success"
      : status === "review" || status === "warning" || status === "at_port" || status === "in_transit"
        ? "badge-warning"
        : status === "blocked" || status === "critical" || status === "customs_hold"
          ? "badge-danger"
          : "badge-neutral";

  return <span className={className}>{status.replaceAll("_", " ")}</span>;
}
