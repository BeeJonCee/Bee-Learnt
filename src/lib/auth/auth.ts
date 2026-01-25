import type { NextAuthOptions, Session } from "next-auth";
import type { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { roles, users } from "@/lib/db/schema";

export type BeeLearntRole = "STUDENT" | "PARENT" | "ADMIN";

async function getRoleId(roleName: BeeLearntRole) {
  const [role] = await db.select().from(roles).where(eq(roles.name, roleName));
  return role?.id ?? null;
}

async function getUserWithRoleByEmail(email: string) {
  const [result] = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      passwordHash: users.passwordHash,
      role: roles.name,
    })
    .from(users)
    .innerJoin(roles, eq(users.roleId, roles.id))
    .where(eq(users.email, email));

  return result ?? null;
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;
        const user = await getUserWithRoleByEmail(credentials.email);
        if (!user?.passwordHash) return null;

        const isValid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!isValid) return null;

        return {
          id: user.id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as { id?: string }).id;
        token.role = (user as { role?: string }).role ?? token.role;
      }

      if (!token.role && token.email) {
        const existing = await getUserWithRoleByEmail(token.email as string);
        token.role = existing?.role ?? "STUDENT";
        token.id = existing?.id?.toString() ?? token.id;
      }

      return token;
    },
    async session({ session, token }) {
      const nextSession = session as Session & { user: Session["user"] & { role?: BeeLearntRole; id?: string } };
      if (token?.role) {
        nextSession.user.role = token.role as BeeLearntRole;
      }
      if (token?.id) {
        nextSession.user.id = token.id as string;
      }
      return nextSession;
    },
    async signIn({ user, account }) {
      if (!user.email || account?.provider !== "google") return true;
      const existing = await getUserWithRoleByEmail(user.email);
      if (existing) return true;

      const studentRoleId = await getRoleId("STUDENT");
      if (!studentRoleId) return false;

      await db.insert(users).values({
        name: user.name ?? "BeeLearnt Student",
        email: user.email,
        image: user.image ?? null,
        roleId: studentRoleId,
      });

      return true;
    },
  },
};

declare module "next-auth" {
  interface User {
    role?: BeeLearntRole;
  }

  interface Session {
    user: {
      id?: string;
      role?: BeeLearntRole;
    } & Session["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: BeeLearntRole;
  }
}
