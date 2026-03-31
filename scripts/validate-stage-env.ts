import "dotenv/config";

const stage = process.argv[2];
const envTarget = process.argv[3] ?? process.env.DEPLOY_ENV_TARGET ?? stage;

if (!stage) {
  console.error("Usage: bun scripts/validate-stage-env.ts <stage> [env-target]");
  process.exit(1);
}

const isProdTarget = envTarget === "production";

const required = [
  "AWS_HOST",
  "AWS_PORT",
  "AWS_DB_NAME",
  "BETTER_AUTH_SECRET",
  "NEXT_PUBLIC_MAPBOX_DARK_URL",
];

const stageRequired = isProdTarget
  ? ["AWS_PROD_PASSWORD"]
  : ["AWS_STAGING_PASSWORD"];

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
  (isProdTarget
    ? process.env.AWS_PROD_USER
    : (process.env.AWS_STAGING_USER ?? process.env.AWS_USER)) ??
  (isProdTarget ? "zotnfound_prod_user" : "zotnfound_staging_user");
const dbSchema = isProdTarget ? "public" : "dev";

console.log(
  JSON.stringify(
    {
      stage,
      envTarget,
      nodeEnv: "production",
      dbSchema,
      dbUser,
      betterAuthUrl: stage === "production"
        ? "https://zotnfound.com"
        : "https://clone.zotnfound.com",
    },
    null,
    2
  )
);
