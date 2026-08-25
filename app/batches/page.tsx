import { DashboardShell } from "@/components/dashboard-shell";
import { SectionHeader } from "@/components/section-header";
import { StatusBadge } from "@/components/status-badge";
import { TableCard } from "@/components/table-card";
import { requireRole } from "@/lib/auth";
import { roleAccess } from "@/lib/access";
import { getDashboardBatchesForRole } from "@/lib/role-config";
import { listBatches } from "@/lib/queries";

export default async function BatchesPage({ searchParams }: { searchParams?: { role?: string } }) {
  const user = await requireRole(roleAccess.batches, searchParams?.role);
  const batches = getDashboardBatchesForRole(user, await listBatches());

  return (
    <DashboardShell user={user}>
      <div className="space-y-6">
        <SectionHeader
          eyebrow="Compliance"
          title="Batch traceability and EUDR readiness"
          description="Assess chain-of-custody evidence, supplier provenance, and deforestation risk before release or customs clearance."
        />

        <TableCard title="Batch compliance workspace">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-5 py-3 font-medium">Batch</th>
                <th className="px-5 py-3 font-medium">Commodity</th>
                <th className="px-5 py-3 font-medium">Supplier</th>
                <th className="px-5 py-3 font-medium">Origin</th>
                <th className="px-5 py-3 font-medium">Forest risk</th>
                <th className="px-5 py-3 font-medium">Evidence</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {batches.map((batch) => {
                const supplier = batch.supplier;
                return (
                  <tr key={batch.id} className="border-t border-slate-200">
                    <td className="px-5 py-4 font-medium text-slate-950">{batch.id}</td>
                    <td className="px-5 py-4 text-slate-600">{batch.commodity}</td>
                    <td className="px-5 py-4 text-slate-600">{supplier?.name ?? "Unknown"}</td>
                    <td className="px-5 py-4 text-slate-600">{batch.originCountry}</td>
                    <td className="px-5 py-4 text-slate-600">{batch.forestRisk}</td>
                    <td className="px-5 py-4 text-slate-600">{batch.evidenceComplete}%</td>
                    <td className="px-5 py-4"><StatusBadge status={batch.complianceStatus} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </TableCard>

        <div className="grid gap-6 lg:grid-cols-3">
          {batches.map((batch) => (
            <div key={batch.id} className="card p-5">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-semibold text-slate-950">{batch.id}</h3>
                <StatusBadge status={batch.complianceStatus} />
              </div>
              <p className="mt-2 text-sm text-slate-600">{batch.commodity} · {batch.volume}</p>
              <p className="mt-2 text-sm text-slate-600">Coordinates {batch.coordinates}</p>
              <p className="mt-1 text-sm text-slate-600">Origin {batch.originCountry}</p>
              <p className="mt-1 text-sm text-slate-600">Forest risk {batch.forestRisk}</p>
              <p className="mt-1 text-sm text-slate-600">Evidence completion {batch.evidenceComplete}%</p>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
