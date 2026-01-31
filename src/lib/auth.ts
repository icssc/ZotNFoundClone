import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db"; // your drizzle instance
import * as authSchema from "@/db/auth-schema";

export const auth = betterAuth({
  trustedOrigins: ["https://localhost:3000", "https://*.cloudfront.net"],
  session: {
    cookie: {
      // Do NOT set `domain` here when running on CloudFront or in dev.
      // Leaving `domain` out ensures the cookie is scoped to the current origin,
      // preventing browsers from rejecting it due to an invalid Domain attribute.
      secure: true,
      sameSite: "lax",
      path: "/",
    },
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 24,
    },
  },
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: authSchema,
  }),
  socialProviders: {
    google: {
      prompt: "select_account",
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
});
