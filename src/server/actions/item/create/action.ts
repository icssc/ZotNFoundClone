"use server";

import { db } from "@/db";
import { items, Item, NewItem } from "@/db/schema";
import { z } from "zod";
import uploadImageToS3 from "@/server/actions/item/upload/action";
import { createAction, ActionState } from "@/server/actions/wrapper";
import { snsClient } from "@/lib/sms/client";
import { trackServerError } from "@/lib/analytics-server";

import { PublishCommand } from "@aws-sdk/client-sns";
import { revalidateItems } from "@/server/data/item/cache";

export type CreateItemState = ActionState<Item>;

const locationSchema = z
  .tuple([z.coerce.number().finite(), z.coerce.number().finite()])
  .transform(([lat, lng]) => [String(lat), String(lng)] as [string, string]);

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
  location: locationSchema,
  file: z.instanceof(File, { message: "Image is required" }),
});

const itemStorageSchema = createItemSchema.omit({ file: true }).extend({
  image: z.url("Invalid image URL"),
});

const createItemHandler = createAction(
  createItemSchema,
  async (data, session) => {
    const { name, description, type, date, isLost, file, location } = data;
    const userEmail = session.user.email;

    const uploadResult = await uploadImageToS3(file);
    if (!uploadResult.success) {
      trackServerError({
        error: uploadResult.error || "Unknown upload error",
        context: "Create item image upload failed",
        severity: "high",
      });
      throw new Error("Failed to upload image. Please try again.");
    }

    const imageUrl = uploadResult.data;

    // Validate the data to be stored
    const storageData = {
      name,
      description,
      type,
      date,
      isLost,
      location,
      image: imageUrl,
    };

    const validatedStorageData = itemStorageSchema.parse(storageData);

    const itemData: NewItem = {
      ...validatedStorageData,
      date: new Date().toISOString(),
      itemDate: date,
      isResolved: false,
      isHelped: false,
      email: userEmail,
    };

    const [newItem] = await db
      .insert(items)
      .values(itemData)
      .returning();

    if (!storageData.isLost) {
      const topicArn = process.env.SEARCH_KEYWORD_TOPIC_ARN;

      if (!topicArn) {
        throw new Error("Search keyword topic is not configured.");
      }

      await snsClient.send(
        new PublishCommand({
          TopicArn: topicArn,
          Message: JSON.stringify({ name, description, itemId: newItem.id }),
        })
      );
    }

    revalidateItems();
    return newItem;
  }
);

export async function createItem(
  _: CreateItemState,
  formData: FormData
): Promise<CreateItemState> {
  const rawData = {
    name: formData.get("name"),
    description: formData.get("description"),
    type: formData.get("type"),
    date: formData.get("date"),
    isLost: formData.get("isLost") === "true",
    location: JSON.parse((formData.get("location") as string) || "[]"),
    file: formData.get("file") || undefined,
  };

  return createItemHandler(rawData);
}
