import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

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

function isProtectedPath(pathname: string) {
  return protectedRoutes.some((route) => pathname.startsWith(route));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (!isProtectedPath(pathname)) {
    return NextResponse.next();
  }

  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const role = token.role as string | undefined;

  if (pathname.startsWith("/dashboard/student") && role !== "STUDENT") {
    return NextResponse.redirect(new URL("/dashboard/parent", request.url));
  }

  if (pathname.startsWith("/dashboard/parent") && role !== "PARENT") {
    return NextResponse.redirect(new URL("/dashboard/student", request.url));
  }

  if (pathname.startsWith("/admin") && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard/student", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
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
