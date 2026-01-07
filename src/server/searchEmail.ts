import { db } from "@/db";
import { user } from "@/db/auth-schema";
import { searches } from "@/db/schema";
import { inArray, or, sql } from "drizzle-orm";

export async function findSubscribedEmails(
  name: string,
  description: string
): Promise<string[]> {
  const results = await db
    .select({ emails: searches.emails })
    .from(searches)
    .where(
      or(
        sql`${name} ILIKE '%' || ${searches.keyword} || '%'`,
        sql`${description} ILIKE '%' || ${searches.keyword} || '%'`
      )
    );
  const allEmails = results.flatMap((r) => r.emails);
  return [...new Set(allEmails)];
}

export async function getPhoneNumbersCorrespondingToEmails(
  emails: string[]
): Promise<string[]> {
  if (emails.length === 0) {
    return [];
  }
  const phoneNumbers = await db
    .select({ phoneNumber: user.phoneNumber })
    .from(user)
    .where(inArray(user.email, emails));

  return phoneNumbers
    .map((row) => row.phoneNumber)
    .filter((n): n is string => n != null);
}
