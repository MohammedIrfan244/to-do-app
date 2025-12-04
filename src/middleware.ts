import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { error, info } from "./lib/logger";

export async function middleware(req: NextRequest) {

  // route logging
  const time = new Date().toISOString();
  info("ROUTE:", req.nextUrl.pathname+ " at " + time);

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  info("SESSION TOKEN:", token);

  const isAuthPage = req.nextUrl.pathname.startsWith("/auth/login");

  // IF token exists AND user is on login → redirect to main
  if (token && isAuthPage) {
    info("REDIRECTING TO MAIN");
    return NextResponse.redirect(new URL("/", req.url));
  }

  // IF token does NOT exist AND user tries to access protected page
  if (!token && !isAuthPage) {
    error("NOT AUTHENTICATED");
    info("REDIRECTING TO LOGIN");
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  // allow
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api/auth|favicon.ico).*)"],
};
