import Link from "next/link";
import { SectionHeader } from "@/components/section-header";

export default function ForbiddenPage() {
  return (
    <div className="mx-auto max-w-2xl py-10">
      <SectionHeader
        eyebrow="Access control"
        title="You do not have access to this workspace"
        description="Your current role does not have permission to view this part of Tradelink. Switch to another permitted role or return to the dashboard."
      />

      <div className="flex gap-3">
        <Link href="/" className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">
          Back to dashboard
        </Link>
        <Link href="/sign-in" className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200">
          Switch user
        </Link>
      </div>
    </div>
  );
}
