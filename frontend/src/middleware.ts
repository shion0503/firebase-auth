// middleware.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const publicPaths = ["/signin", "/signup"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/"],
};