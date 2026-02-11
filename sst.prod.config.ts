/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "zotnfoundclone",
      removal: "retain",
      protect: true,
      home: "aws",
    };
  },
  async run() {
    $transform(aws.lambda.FunctionUrl, (args, opts, name) => {
      new aws.lambda.Permission(`${name}InvokeUrlPermission`, {
        action: "lambda:InvokeFunctionUrl",
        function: args.functionName,
        principal: "*",
        functionUrlAuthType: args.authorizationType,
        statementId: `${name}InvokeUrlAllow`,
      });
      new aws.lambda.Permission(`${name}InvokePermission`, {
        action: "lambda:InvokeFunction",
        function: args.functionName,
        principal: "*",
        statementId: `${name}InvokeAllow`,
      });
    });

    const domain = "zotnfound.com";
    const bucket = new sst.aws.Bucket("ItemImages", {
      access: "public",
    });
    const topic = new sst.aws.SnsTopic("SearchKeyword");
    const site = new sst.aws.Nextjs("ZotNFound", {
      link: [bucket, topic],
      domain,
      warm: 1,
      openNextVersion: "https://pkg.pr.new/@opennextjs/aws@1107",
      environment: {
        NODE_ENV: "production",
        BETTER_AUTH_URL: `https://${domain}`,
        ICSSC_AUTH_DISCOVERY_URL:
          process.env.ICSSC_AUTH_DISCOVERY_URL ??
          "https://auth.icssc.club/.well-known/openid-configuration",
        ICSSC_AUTH_CLIENT_ID: "zotnfound",
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
