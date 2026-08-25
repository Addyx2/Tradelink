import { DashboardShell } from "@/components/dashboard-shell";
import { SectionHeader } from "@/components/section-header";
import { requireRole } from "@/lib/auth";
import { roleAccess } from "@/lib/access";
import { getRoleCopilotConfig } from "@/lib/role-config";

export default async function CopilotPage({ searchParams }: { searchParams?: { role?: string } }) {
  const user = await requireRole(roleAccess.dashboard, searchParams?.role);
  const config = getRoleCopilotConfig(user);

  return (
    <DashboardShell user={user}>
      <div className="space-y-6">
        <SectionHeader
          eyebrow="Tradelink Copilot"
          title={config.title}
          description={config.description}
        />

        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <section className="card p-6">
            <h3 className="text-lg font-semibold text-slate-950">Suggested prompts</h3>
            <div className="mt-4 grid gap-3">
              {config.prompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  className="rounded-2xl border border-slate-200 px-4 py-3 text-left text-sm text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </section>

          <section className="card p-6">
            <h3 className="text-lg font-semibold text-slate-950">Role-safe answer scope</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              {config.scope.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        </div>

        <section className="card p-6">
          <h3 className="text-lg font-semibold text-slate-950">Copilot capabilities roadmap</h3>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {config.capabilities.map((capability) => (
              <div key={capability.title} className="rounded-2xl border border-slate-200 p-4">
                <h4 className="font-medium text-slate-950">{capability.title}</h4>
                <p className="mt-2 text-sm text-slate-600">{capability.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}
