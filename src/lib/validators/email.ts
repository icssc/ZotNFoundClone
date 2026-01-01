import { z } from "zod";

export const ItemSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  type: z.string().min(1),
  email: z.string().email(),
  image: z.string().optional(),
  description: z.string().optional(),
  itemDate: z.string().optional(),
});

export const FoundPayloadSchema = z.object({
  item: ItemSchema,
  finderName: z.string().min(1),
  finderEmail: z.string().email(),
});

export const LostPayloadSchema = z.object({
  item: ItemSchema,
  subscriberEmails: z.array(z.string().email()).min(1),
});

export type ItemData = z.infer<typeof ItemSchema>;
export type FoundPayload = z.infer<typeof FoundPayloadSchema>;
export type LostPayload = z.infer<typeof LostPayloadSchema>;

export function parseFoundPayload(input: unknown): FoundPayload {
  return FoundPayloadSchema.parse(input);
}

export function safeParseFoundPayload(input: unknown) {
  return FoundPayloadSchema.safeParse(input);
}

export function parseLostPayload(input: unknown): LostPayload {
  return LostPayloadSchema.parse(input);
}

export function safeParseLostPayload(input: unknown) {
  return LostPayloadSchema.safeParse(input);
}
