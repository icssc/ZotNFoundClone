import { sendItemLostNotification } from "@/lib/email/service";
import { LostPayloadSchema } from "@/lib/validators/email";
import { NextResponse } from "next/server";
import { treeifyError } from "zod";
import { trackServerError } from "@/lib/analytics-server";

export async function POST(req: Request) {
  try {
    const raw = await req.json();
    const validation = LostPayloadSchema.safeParse(raw);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid payload", issues: treeifyError(validation.error) },
        { status: 400 }
      );
    }

    const body = validation.data;

    if (!body.subscriberEmails.length) {
      return NextResponse.json(
        { error: "No subscriber emails provided", code: "BAD_REQUEST" },
        { status: 400 }
      );
    }

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
      data: {
        result,
        sentTo: body.subscriberEmails.length,
      },
    });
  } catch (error) {
    trackServerError({
      error: error instanceof Error ? error.message : "Unknown error",
      context: "POST /api/resend/lost failed",
      severity: "high",
      stack: error instanceof Error ? error.stack : undefined,
      extra: {
        error_name: error instanceof Error ? error.name : "unknown",
      },
    });
    return NextResponse.json(
      { error: "Internal server error", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}
