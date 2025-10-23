import { NextRequest, NextResponse } from "next/server";
import { sendItemFoundEmail } from "@/lib/email/service";
import { FoundPayloadSchema, type FoundPayload } from "@/lib/validators/email";

/**
 * POST /api/resend
 * Body: { item: { id, name, type, email, image? }, finderName, finderEmail }
 * Validated with FoundPayloadSchema
 */

/**
 * POST /api/resend
 * Body: { item: { id, name, type, email, image? }, finderName, finderEmail }
 * Uses zod (FoundPayloadSchema) to validate the body.
 */
export async function POST(req: NextRequest) {
  const parsed = FoundPayloadSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload", issues: parsed.error.format() },
      { status: 400 }
    );
  }

  const body = parsed.data as FoundPayload;

  try {
    const result = await sendItemFoundEmail({
      item: {
        id: body.item.id,
        name: body.item.name,
        type: body.item.type,
        image: body.item.image,
        email: body.item.email,
      },
      finderName: body.finderName,
      finderEmail: body.finderEmail,
    });

    return NextResponse.json({ success: true, result });
  } catch (err) {
    console.error("send found email error:", err);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
