import { ReactNode } from "react";

export function TableCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="card overflow-hidden">
      <div className="border-b border-slate-200 px-5 py-4">
        <h3 className="text-base font-semibold text-slate-950">{title}</h3>
      </div>
      <div className="overflow-x-auto">{children}</div>
    </section>
  );
}
