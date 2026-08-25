import { RoleLink } from "@/components/role-query-links";
import { StatusBadge } from "@/components/status-badge";
import type { Shipment, UserRole } from "@/lib/types";

export function ShipmentCard({ shipment, role }: { shipment: Shipment; role: UserRole }) {
  return (
    <div className="card p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold text-slate-950">{shipment.id}</h3>
            <StatusBadge status={shipment.status} />
          </div>
          <p className="mt-2 text-sm text-slate-600">{shipment.route}</p>
          <p className="mt-1 text-sm text-slate-500">{shipment.carrier} · {shipment.vehicle}</p>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm md:min-w-[260px]">
          <div>
            <p className="text-slate-500">Telemetry health</p>
            <p className="mt-1 font-semibold text-slate-950">{shipment.telemetryHealth}%</p>
          </div>
          <div>
            <p className="text-slate-500">Risk score</p>
            <p className="mt-1 font-semibold text-slate-950">{shipment.riskScore}/100</p>
          </div>
          <div>
            <p className="text-slate-500">ETA</p>
            <p className="mt-1 font-semibold text-slate-950">{shipment.eta}</p>
          </div>
          <div>
            <p className="text-slate-500">Alerts</p>
            <p className="mt-1 font-semibold text-slate-950">{shipment.alerts.length}</p>
          </div>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-4 text-sm">
        <p className="text-slate-600">{shipment.alerts[0]}</p>
        <RoleLink href={`/shipments/${shipment.id}`} role={role} className="font-medium text-ocean hover:text-sky-900">
          View shipment
        </RoleLink>
      </div>
    </div>
  );
}
