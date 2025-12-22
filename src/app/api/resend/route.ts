import { sendItemFoundEmail } from "@/lib/email/service";
import { FoundPayloadSchema } from "@/lib/validators/email";
import { NextResponse } from "next/server";
import { treeifyError } from "zod";

export async function POST(req: Request) {
  try {
    const raw = await req.json();
    const validation = FoundPayloadSchema.safeParse(raw);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid payload", issues: treeifyError(validation.error) },
        { status: 400 }
      );
    }

    const body = validation.data;

    if (body.item.email === body.finderEmail) {
      return NextResponse.json(
        { error: "Cannot contact yourself", code: "BAD_REQUEST" },
        { status: 400 }
      );
    }

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

    return NextResponse.json({ data: { result } });
  } catch (error) {
    console.error("Error in /api/resend:", error);
    return NextResponse.json(
      { error: "Internal server error", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}
