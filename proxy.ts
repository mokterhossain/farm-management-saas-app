import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const { pathname } = req.nextUrl;

    // 1. API ROUTES: Never redirect. If no token, return 401 JSON.
    if (pathname.startsWith("/api/")) {
      if (!isAuth && !pathname.startsWith("/api/mobile/login") && !pathname.startsWith("/api/auth")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      return NextResponse.next();
    }

    // 2. WEB LOGIC: Handle Redirects for Browser users
    if (isAuth && (pathname === "/" || pathname.startsWith("/login"))) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    if (!isAuth) {
      if (pathname.startsWith("/login")) return NextResponse.next();
      return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // API routes, Root, and Login are "authorized" to pass through to the 
        // function above where we handle the specific logic/JSON responses.
        if (pathname.startsWith("/api/") || pathname === "/" || pathname.startsWith("/login")) {
          return true;
        }

        return !!token;
      },
    },
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  // Catch everything except static files and images
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};