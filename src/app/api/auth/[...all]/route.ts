import { auth } from "@/lib/auth"; // path to your auth file
import { toNextJsHandler } from "better-auth/next-js";
import { NextResponse } from "next/server";

const handlers = toNextJsHandler(auth);
export async function GET(req: Request) {
  try {
    return await handlers.GET(req);
  } catch (err) {
    console.error("Auth GET error:", err);
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
    console.error("Auth POST error:", err);
    return NextResponse.json(
      { error: "Authentication POST failed", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}
