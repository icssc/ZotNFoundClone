import "server-only";
import { cache } from "react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export class UnauthenticatedError extends Error {
  constructor(message: string = "Unauthenticated User") {
    super(message);
    this.name = "UnauthenticatedError";
  }
}

export const verifySession = cache(async function verifySession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user || !session.user.email) {
    throw new UnauthenticatedError();
  }

  return session;
});
