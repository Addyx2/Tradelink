import { DashboardShell } from "@/components/dashboard-shell";
import { MetricCard } from "@/components/metric-card";
import { RoleLink } from "@/components/role-query-links";
import { SectionHeader } from "@/components/section-header";
import { ShipmentCard } from "@/components/shipment-card";
import { TableCard } from "@/components/table-card";
import { StatusBadge } from "@/components/status-badge";
import { requireRole } from "@/lib/auth";
import { roleAccess } from "@/lib/access";
import { getDashboardBatchesForRole, getDashboardShipmentsForRole, getRoleDashboardConfig, getRoleMetrics } from "@/lib/role-config";
import { listBatches, listDashboardMetrics, listShipments } from "@/lib/queries";

export default async function HomePage({ searchParams }: { searchParams?: { role?: string } }) {
  const user = await requireRole(roleAccess.dashboard, searchParams?.role);
  const [metrics, shipments, batches] = await Promise.all([
    listDashboardMetrics(),
    listShipments(),
    listBatches(),
  ]);

  const config = getRoleDashboardConfig(user);
  const visibleShipments = getDashboardShipmentsForRole(user, shipments);
  const visibleBatches = getDashboardBatchesForRole(user, batches);
  const metricValues = getRoleMetrics(user, metrics, visibleShipments, visibleBatches);

  return (
    <DashboardShell user={user}>
      <div className="space-y-8">
        <SectionHeader
          eyebrow={config.eyebrow}
          title={config.title}
          description={config.description}
        />

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <MetricCard label={config.metricLabels[0]} value={metricValues[0]} hint="Live role-aware KPI" />
          <MetricCard label={config.metricLabels[1]} value={metricValues[1]} hint="Updated from active workflow state" />
          <MetricCard label={config.metricLabels[2]} value={metricValues[2]} hint="Relevant to your workspace" />
          <MetricCard label={config.metricLabels[3]} value={metricValues[3]} hint="Needs attention or action" />
          <MetricCard label={config.metricLabels[4]} value={metricValues[4]} hint="Visible in your scope" />
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-slate-950">Priority shipments</h3>
              <RoleLink href="/shipments" role={user.role} className="text-sm font-medium text-ocean hover:text-sky-900">View all</RoleLink>
            </div>
            {visibleShipments.map((shipment) => (
              <ShipmentCard key={shipment.id} shipment={shipment} />
            ))}
          </div>

          <div className="space-y-6">
            <TableCard title={config.primaryTableTitle}>
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-5 py-3 font-medium">Batch</th>
                    <th className="px-5 py-3 font-medium">Commodity</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleBatches.map((batch) => (
                    <tr key={batch.id} className="border-t border-slate-200">
                      <td className="px-5 py-4 font-medium text-slate-900">{batch.id}</td>
                      <td className="px-5 py-4 text-slate-600">{batch.commodity}</td>
                      <td className="px-5 py-4"><StatusBadge status={batch.complianceStatus} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TableCard>

            <div className="card p-5">
              <h3 className="text-base font-semibold text-slate-950">{config.recommendedActionsTitle}</h3>
              <ul className="mt-4 space-y-3 text-sm text-slate-600">
                {config.recommendedActions.map((action) => (
                  <li key={action}>{action}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}
