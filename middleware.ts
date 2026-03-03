import { NextRequest, NextResponse } from "next/server";

const PASSWORD = "yazed2026";

export function middleware(req: NextRequest) {
  const cookie = req.cookies.get("auth")?.value;
  
  if (req.nextUrl.pathname === "/login") return NextResponse.next();
  
  if (cookie === PASSWORD) return NextResponse.next();

  return NextResponse.redirect(new URL("/login", req.url));
}

export const config = {
  matcher: ["/fahd", "/rahaf", "/noura", "/saad", "/mohammed"],
};