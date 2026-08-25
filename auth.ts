import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { getDemoUser, isUserRole } from "@/lib/auth";

function toAppRole(role: string) {
  return role.toLowerCase();
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      name: "Demo login",
      credentials: {
        role: { label: "Role", type: "text" },
      },
      async authorize(credentials) {
        const requestedRole = credentials?.role;

        if (typeof requestedRole !== "string" || !isUserRole(requestedRole)) {
          return null;
        }

        const demoUser = getDemoUser(requestedRole);
        const dbUser = await prisma.user.findUnique({
          where: { email: demoUser.email },
          include: { organization: true },
        });

        if (!dbUser) {
          return {
            id: demoUser.id,
            name: demoUser.name,
            email: demoUser.email,
            role: demoUser.role,
            organizationName: demoUser.organizationName,
          };
        }

        return {
          id: dbUser.id,
          name: dbUser.name,
          email: dbUser.email,
          role: isUserRole(toAppRole(dbUser.role)) ? toAppRole(dbUser.role) : demoUser.role,
          organizationName: dbUser.organization.name,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = typeof user.role === "string" ? user.role : undefined;
        token.organizationName = typeof user.organizationName === "string" ? user.organizationName : undefined;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = typeof token.sub === "string" ? token.sub : "";
        session.user.role = typeof token.role === "string" && isUserRole(token.role) ? token.role : "client";
        session.user.organizationName = typeof token.organizationName === "string" ? token.organizationName : "";
      }

      return session;
    },
  },
  pages: {
    signIn: "/sign-in",
  },
});
