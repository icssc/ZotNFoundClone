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
    const bucket = new sst.aws.Bucket("ItemImages", {
      access: "public",
    });
    const topic = new sst.aws.SnsTopic("SearchKeyword");
    new sst.aws.Nextjs("ZotNFound", {
      link: [bucket, topic],
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
