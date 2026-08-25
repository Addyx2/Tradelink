import { DashboardShell } from "@/components/dashboard-shell";
import { SectionHeader } from "@/components/section-header";
import { ShipmentCard } from "@/components/shipment-card";
import { requireRole } from "@/lib/auth";
import { roleAccess } from "@/lib/access";
import { getDashboardShipmentsForRole } from "@/lib/role-config";
import { listShipments } from "@/lib/queries";

export default async function ShipmentsPage({ searchParams }: { searchParams?: { role?: string } }) {
  const user = await requireRole(roleAccess.shipments, searchParams?.role);
  const shipments = getDashboardShipmentsForRole(user, await listShipments());

  return (
    <DashboardShell user={user}>
      <div>
        <SectionHeader
          eyebrow="Operations"
          title="Shipment fleet visibility"
          description="Monitor active lanes, identify cargo at risk, and drill into telemetry or document readiness for every shipment."
        />
        <div className="space-y-4">
          {shipments.map((shipment) => (
            <ShipmentCard key={shipment.id} shipment={shipment} role={user.role} />
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
