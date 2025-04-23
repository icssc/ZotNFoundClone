"use server";

import { db } from "@/db";
import { items, Item } from "@/db/schema";
import { eq } from 'drizzle-orm';
import { ErrorResponse } from "@/lib/types";



export async function getAllItems(): Promise<Item[] | ErrorResponse> {
  try {
    const result = await db.query.items.findMany();
    return result;
  } catch (err) {
    return { error : `Error fetching item: ${err}`};
  }
}

export async function getItem(id: number): Promise<Item | ErrorResponse> {
  try {
    const result = await db.query.items.findFirst({
      where: eq(items.id, id)
    })

    if (result === null || result === undefined) {
      return {error: "Item not found for the given ID."};
    }

    return result;
  } catch (err) {
    return { error : `Error fetching item: ${err}`};
  }
}

export async function getItemEmail(id: number): Promise<string | ErrorResponse> {
  try {
    const result = await db.query.items.findFirst({
        columns: {
          email: true, // Select only the email column
          },
        where: eq(items.id, id), // Filter by the provided id
    });

    const email = result?.email;

    if (email === null || email === undefined) {
      return { error : "Email not found for the given item ID."};
    }
    return email;
  } catch (err) {
    return { error : `Error fetching item: ${err}`};
  }
}
