"use server";

import { db } from "@/db";
import { items, NewItem } from "@/db/schema";
import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import uploadImageToS3 from "@/server/actions/item/upload/action";
import { createAction, ActionState } from "@/server/actions/wrapper";
import { snsClient } from "@/lib/sms/client";

import { Item } from "@/db/schema";
import { Resource } from "sst/resource";
import { PublishCommand } from "@aws-sdk/client-sns";
import { itemCacheTags } from "@/server/data/item/queries";

export type CreateItemState = ActionState<Pick<Item, "id">>;

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
      console.error("Error uploading image:", uploadResult.error);
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
      .returning({ id: items.id });

    if (!storageData.isLost) {
      await snsClient.send(
        new PublishCommand({
          TopicArn: Resource.SearchKeyword.arn,
          Message: JSON.stringify({ name, description, itemId: newItem.id }),
        })
      );
    }

    revalidatePath("/");
    revalidateTag(itemCacheTags.home, "seconds");
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
