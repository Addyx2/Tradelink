import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import type { UserRole } from "@/lib/types";

export interface AppSessionUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organizationName: string;
}

export interface AuthSession {
  user: AppSessionUser;
}

export const SESSION_COOKIE_NAME = "tradelink-role";

const demoUsers: Record<UserRole, AppSessionUser> = {
  trademaster: {
    id: "USR-001",
    name: "Ama Mensah",
    email: "ama@giants.earth",
    role: "trademaster",
    organizationName: "Giants.earth",
  },
  trade_officer_compliance: {
    id: "USR-002",
    name: "Jonas Ritter",
    email: "jonas@giants.earth",
    role: "trade_officer_compliance",
    organizationName: "Giants.earth",
  },
  trade_officer_inspection: {
    id: "USR-003",
    name: "Nadia Okoro",
    email: "nadia@giants.earth",
    role: "trade_officer_inspection",
    organizationName: "Giants.earth",
  },
  supplier: {
    id: "USR-004",
    name: "Kojo Supplier",
    email: "kojo@atlasagro.example",
    role: "supplier",
    organizationName: "Atlas Agro Forestry",
  },
  client: {
    id: "USR-005",
    name: "Elena Fischer",
    email: "elena@northatlanticfoods.example",
    role: "client",
    organizationName: "North Atlantic Foods GmbH",
  },
};

export function isUserRole(value: string): value is UserRole {
  return value in demoUsers;
}

export function getAllDemoUsers() {
  return Object.values(demoUsers);
}

export function getDemoUser(role?: string): AppSessionUser {
  if (role && isUserRole(role)) {
    return demoUsers[role];
  }

  return demoUsers.trademaster;
}

export async function getSession(): Promise<AuthSession | null> {
  const nextAuthSession = await auth();

  if (nextAuthSession?.user?.email && nextAuthSession.user.role && isUserRole(nextAuthSession.user.role)) {
    return {
      user: {
        id: nextAuthSession.user.id,
        name: nextAuthSession.user.name ?? nextAuthSession.user.email,
        email: nextAuthSession.user.email,
        role: nextAuthSession.user.role,
        organizationName: nextAuthSession.user.organizationName ?? "",
      },
    };
  }

  const cookieStore = await cookies();
  const roleFromCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (roleFromCookie && isUserRole(roleFromCookie)) {
    return { user: demoUsers[roleFromCookie] };
  }

  return null;
}

export async function resolveCurrentUser(roleOverride?: string): Promise<AppSessionUser> {
  if (roleOverride && isUserRole(roleOverride)) {
    return demoUsers[roleOverride];
  }

  const session = await getSession();
  return session?.user ?? demoUsers.trademaster;
}

export async function requireUser(roleOverride?: string): Promise<AppSessionUser> {
  const user = await resolveCurrentUser(roleOverride);

  if (!user) {
    redirect("/sign-in");
  }

  return user;
}

export async function requireRole(allowedRoles: UserRole[], roleOverride?: string): Promise<AppSessionUser> {
  const user = await requireUser(roleOverride);

  if (!allowedRoles.includes(user.role)) {
    redirect("/forbidden");
  }

  return user;
}
