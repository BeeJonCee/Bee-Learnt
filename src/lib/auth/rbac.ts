import { getServerSession } from "next-auth";
import type { NextRequest } from "next/server";
import { authOptions, type BeeLearntRole } from "@/lib/auth/auth";

export async function getSessionUser() {
  const session = await getServerSession(authOptions);
  return session?.user ?? null;
}

export async function requireRole(allowed: BeeLearntRole[]) {
  const user = await getSessionUser();
  if (!user?.role || !allowed.includes(user.role)) {
    return null;
  }
  return user;
}

export function getRequestRole(request: NextRequest) {
  const role = request.headers.get("x-beelearn-role");
  if (role === "ADMIN" || role === "PARENT" || role === "STUDENT") return role;
  return null;
}
