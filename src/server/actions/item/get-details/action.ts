"use server";

import { z } from "zod";
import { createPublicAction } from "@/server/actions/wrapper";
import { getItemDetailsById } from "@/server/data/item/queries";

const getItemDetailsSchema = z.object({
  id: z.number(),
});

export const getItemDetails = createPublicAction(
  getItemDetailsSchema,
  async ({ id }) => {
    const result = await getItemDetailsById(id);
    if (result.error || !result.data) {
      throw new Error(result.error || "Item not found");
    }
    return result.data;
  }
);
