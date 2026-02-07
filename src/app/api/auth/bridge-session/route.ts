import { auth } from "@/lib/auth/server";
import { NextResponse } from "next/server";

const backendUrl =
  process.env.NEXT_PUBLIC_BACKEND_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:4000";

const jwtSecret = process.env.JWT_SECRET;

export async function GET() {
  try {
    if (!jwtSecret) {
      return NextResponse.json(
        { message: "Server misconfigured: JWT_SECRET not set" },
        { status: 500 },
      );
    }

    const session = await auth.getSession();

    if (!session?.data?.user?.id) {
      return NextResponse.json(
        { message: "No session found. Please try signing in again." },
        { status: 401 },
      );
    }

    const response = await fetch(`${backendUrl}/api/auth/social-bridge`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Internal-Secret": jwtSecret,
      },
      body: JSON.stringify({ neonAuthUserId: session.data.user.id }),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      console.error("[bridge-session] Backend error:", payload);
      return NextResponse.json(
        { message: payload?.message || `Backend returned ${response.status}` },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("[bridge-session] Error:", error);
    return NextResponse.json(
      { message: "Authentication failed. Please try again." },
      { status: 500 },
    );
  }
}
