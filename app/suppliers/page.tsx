import { DashboardShell } from "@/components/dashboard-shell";
import { SectionHeader } from "@/components/section-header";
import { requireRole } from "@/lib/auth";
import { roleAccess } from "@/lib/access";
import { listSuppliers } from "@/lib/queries";

export default async function SuppliersPage({ searchParams }: { searchParams?: { role?: string } }) {
  const user = await requireRole(roleAccess.suppliers, searchParams?.role);
  const suppliers = await listSuppliers();

  return (
    <DashboardShell user={user}>
      <div className="space-y-6">
        <SectionHeader
          eyebrow="Ecosystem"
          title="Supplier trust and provenance overview"
          description="Compare supplier reliability, compliance pass rates, and operational incidents across sourcing regions."
        />

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {suppliers.map((supplier) => (
            <div key={supplier.id} className="card p-5">
              <p className="text-sm font-medium text-slate-500">{supplier.id}</p>
              <h3 className="mt-2 text-xl font-semibold text-slate-950">{supplier.name}</h3>
              <p className="mt-2 text-sm text-slate-600">{supplier.country}</p>
              <dl className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between gap-4"><dt className="text-slate-500">Trust score</dt><dd className="font-medium text-slate-950">{supplier.trustScore}/100</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-slate-500">Compliance pass rate</dt><dd className="font-medium text-slate-950">{supplier.compliancePassRate}%</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-slate-500">Active batches</dt><dd className="font-medium text-slate-950">{supplier.activeBatches}</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-slate-500">Incidents</dt><dd className="font-medium text-slate-950">{supplier.incidents}</dd></div>
              </dl>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
