import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { genericOAuth } from "better-auth/plugins";
import { db } from "@/db"; // your drizzle instance
import * as authSchema from "@/db/auth-schema";

const icsscDiscoveryUrl =
  process.env.ICSSC_AUTH_DISCOVERY_URL ??
  "https://auth.icssc.club/.well-known/openid-configuration";
const icsscClientId = process.env.ICSSC_AUTH_CLIENT_ID ?? "";
const icsscClientSecret = process.env.ICSSC_AUTH_CLIENT_SECRET ?? "";
const trustedOrigins = Array.from(
  new Set(
    [
      "http://localhost:3000",
      "https://clone.zotnfound.com",
      "https://zotnfound.com",
      process.env.BETTER_AUTH_URL,
    ].filter((origin): origin is string => Boolean(origin))
  )
);

const getFallbackName = (email?: string | null) => {
  if (!email) {
    return "ZotNFound User";
  }
  const [namePart] = email.split("@");
  return namePart || "ZotNFound User";
};

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins,
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 24,
    },
  },
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["icssc"],
      allowDifferentEmails: false,
    },
  },
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: authSchema,
  }),
  plugins: [
    genericOAuth({
      config: [
        {
          providerId: "icssc",
          clientId: icsscClientId,
          discoveryUrl: icsscDiscoveryUrl,
          redirectURI: process.env.BETTER_AUTH_URL
            ? `${process.env.BETTER_AUTH_URL}/api/auth/callback`
            : undefined,
          scopes: ["openid", "email", "profile"],
          pkce: true,
          mapProfileToUser: async (profile) => {
            const email =
              typeof profile.email === "string" ? profile.email : undefined;
            const name =
              typeof profile.name === "string" && profile.name
                ? profile.name
                : getFallbackName(email);
            const image =
              typeof profile.picture === "string" ? profile.picture : undefined;
            const emailVerified =
              typeof profile.email_verified === "boolean"
                ? profile.email_verified
                : false;
            const resolvedEmail =
              email ??
              (typeof profile.sub === "string" && profile.sub
                ? `${profile.sub}@icssc.local`
                : "");

            return {
              email: resolvedEmail,
              name,
              image,
              emailVerified,
            };
          },
          ...(icsscClientSecret ? { clientSecret: icsscClientSecret } : {}),
        },
      ],
    }),
  ],
});
