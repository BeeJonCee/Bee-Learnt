import { NextResponse, type NextRequest } from "next/server";

// Auth is handled by the backend service (JWT in Authorization header).
// Client-side route protection lives in `src/app/(protected)/layout.tsx`.
export function middleware(_request: NextRequest) {
  return NextResponse.next();
}
