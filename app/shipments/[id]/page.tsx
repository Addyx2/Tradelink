import { RoleLink } from "@/components/role-query-links";
import { DashboardShell } from "@/components/dashboard-shell";
import { SectionHeader } from "@/components/section-header";
import { StatusBadge } from "@/components/status-badge";
import { requireRole } from "@/lib/auth";
import { roleAccess } from "@/lib/access";
import { getDashboardBatchesForRole, getDashboardShipmentsForRole } from "@/lib/role-config";
import { getShipmentDetails } from "@/lib/queries";
import { notFound } from "next/navigation";

export default async function ShipmentDetailPage({ params, searchParams }: { params: { id: string }; searchParams?: { role?: string } }) {
  const user = await requireRole(roleAccess.shipmentDetail, searchParams?.role);
  const shipment = await getShipmentDetails(params.id);

  if (!shipment) {
    notFound();
  }

  const visibleShipments = getDashboardShipmentsForRole(user, [shipment]);
  const visibleShipment = visibleShipments[0];

  if (!visibleShipment) {
    notFound();
  }

  const batches = getDashboardBatchesForRole(user, shipment.batches);
  const ebdl = user.role === "trade_officer_inspection" ? null : shipment.ebdl;

  return (
    <DashboardShell user={user}>
      <div className="space-y-8">
        <SectionHeader
          eyebrow="Shipment detail"
          title={`${shipment.id} · ${shipment.route}`}
          description="Digital twin view of route integrity, batch readiness, and eBDL state for a single shipment."
        />

        <section className="grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
          <div className="space-y-6">
            <div className="card p-6">
              <div className="flex flex-wrap items-center gap-3">
                <StatusBadge status={shipment.status} />
                <span className="badge-neutral">Telemetry health {shipment.telemetryHealth}%</span>
                <span className="badge-neutral">Risk score {shipment.riskScore}/100</span>
              </div>
              <dl className="mt-5 grid gap-4 md:grid-cols-2">
                <div>
                  <dt className="text-sm text-slate-500">Origin</dt>
                  <dd className="mt-1 font-medium text-slate-950">{shipment.origin}</dd>
                </div>
                <div>
                  <dt className="text-sm text-slate-500">Destination</dt>
                  <dd className="mt-1 font-medium text-slate-950">{shipment.destination}</dd>
                </div>
                <div>
                  <dt className="text-sm text-slate-500">Carrier</dt>
                  <dd className="mt-1 font-medium text-slate-950">{shipment.carrier}</dd>
                </div>
                <div>
                  <dt className="text-sm text-slate-500">Vehicle</dt>
                  <dd className="mt-1 font-medium text-slate-950">{shipment.vehicle}</dd>
                </div>
                <div>
                  <dt className="text-sm text-slate-500">ETA</dt>
                  <dd className="mt-1 font-medium text-slate-950">{shipment.eta}</dd>
                </div>
                <div>
                  <dt className="text-sm text-slate-500">Active alerts</dt>
                  <dd className="mt-1 font-medium text-slate-950">{shipment.alerts.length}</dd>
                </div>
              </dl>
            </div>

            <div className="card p-6">
              <h3 className="text-lg font-semibold text-slate-950">Telemetry timeline</h3>
              <div className="mt-5 space-y-4">
                {shipment.telemetry.map((event) => (
                  <div key={event.id} className="rounded-2xl border border-slate-200 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="font-medium text-slate-950">{event.location}</p>
                        <p className="text-sm text-slate-500">{event.timestamp}</p>
                      </div>
                      <StatusBadge status={event.status} />
                    </div>
                    <div className="mt-3 grid gap-3 text-sm md:grid-cols-3">
                      <p className="text-slate-600">Temperature <span className="font-medium text-slate-950">{event.temperatureC}°C</span></p>
                      <p className="text-slate-600">Humidity <span className="font-medium text-slate-950">{event.humidity}%</span></p>
                      <p className="text-slate-600">Note <span className="font-medium text-slate-950">{event.note}</span></p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-slate-950">Linked batches</h3>
              <div className="mt-4 space-y-4">
                {batches.map((batch) => {
                  const supplier = batch.supplier;
                  return (
                    <div key={batch.id} className="rounded-2xl border border-slate-200 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-medium text-slate-950">{batch.id}</p>
                        <StatusBadge status={batch.complianceStatus} />
                      </div>
                      <p className="mt-2 text-sm text-slate-600">{batch.commodity} · {batch.volume}</p>
                      <p className="mt-1 text-sm text-slate-600">Origin {batch.originCountry} · Forest risk {batch.forestRisk}</p>
                      <p className="mt-1 text-sm text-slate-600">Supplier {supplier?.name ?? "Unknown"}</p>
                      <p className="mt-1 text-sm text-slate-600">Evidence completion {batch.evidenceComplete}%</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {ebdl ? (
              <div className="card p-6">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-lg font-semibold text-slate-950">eBDL record</h3>
                  <RoleLink href="/documents" role={user.role} className="text-sm font-medium text-ocean hover:text-sky-900">Open documents</RoleLink>
                </div>
                <dl className="mt-4 space-y-3 text-sm">
                  <div className="flex justify-between gap-4"><dt className="text-slate-500">Document</dt><dd className="font-medium text-slate-950">{ebdl.id}</dd></div>
                  <div className="flex justify-between gap-4"><dt className="text-slate-500">Version</dt><dd className="font-medium text-slate-950">{ebdl.version}</dd></div>
                  <div className="flex justify-between gap-4"><dt className="text-slate-500">Status</dt><dd><StatusBadge status={ebdl.status} /></dd></div>
                  <div className="flex justify-between gap-4"><dt className="text-slate-500">Cargo</dt><dd className="font-medium text-slate-950">{ebdl.cargo}</dd></div>
                </dl>
              </div>
            ) : null}

            <div className="card p-6">
              <h3 className="text-lg font-semibold text-slate-950">Action queue</h3>
              <ul className="mt-4 space-y-3 text-sm text-slate-600">
                {shipment.alerts.map((alert) => (
                  <li key={alert}>{alert}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}
