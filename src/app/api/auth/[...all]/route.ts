import { auth } from "@/lib/auth"; // path to your auth file
import { toNextJsHandler } from "better-auth/next-js";
import { NextResponse } from "next/server";
import { trackServerError, flushServerAnalytics } from "@/lib/analytics-server";

const handlers = toNextJsHandler(auth);
export async function GET(req: Request) {
  try {
    return await handlers.GET(req);
  } catch (err) {
    trackServerError({
      error: err instanceof Error ? err.message : "Unknown error",
      context: "Auth GET error",
      stack: err instanceof Error ? err.stack : undefined,
      severity: "high",
    });
    await flushServerAnalytics();
    return NextResponse.json(
      { error: "Authentication GET failed", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}
export async function POST(req: Request) {
  try {
    return await handlers.POST(req);
  } catch (err) {
    trackServerError({
      error: err instanceof Error ? err.message : "Unknown error",
      context: "Auth POST error",
      stack: err instanceof Error ? err.stack : undefined,
      severity: "high",
    });
    await flushServerAnalytics();
    return NextResponse.json(
      { error: "Authentication POST failed", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}
