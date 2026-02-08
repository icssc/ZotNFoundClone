import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const redirectUrl = new URL("/api/auth/oauth2/callback/icssc", url.origin);
  redirectUrl.search = url.search;
  return NextResponse.redirect(redirectUrl, 302);
}
