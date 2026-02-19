import { z } from "zod";

const ItemSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  type: z.string().min(1),
  email: z.email(),
  image: z.string().optional(),
  description: z.string().optional(),
  itemDate: z.string().optional(),
});

export const FoundPayloadSchema = z.object({
  item: ItemSchema,
  finderName: z.string().min(1),
  finderEmail: z.email(),
});

export const LostPayloadSchema = z.object({
  item: ItemSchema,
  subscriberEmails: z.array(z.email()).min(1),
});
