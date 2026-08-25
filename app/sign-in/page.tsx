import Link from "next/link";
import { SectionHeader } from "@/components/section-header";
import { getAllDemoUsers } from "@/lib/auth";
import { getRoleLabel } from "@/lib/role-config";

export default function SignInPage() {
  const users = getAllDemoUsers();

  return (
    <div className="mx-auto max-w-3xl py-10">
      <SectionHeader
        eyebrow="Authentication"
        title="Sign in to Tradelink"
        description="This scaffold uses demo personas today and is ready to be replaced with real authentication providers and server sessions."
      />

      <div className="grid gap-4 md:grid-cols-2">
        {users.map((user) => (
          <Link key={user.id} href={`/?role=${user.role}`} className="card p-5 hover:border-slate-300">
            <p className="text-sm text-slate-500">{getRoleLabel(user.role)}</p>
            <h3 className="mt-2 text-lg font-semibold text-slate-950">{user.name}</h3>
            <p className="mt-1 text-sm text-slate-600">{user.email}</p>
            <p className="mt-1 text-sm text-slate-500">{user.organizationName}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
