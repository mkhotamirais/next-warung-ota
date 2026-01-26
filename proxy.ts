import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { adminRoute, authRoutes, transactionRoutes, userRoute, verifyPendingRoute, verifyRoute } from "./lib/content";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname.startsWith("/api/account/verify-email")) {
    return NextResponse.next();
  }

  const session = await auth();
  const isLoggedIn = !!session?.user;
  const role = session?.user.role;
  const isVerifiedEmail = !!session?.user.emailVerified;

  const isAuthRoutes = authRoutes.some((route) => pathname.startsWith(route));
  const isTransactionRoutes = transactionRoutes.some((route) => pathname.startsWith(route));
  const isAdminRoute = pathname.startsWith(adminRoute);
  const isUserRoute = pathname.startsWith(userRoute);
  const isBaseUserPage = pathname === "/user";
  const isProfileArea = pathname.startsWith("/user/profile");
  const isVerifyRoute = pathname.startsWith(verifyRoute);
  const isVerifyPendingRoute = pathname.startsWith(verifyPendingRoute);
  const isDashbardRoute = pathname.startsWith("/dashboard");

  if (!isLoggedIn && (isUserRoute || isAdminRoute || isVerifyRoute || isVerifyPendingRoute)) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  if (isLoggedIn) {
    if (isAuthRoutes || isDashbardRoute) {
      if (role === "ADMIN") return NextResponse.redirect(new URL("/admin", request.url));
      if (role === "USER") return NextResponse.redirect(new URL("/user", request.url));
    }
    if (isAdminRoute && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/user", request.url));
    }
    if (isUserRoute && role !== "USER") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    if (isVerifyRoute || isVerifyPendingRoute) {
      if (isVerifiedEmail) {
        if (role === "ADMIN") return NextResponse.redirect(new URL("/admin", request.url));
        if (role === "USER") return NextResponse.redirect(new URL("/user", request.url));
      }
    }
    if (isTransactionRoutes && !isVerifiedEmail) {
      return NextResponse.redirect(new URL("/verify-email-request", request.url));
    }

    if (!isVerifiedEmail && isUserRoute && !isBaseUserPage && !isProfileArea) {
      return NextResponse.redirect(new URL("/verify-email-request", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)"],
};
