import { NextRequest, NextResponse } from "next/server";
import { verifyTokenEdge } from "@/lib/auth";

const ROLE_PREFIX: Record<string, string> = {
  "/app": "client",
  "/livreur": "livreur",
  "/admin": "admin",
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const prefix = Object.keys(ROLE_PREFIX).find((p) => pathname.startsWith(p));
  if (!prefix) return NextResponse.next();

  const token = req.cookies.get("session")?.value;
  const session = token ? await verifyTokenEdge(token) : null;

  if (!session || session.role !== ROLE_PREFIX[prefix]) {
    const url = req.nextUrl.clone();
    url.pathname = "/connexion";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/app/:path*", "/livreur/:path*", "/admin/:path*"],
};
