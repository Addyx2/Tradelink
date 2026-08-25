import { DefaultSession } from "next-auth";
import type { UserRole } from "@/lib/types";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: UserRole;
      organizationName: string;
    } & DefaultSession["user"];
  }

  interface User {
    role?: UserRole;
    organizationName?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: UserRole;
    organizationName?: string;
  }
}
