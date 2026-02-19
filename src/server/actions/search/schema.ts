import { z } from "zod";

export const keywordSchema = z
  .string()
  .trim()
  .min(1, "Keyword is required")
  .max(64, "Keyword is too long")
  .transform((value) => value.toLowerCase());
