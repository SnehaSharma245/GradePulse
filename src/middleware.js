import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/login",
    "/register",
    "/",
    "/verify/:path*",
    "/teacher/:path*",
    "/student-dashboard/",
  ],
};

export async function middleware(request) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;
  const role = token?.role;

  if (role === "student" && url.pathname.startsWith("/teacher")) {
    return NextResponse.redirect(new URL("/invalid-access", request.url));
  }

  if (role === "teacher" && url.pathname.startsWith("/student-dashboard")) {
    return NextResponse.redirect(new URL("/invalid-access", request.url));
  }

  if (token && role === "teacher" && url.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/teacher", request.url));
  }
  if (token && role === "student" && url.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/student", request.url));
  }

  if (
    token &&
    (url.pathname.startsWith("/login") ||
      url.pathname.startsWith("/register") ||
      url.pathname.startsWith("/verify"))
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (
    (!token &&
      (url.pathname.startsWith("/dashboard") ||
        url.pathname.startsWith("/teacher"))) ||
    url.pathname.startsWith("/student-dashboard")
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}
