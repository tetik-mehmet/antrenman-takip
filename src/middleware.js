import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "token";
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback-dev-secret"
);

function getToken(request) {
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) return null;
  const cookies = cookieHeader.split(";").map((c) => c.trim());
  const tokenCookie = cookies.find((c) => c.startsWith(`${COOKIE_NAME}=`));
  if (!tokenCookie) return null;
  return tokenCookie.slice(COOKIE_NAME.length + 1);
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = getToken(request);

  let payload = null;
  if (token) {
    try {
      const { payload: p } = await jwtVerify(token, JWT_SECRET);
      payload = { userId: p.userId, role: p.role, email: p.email };
    } catch {
      payload = null;
    }
  }

  const isAuth = !!payload;
  const isAdmin = payload?.role === "ADMIN";
  const isUser = payload?.role === "USER";

  const isAuthRoute = pathname === "/login" || pathname === "/register";
  const isAdminRoute = pathname.startsWith("/admin");
  const isUserRoute = pathname.startsWith("/user");

  if (isAuthRoute) {
    if (isAuth) {
      const url = request.nextUrl.clone();
      url.pathname = isAdmin ? "/admin" : "/user";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  if (isAdminRoute) {
    if (!isAuth) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
    if (!isAdmin) {
      const url = request.nextUrl.clone();
      url.pathname = "/user";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  if (isUserRoute) {
    if (!isAuth) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
    if (isAdmin) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  if (pathname === "/") {
    if (isAuth) {
      const url = request.nextUrl.clone();
      url.pathname = isAdmin ? "/admin" : "/user";
      return NextResponse.redirect(url);
    }
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/register", "/admin/:path*", "/user/:path*"],
};
