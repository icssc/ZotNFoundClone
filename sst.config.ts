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
    const icsscClientId = isProd ? "zotnfound" : "zotnfound-clone";
    const bucket = new sst.aws.Bucket("ItemImages", {
      access: "public",
    });
    const topic = new sst.aws.SnsTopic("SearchKeyword");
    const site = new sst.aws.Nextjs("ZotNFound", {
      link: [bucket, topic],
      domain,
      environment: {
        NODE_ENV: "production",
        BETTER_AUTH_URL: `https://${domain}`,
        ICSSC_AUTH_DISCOVERY_URL:
          process.env.ICSSC_AUTH_DISCOVERY_URL ??
          "https://auth.icssc.club/.well-known/openid-configuration",
        ICSSC_AUTH_CLIENT_ID: icsscClientId,
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
        AWS_USER: process.env.AWS_USER!,
        AWS_PASSWORD: process.env.AWS_PASSWORD!,
        AWS_HOST: process.env.AWS_HOST!,
        AWS_PORT: process.env.AWS_PORT!,
        AWS_DB_NAME: process.env.AWS_DB_NAME!,
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
