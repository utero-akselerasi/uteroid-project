import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SESSION_COOKIE = "utero_admin_session";

// Optimistic cookie-presence gate for /admin. The Go API remains the real
// authorization layer (session + CSRF on every write); an expired cookie
// still reaches /admin, where the dashboard re-authenticates inline.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = request.cookies.has(SESSION_COOKIE);

  if (pathname === "/admin/login") {
    if (hasSession) {
      const res = NextResponse.redirect(new URL("/admin", request.url));
      res.headers.set("Cache-Control", "no-store");
      return res;
    }
    const res = NextResponse.next();
    res.headers.set("Cache-Control", "no-store");
    return res;
  }

  if (!hasSession) {
    const res = NextResponse.redirect(new URL("/admin/login", request.url));
    res.headers.set("Cache-Control", "no-store");
    return res;
  }
  const res = NextResponse.next();
  res.headers.set("Cache-Control", "no-store");
  return res;
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
