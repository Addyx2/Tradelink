import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { Sidebar } from "@/components/sidebar";
import { resolveCurrentUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Tradelink",
  description: "Telemetry, eBDL, and EUDR compliance platform for Giants.earth",
};

export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const user = await resolveCurrentUser();

  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-slate-50 text-slate-900 lg:grid lg:grid-cols-[260px_1fr]">
          <Sidebar user={user} />
          <main className="p-6 lg:p-10">{children}</main>
        </div>
      </body>
    </html>
  );
}
