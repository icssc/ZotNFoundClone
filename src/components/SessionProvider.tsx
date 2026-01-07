import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Providers } from "./ContextProvider";
import { ReactNode } from "react";

export async function SessionProvider({ children }: { children: ReactNode }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const initialUser = session?.user;

  return <Providers initialUser={initialUser}>{children}</Providers>;
}
