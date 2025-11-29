import { sendSMS } from "@/lib/sms/service";
import { findEmailsCore } from "./searchEmail";

export const handler = async (event) => {
  const { name, description } = JSON.parse(event.Records[0].Sns.Message);
  const emails = await findEmailsCore(name, description);

  for (const email of emails) {
    await sendSMS("test", "#");
  }

  return "done";
};
