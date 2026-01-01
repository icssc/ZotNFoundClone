import { NextRequest, NextResponse } from "next/server";
import { sendItemLostNotification } from "@/lib/email/service";
import { LostPayloadSchema, type LostPayload } from "@/lib/validators/email";

/**
 * POST /api/resend/lost
 * Body: { item: { id, name, type, email?, image? }, subscriberEmails: string[] }
 * Validated with LostPayloadSchema (zod).
 */
export async function POST(req: NextRequest) {
  const parsed = LostPayloadSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload", issues: parsed.error.format() },
      { status: 400 }
    );
  }

  const body = parsed.data as LostPayload;

  try {
    const result = await sendItemLostNotification({
      item: {
        id: body.item.id,
        name: body.item.name,
        type: body.item.type,
        image: body.item.image,
        email: body.item.email,
      },
      subscriberEmails: body.subscriberEmails,
    });

    return NextResponse.json({
      success: true,
      result,
      sentTo: body.subscriberEmails.length,
    });
  } catch (err) {
    console.error("Send lost notification error:", err);
    return NextResponse.json(
      { error: "Failed to send notification" },
      { status: 500 }
    );
  }
}
