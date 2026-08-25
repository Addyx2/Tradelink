import Link from "next/link";
import type { UserRole } from "@/lib/types";

export function withRole(href: string, role: UserRole) {
  return `${href}${href.includes("?") ? "&" : "?"}role=${role}`;
}

export function RoleLink({ href, role, className, children }: { href: string; role: UserRole; className?: string; children: React.ReactNode }) {
  return (
    <Link href={withRole(href, role)} className={className}>
      {children}
    </Link>
  );
}
