"use server";

import { db } from "@/db";
import { items, NewItem } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import uploadImageToS3 from "@/server/actions/item/upload/action";
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

    const { name, description, type, date, isLost, file, location } =
      validation.data;

    let imageUrl = "";
    if (file) {
      try {
        imageUrl = await uploadImageToS3(file);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }

    const session = await auth.api.getSession({
      headers: await headers(),
    });
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
      email: session?.user?.email || "unknown",
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
