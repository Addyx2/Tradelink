import Link from "next/link";
import type { AppSessionUser } from "@/lib/auth";
import { getAllDemoUsers } from "@/lib/auth";
import { getNavigationForRole, getRoleLabel } from "@/lib/role-config";

export function Sidebar({ user }: { user: AppSessionUser }) {
  const navigation = getNavigationForRole(user.role);
  const demoUsers = getAllDemoUsers();
  return (
    <aside className="border-b border-slate-200 bg-white px-6 py-6 lg:min-h-screen lg:border-b-0 lg:border-r">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">{user.organizationName}</p>
        <h1 className="mt-2 text-2xl font-semibold text-ocean">Tradelink</h1>
        <p className="mt-2 text-sm text-slate-600">Shipment telemetry, eBDL orchestration, and EUDR readiness in one control tower.</p>
      </div>

      <div className="mb-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm">
        <p className="font-medium text-slate-950">{user.name}</p>
        <p className="mt-1 text-slate-600">{getRoleLabel(user.role)}</p>
        <p className="mt-1 text-slate-500">{user.email}</p>
      </div>

      <div className="mb-6 rounded-2xl border border-slate-200 p-4 text-sm">
        <p className="font-medium text-slate-950">View as</p>
        <div className="mt-3 space-y-2">
          {demoUsers.map((demoUser) => (
            <Link
              key={demoUser.id}
              href={`/?role=${demoUser.role}`}
              className={`block rounded-xl px-3 py-2 ${demoUser.role === user.role ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
            >
              {demoUser.name} · {getRoleLabel(demoUser.role)}
            </Link>
          ))}
        </div>
      </div>

      <nav className="space-y-2">
        {navigation.map((item) => (
          <Link
            key={item.href}
            href={`${item.href}?role=${user.role}`}
            className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-950"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
