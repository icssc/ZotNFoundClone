import "dotenv/config";

const stage = process.argv[2];

if (!stage) {
  console.error("Usage: bun scripts/validate-stage-env.ts <stage>");
  process.exit(1);
}

const isProd = stage === "production";

const required = [
  "AWS_HOST",
  "AWS_PORT",
  "AWS_DB_NAME",
  "BETTER_AUTH_SECRET",
  "NEXT_PUBLIC_MAPBOX_DARK_URL",
];

const stageRequired = isProd ? ["AWS_PROD_PASSWORD"] : ["AWS_STAGING_PASSWORD"];

const missing = [...required, ...stageRequired].filter(
  (name) => !process.env[name]
);

if (missing.length > 0) {
  console.error(
    `Missing required environment variables for ${stage}: ${missing.join(", ")}`
  );
  process.exit(1);
}

const dbUser =
  (isProd
    ? process.env.AWS_PROD_USER
    : (process.env.AWS_STAGING_USER ?? process.env.AWS_USER)) ??
  (isProd ? "zotnfound_prod_user" : "zotnfound_staging_user");
const dbSchema = isProd ? "public" : "dev";

console.log(
  JSON.stringify(
    {
      stage,
      nodeEnv: "production",
      dbSchema,
      dbUser,
      betterAuthUrl: isProd
        ? "https://zotnfound.com"
        : "https://clone.zotnfound.com",
    },
    null,
    2
  )
);
