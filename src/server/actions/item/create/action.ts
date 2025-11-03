"use server";

import { db } from "@/db";
import { items, NewItem } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export interface CreateItemState {
  success: boolean;
  error?: string;
  errors?: {
    name?: string[];
    description?: string[];
    type?: string[];
    date?: string[];
    location?: string[];
    file?: string[];
  };
}

const createItemSchema = z.object({
  name: z.string().min(1, "Item name is required").max(100, "Name is too long"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description is too long"),
  type: z.enum(
    ["electronics", "clothing", "accessories", "documents", "other"],
    {
      message: "Please select a valid item type",
    }
  ),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  isLost: z.boolean(),
  location: z
    .array(z.string())
    .length(2, "Location must have exactly 2 coordinates"),
  file: z.instanceof(File).optional(),
});

export async function createItem(
  prevState: CreateItemState,
  formData: FormData
): Promise<CreateItemState> {
  try {
    // Get the current session to get the user's email
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.email) {
      return {
        success: false,
        error: "You must be signed in to create an item.",
      };
    }

    const userEmail = session.user.email;

    const rawData = {
      name: formData.get("name"),
      description: formData.get("description"),
      type: formData.get("type"),
      date: formData.get("date"),
      isLost: formData.get("isLost") === "true",
      location: JSON.parse((formData.get("location") as string) || "[]"),
      file: formData.get("file"),
    };

    const validation = createItemSchema.safeParse(rawData);

    if (!validation.success) {
      return {
        success: false,
        error: "Validation failed",
        errors: validation.error.flatten().fieldErrors,
      };
    }

    const { name, description, type, date, isLost, location } = validation.data;

    // TODO: Handle actual file upload to S3 or similar storage
    const imageUrl =
      "https://zotnfound-dang-backend-bucketbucketf19722a9-jcjpp0t0r8mh.s3.amazonaws.com/uploads/1747113328595-4b8b2932-5ba4-4440-a256-66a1f9b4a7bc.jpeg";

    const itemData: NewItem = {
      name,
      description,
      type,
      date,
      itemDate: date,
      image: imageUrl,
      isLost,
      location,
      isResolved: false,
      isHelped: false,
      email: userEmail,
    };

    await db.insert(items).values(itemData).returning();
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create item",
    };
  }
}
