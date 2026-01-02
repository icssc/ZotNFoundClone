import { db } from "@/db";
import { emailToNumber, searches } from "@/db/schema";
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
  const phoneNumbers = await db.query.emailToNumber.findMany({
    columns: {
      phoneNumber: true,
    },
    where: inArray(emailToNumber.email, emails),
  });
  return phoneNumbers.flatMap((number) => number.phoneNumber);
}
