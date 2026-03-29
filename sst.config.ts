/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "zotnfoundclone",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
    };
  },
  async run() {
    const requireEnv = (name: string) => {
      const value = process.env[name];
      if (!value) {
        throw new Error(`Missing required environment variable: ${name}`);
      }
      return value;
    };

    const getFirstEnv = (...names: string[]) => {
      for (const name of names) {
        const value = process.env[name];
        if (value) {
          return value;
        }
      }
      return undefined;
    };

    $transform(aws.lambda.FunctionUrl, (args, opts, name) => {
      // Allow the function to be invoked via the URL, (AWS Lambda URL allowed by default)
      new aws.lambda.Permission(`${name}InvokeUrlPermission`, {
        action: "lambda:InvokeFunctionUrl",
        function: args.functionName,
        principal: "*",
        functionUrlAuthType: args.authorizationType,
        statementId: `${name}InvokeUrlAllow`,
      });
      // Allow the function to be invoked via the API Gateway (AWS API Gateway allowed)
      new aws.lambda.Permission(`${name}InvokePermission`, {
        action: "lambda:InvokeFunction",
        function: args.functionName,
        principal: "*",
        statementId: `${name}InvokeAllow`,
      });
    });

    const isProd = $app.stage === "production";
    const domain = isProd ? "zotnfound.com" : "clone.zotnfound.com";
    const dbSchema = isProd ? "public" : "dev";
    const dbUser = isProd
      ? (getFirstEnv("AWS_PROD_USER") ?? "zotnfound_prod_user")
      : (getFirstEnv("AWS_STAGING_USER", "AWS_USER") ??
        "zotnfound_staging_user");
    const dbPassword = isProd
      ? getFirstEnv("AWS_PROD_PASSWORD")
      : getFirstEnv("AWS_STAGING_PASSWORD", "AWS_PASSWORD");

    if (!dbPassword) {
      throw new Error(
        `Missing required database password for ${$app.stage}. ` +
          `Set ${isProd ? "AWS_PROD_PASSWORD" : "AWS_STAGING_PASSWORD"} in your environment.`
      );
    }

    const icsscClientId = isProd
      ? (getFirstEnv("ICSSC_AUTH_PROD_CLIENT_ID") ?? "zotnfound")
      : (getFirstEnv("ICSSC_AUTH_STAGING_CLIENT_ID") ?? "zotnfound-clone");
    const icsscClientSecret = isProd
      ? getFirstEnv("ICSSC_AUTH_PROD_CLIENT_SECRET", "ICSSC_AUTH_CLIENT_SECRET")
      : getFirstEnv(
          "ICSSC_AUTH_STAGING_CLIENT_SECRET",
          "ICSSC_AUTH_CLIENT_SECRET"
        );

    const sharedDbEnvironment = {
      AWS_USER: dbUser,
      AWS_PASSWORD: dbPassword,
      AWS_HOST: requireEnv("AWS_HOST"),
      AWS_PORT: requireEnv("AWS_PORT"),
      AWS_DB_NAME: requireEnv("AWS_DB_NAME"),
      DB_SCHEMA: dbSchema,
    };

    const bucket = new sst.aws.Bucket("ItemImages", {
      access: "public",
    });
    const topic = new sst.aws.SnsTopic("SearchKeyword");
    const _site = new sst.aws.Nextjs("ZotNFound", {
      link: [bucket, topic],
      domain,
      openNextVersion: "https://pkg.pr.new/@opennextjs/aws@main",
      environment: {
        ...sharedDbEnvironment,
        NODE_ENV: "production",
        APP_STAGE: $app.stage,
        BETTER_AUTH_URL: `https://${domain}`,
        BETTER_AUTH_SECRET: requireEnv("BETTER_AUTH_SECRET"),
        ICSSC_AUTH_DISCOVERY_URL:
          process.env.ICSSC_AUTH_DISCOVERY_URL ??
          "https://auth.icssc.club/.well-known/openid-configuration",
        ICSSC_AUTH_CLIENT_ID: icsscClientId,
        ICSSC_AUTH_CLIENT_SECRET: icsscClientSecret,
        NEXT_PUBLIC_APP_EMAIL:
          process.env.NEXT_PUBLIC_APP_EMAIL ?? "zotnfound-admin@zotnfound.com",
        NEXT_PUBLIC_MAPBOX_DARK_URL: requireEnv("NEXT_PUBLIC_MAPBOX_DARK_URL"),
        NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN:
          process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN ?? "",
        NEXT_PUBLIC_MAPBOX_STYLE_URL:
          process.env.NEXT_PUBLIC_MAPBOX_STYLE_URL ?? "",
        NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY ?? "",
        NEXT_PUBLIC_POSTHOG_HOST:
          process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com",
        POSTHOG_API_KEY: process.env.POSTHOG_API_KEY ?? "",
        POSTHOG_HOST: process.env.POSTHOG_HOST ?? "https://us.i.posthog.com",
        RESEND_API_KEY: process.env.RESEND_API_KEY ?? "",
        SEARCH_KEYWORD_TOPIC_ARN: topic.arn,
      },
      permissions: [
        {
          actions: ["sns:Publish"],
          resources: ["*"],
        },
      ],
    });

    topic.subscribe("SearchKeywordSubscriber", {
      handler: "src/server/keywords.handler",
      environment: {
        ...sharedDbEnvironment,
        NODE_ENV: "production",
      },
      permissions: [
        {
          actions: ["sns:Publish"],
          resources: ["*"],
        },
      ],
    });
  },
});
