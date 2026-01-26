import { NextResponse, type NextRequest } from "next/server";
import { neonAuthMiddleware } from "@neondatabase/auth/next/server";

const protectedRoutes = [
  "/dashboard",
  "/subjects",
  "/modules",
  "/lessons",
  "/assignments",
  "/ai-tutor",
  "/children",
  "/quizzes",
  "/search",
  "/study",
  "/admin",
];

const neonMiddleware = neonAuthMiddleware({
  loginUrl: "/login",
});

function isProtectedPath(pathname: string) {
  return protectedRoutes.some((route) => pathname.startsWith(route));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname.startsWith("/account") || isProtectedPath(pathname)) {
    return neonMiddleware(request);
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/account/:path*",
    "/dashboard/:path*",
    "/subjects/:path*",
    "/modules/:path*",
    "/lessons/:path*",
    "/assignments/:path*",
    "/ai-tutor/:path*",
    "/children/:path*",
    "/quizzes/:path*",
    "/search/:path*",
    "/study/:path*",
    "/admin/:path*",
  ],
};
