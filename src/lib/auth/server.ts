import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions, type BeeLearntRole } from "@/lib/auth/auth";

export async function requireRoleOrResponse(roles: BeeLearntRole[]) {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user?.role || !roles.includes(user.role)) {
    return { user: null, response: NextResponse.json({ message: "Unauthorized" }, { status: 403 }) };
  }

  return { user, response: null };
}

export async function requireAuthOrResponse() {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user) {
    return { user: null, response: NextResponse.json({ message: "Unauthorized" }, { status: 401 }) };
  }

  return { user, response: null };
}
