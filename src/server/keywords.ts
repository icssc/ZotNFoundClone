"use server";

import { SNSEvent, Context, SNSHandler, SNSEventRecord } from "aws-lambda";
import { sendSMS } from "@/lib/sms/service";
import { findEmailsSubscribedToKeywordsInFields } from "@/server/actions/search/lookup/action";

export const handler: SNSHandler = async (
  event: SNSEvent,
  context: Context
): Promise<void> => {
  for (const record of event.Records) {
    await processMessageAsync(record);
  }
  console.info("done");
};

async function processMessageAsync(record: SNSEventRecord): Promise<any> {
  try {
    const { name, description } = JSON.parse(record.Sns.Message);
    console.log(`Processing message for keyword: ${name}, ${description}`);

    const result = await findEmailsSubscribedToKeywordsInFields({
      name,
      description,
    });
    if (result.success) {
      const emails = result.data;
      console.log("Emails to notify:", emails);
      for (const email in emails) {
        // const result = await sendSMS("test", "#");
        console.log("Sent SMS to:", email);
      }
    }
  } catch (err) {
    console.error("An error occurred");
    throw err;
  }
}
