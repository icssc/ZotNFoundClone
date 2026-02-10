import { Providers } from "./ContextProvider";
import { ReactNode } from "react";

export function SessionProvider({ children }: { children: ReactNode }) {
  return <Providers authHint="unknown">{children}</Providers>;
}
