import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

// const publicRoutes = ["/", "/about", "/contact", "/blog", "/product"];
const authRoutes = ["/signin", "/signup", "/reset-password-request", "/reset-password"];
const adminRoutes = ["/dashboard/admin"];
// const userRoutes = ["/dashboard/user"];
const userRoutes = ["/cart", "/checkout", "/dashboard/user"];
const verifyRoutes = ["/verify-email"];
const verifyPendingRotes = ["/verify-email-request"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname.startsWith("/api/account/verify-email")) {
    return NextResponse.next();
  }
  const session = await auth();
  const isLoggedIn = !!session?.user;
  const role = session?.user.role;
  const isVerifiedEmail = !!session?.user.emailVerified;

  // const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));
  const isUserRoute = userRoutes.some((route) => pathname.startsWith(route));
  const isVerifyRoute = verifyRoutes.some((route) => pathname.startsWith(route));
  const isVerifyPendingRoute = verifyPendingRotes.some((route) => pathname.startsWith(route));

  if (!isLoggedIn && (isUserRoute || isVerifyPendingRoute || isVerifyRoute || pathname.startsWith("/dashboard"))) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  if (isLoggedIn && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (isLoggedIn && role === "USER" && isAdminRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (isLoggedIn && role === "ADMIN" && isUserRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (isLoggedIn && isVerifiedEmail && (isVerifyRoute || isVerifyPendingRoute)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (isLoggedIn && !isVerifiedEmail && (isUserRoute || isAdminRoute)) {
    return NextResponse.redirect(new URL("/verify-email-request", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)"],
};
