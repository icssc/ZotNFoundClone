import { z } from "zod";

export const keywordSchema = z
  .string()
  .trim()
  .min(1, "Keyword is required")
  .max(64, "Keyword is too long")
  .transform((value) => value.toLowerCase());

export const keywordSubscriptionSchema = z.object({
  keyword: keywordSchema,
  email: z.email("Invalid email address"),
});

export type KeywordSubscription = z.infer<typeof keywordSubscriptionSchema>;
