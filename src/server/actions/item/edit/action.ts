"use server";

import { db } from "@/db";
import { items } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import uploadImageToS3 from "@/server/actions/item/upload/action";
import { eq } from "drizzle-orm";
import { createAction, ActionState } from "@/server/actions/wrapper";
import { trackServerError } from "@/lib/analytics-server";

import { Item } from "@/db/schema";

export type EditItemState = ActionState<Pick<Item, "id">>;

const editItemSchema = z.object({
  id: z.number(),
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
  keepExistingImage: z.boolean().optional(),
});

const editItemHandler = createAction(editItemSchema, async (data, session) => {
  const {
    id,
    name,
    description,
    type,
    date,
    isLost,
    file,
    location,
    keepExistingImage,
  } = data;
  const userEmail = session.user.email;

  // Verify ownership
  const [existingItem] = await db
    .select()
    .from(items)
    .where(eq(items.id, id))
    .limit(1);

  if (!existingItem) {
    throw new Error("Item not found.");
  }

  if (existingItem.email !== userEmail) {
    throw new Error("You can only edit your own items.");
  }

  let imageUrl = existingItem.image;

  // Only upload new image if file is provided and we're not keeping existing
  if (file && !keepExistingImage && file.size > 0) {
    const uploadResult = await uploadImageToS3(file);
    if (uploadResult.success) {
      imageUrl = uploadResult.data;
    } else {
      trackServerError({
        error: String(uploadResult.error ?? "Unknown upload error"),
        context: "edit_item image upload failed",
        severity: "medium",
      });
      throw new Error("Failed to upload image. Please try again.");
    }
  }

  // Update the item
  const [updatedItem] = await db
    .update(items)
    .set({
      name,
      description,
      type,
      date,
      itemDate: date,
      image: imageUrl,
      isLost,
      location,
    })
    .where(eq(items.id, id))
    .returning({ id: items.id });

  revalidatePath("/");
  return updatedItem;
});

export async function editItem(
  _: EditItemState,
  formData: FormData
): Promise<EditItemState> {
  const rawData = {
    id: parseInt(formData.get("id") as string),
    name: formData.get("name"),
    description: formData.get("description"),
    type: formData.get("type"),
    date: formData.get("date"),
    isLost: formData.get("isLost") === "true",
    location: JSON.parse((formData.get("location") as string) || "[]"),
    file: formData.get("file") || undefined,
    keepExistingImage: formData.get("keepExistingImage") === "true",
  };

  return editItemHandler(rawData);
}
