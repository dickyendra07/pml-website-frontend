import { NextRequest, NextResponse } from "next/server";

import { defaultLocale, locales } from "@/i18n/config";
import { isInternalHealthPath } from "@/lib/internal-health";
import { isRequestHostAllowed } from "@/lib/request-host";

function isPublicFile(pathname: string) {
  const lastSegment = pathname.slice(pathname.lastIndexOf("/") + 1);
  return lastSegment.includes(".");
}

function hasLocale(pathname: string) {
  return locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
}

export function proxy(request: NextRequest) {
  if (!isRequestHostAllowed(request.headers.get("host"))) {
    return new NextResponse("Misdirected Request", { status: 421 });
  }

  const { pathname } = request.nextUrl;

  if (pathname.length > 1 && pathname.endsWith("/")) {
    const url = new URL(request.url);
    url.pathname = pathname.replace(/\/+$/, "");
    return NextResponse.redirect(url, 308);
  }

  if (
    pathname === "/" ||
    isInternalHealthPath(pathname) ||
    hasLocale(pathname) ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/.well-known") ||
    isPublicFile(pathname)
  ) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname}`;

  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
