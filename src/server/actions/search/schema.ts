import { z } from "zod";

export const keywordSubscriptionSchema = z.object({
  keyword: z.string().min(1, "Keyword is required"),
  email: z.email("Invalid email address"),
});

export type KeywordSubscription = z.infer<typeof keywordSubscriptionSchema>;
