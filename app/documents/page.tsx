import { DashboardShell } from "@/components/dashboard-shell";
import { SectionHeader } from "@/components/section-header";
import { StatusBadge } from "@/components/status-badge";
import { TableCard } from "@/components/table-card";
import { requireRole } from "@/lib/auth";
import { roleAccess } from "@/lib/access";
import { listDocuments } from "@/lib/queries";

export default async function DocumentsPage({ searchParams }: { searchParams?: { role?: string } }) {
  const user = await requireRole(roleAccess.documents, searchParams?.role);
  const ebdlRecords = await listDocuments();
  const visibleRecords = user.role === "client" ? ebdlRecords.filter((record) => record.status !== "awaiting_release") : ebdlRecords;

  return (
    <DashboardShell user={user}>
      <div className="space-y-6">
        <SectionHeader
          eyebrow="Trade docs"
          title="eBDL document center"
          description="Track issuance, amendments, and release readiness for every electronic bill of lading linked to active cargo."
        />

        <TableCard title="Electronic bills of lading">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-5 py-3 font-medium">Document</th>
                <th className="px-5 py-3 font-medium">Shipper</th>
                <th className="px-5 py-3 font-medium">Consignee</th>
                <th className="px-5 py-3 font-medium">Carrier</th>
                <th className="px-5 py-3 font-medium">Issue date</th>
                <th className="px-5 py-3 font-medium">Version</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {visibleRecords.map((record) => (
                <tr key={record.id} className="border-t border-slate-200">
                  <td className="px-5 py-4 font-medium text-slate-950">{record.id}</td>
                  <td className="px-5 py-4 text-slate-600">{record.shipper}</td>
                  <td className="px-5 py-4 text-slate-600">{record.consignee}</td>
                  <td className="px-5 py-4 text-slate-600">{record.carrier}</td>
                  <td className="px-5 py-4 text-slate-600">{record.issueDate}</td>
                  <td className="px-5 py-4 text-slate-600">{record.version}</td>
                  <td className="px-5 py-4"><StatusBadge status={record.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableCard>
      </div>
    </DashboardShell>
  );
}
