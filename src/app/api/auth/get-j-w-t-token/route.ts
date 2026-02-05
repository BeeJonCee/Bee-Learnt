import { NextResponse } from "next/server";
import { createAuthServer } from "@neondatabase/auth/next/server";

// Compatibility route for older clients that request /api/auth/get-j-w-t-token.
// Prefer using the built-in /api/auth/token endpoint.
export async function GET() {
  const authServer = createAuthServer();
  const result = await authServer.token();

  const token = result?.data?.token ?? null;
  if (!token) {
    const message = result?.error?.message ?? "Unauthorized";
    return NextResponse.json({ message }, { status: 401 });
  }

  return NextResponse.json({ token });
}
