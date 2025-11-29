"use server";

import { createAction } from "@/server/actions/wrapper";
import { findEmailsCore } from "@/server/searchEmail";
import { z } from "zod";

export const findEmailsSubscribedToKeywordsInFields =
  createAction(
    z.object({ name: z.string(), description: z.string() }),
    async ({ name, description }) => {
      const emails = await findEmailsCore(name, description);
      return { emails };
    }
  );