import type { ReactNode } from "react";
import type { AppSessionUser } from "@/lib/auth";
import { getRoleLabel } from "@/lib/role-config";

export function DashboardShell({ user, children }: { user: AppSessionUser; children: ReactNode }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-panel md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm text-slate-500">Signed in as</p>
          <h2 className="mt-1 text-xl font-semibold text-slate-950">{user.name}</h2>
          <p className="mt-1 text-sm text-slate-600">{getRoleLabel(user.role)} · {user.organizationName}</p>
        </div>
        <div className="rounded-xl bg-slate-100 px-4 py-2 text-sm text-slate-700">
          Dynamic role-based workspace active
        </div>
      </div>
      {children}
    </div>
  );
}
