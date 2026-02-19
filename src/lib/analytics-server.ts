import "server-only";
import { PostHog } from "posthog-node";

const apiKey = process.env.POSTHOG_API_KEY;
const host = process.env.POSTHOG_HOST || "https://us.i.posthog.com";

const client = apiKey
  ? new PostHog(apiKey, {
      host,
      flushAt: 1,
      flushInterval: 0,
    })
  : null;

type ServerErrorPayload = {
  error: string;
  context: string;
  stack?: string;
  severity?: "low" | "medium" | "high";
  extra?: Record<string, unknown>;
};

export function trackServerError(payload: ServerErrorPayload) {
  if (!client) return;

  client.capture({
    distinctId: "server",
    event: "$exception",
    properties: {
      $exception_message: payload.error,
      $exception_type: payload.context,
      $exception_list: [
        {
          type: payload.context,
          value: payload.error,
          stacktrace: payload.stack,
        },
      ],
      context: payload.context,
      severity: payload.severity ?? "medium",
      ...payload.extra,
      timestamp: new Date().toISOString(),
    },
  });
}

export async function flushServerAnalytics() {
  if (!client) return;
  await client.flush();
}
