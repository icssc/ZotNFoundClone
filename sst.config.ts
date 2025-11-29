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
    });
    topic.subscribe("SearchKeywordSubscriber", {
      handler: "src/server/keywords.handler",
      permissions: [
        {
          actions: ["sns:Publish"],
          resources: ["*"],
        },
      ],
    });
  },
});
