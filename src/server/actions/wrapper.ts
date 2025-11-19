import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { z } from "zod";
import { treeifyError } from "zod";

export type ActionState<T = void> =
  | { success: true; data: T }
  | { success: false; error: string; issues?: ReturnType<typeof treeifyError> };

type ActionHandler<T, R> = (
  data: T,
  session: typeof auth.$Infer.Session
) => Promise<R>;

export function createAction<T, R>(
  schema: z.ZodType<T>,
  handler: ActionHandler<T, R>
) {
  return async (data: unknown): Promise<ActionState<R>> => {
    try {
      const session = await auth.api.getSession({
        headers: await headers(),
      });

      if (!session) {
        return {
          success: false,
          error: "Unauthorized",
        };
      }

      const validation = schema.safeParse(data);

      if (!validation.success) {
        return {
          success: false,
          error: "Validation failed",
          issues: treeifyError(validation.error),
        };
      }

      try {
        const result = await handler(validation.data, session);
        return {
          success: true,
          data: result,
        };
      } catch (error) {
        return {
          success: false,
          error:
            error instanceof Error ? error.message : "An unexpected error occurred",
        };
      }
    } catch (error) {
      return {
        success: false,
        error: "Internal server error",
      };
    }
  };
}

// Helper for public actions (no auth required)
export function createPublicAction<T, R>(
  schema: z.ZodType<T>,
  handler: (data: T) => Promise<R>
) {
  return async (data: unknown): Promise<ActionState<R>> => {
    try {
      const validation = schema.safeParse(data);

      if (!validation.success) {
        return {
          success: false,
          error: "Validation failed",
          issues: treeifyError(validation.error),
        };
      }

      try {
        const result = await handler(validation.data);
        return {
          success: true,
          data: result,
        };
      } catch (error) {
        return {
          success: false,
          error:
            error instanceof Error ? error.message : "An unexpected error occurred",
        };
      }
    } catch (error) {
      return {
        success: false,
        error: "Internal server error",
      };
    }
  };
}
