import { sendSMS } from "@/lib/sms/service";
import {
  findEmailsCore,
  getPhoneNumbersCorrespondingToEmails,
} from "./searchEmail";
import { SNSEvent } from "aws-lambda";

export const handler = async (event: SNSEvent) => {
  const { name, description, itemId } = JSON.parse(
    event.Records[0].Sns.Message
  );
  const emails = await findEmailsCore(name, description);
  const phoneNumbers = await getPhoneNumbersCorrespondingToEmails(emails);
  const uniqueNumbers = new Set<string>(phoneNumbers);
  for (const number of uniqueNumbers) {
    await sendSMS(
      `An item matching your saved search keyword(s) was found! View it at: https://zotnfound.com/${itemId}`,
      number
    );
  }

  return "done";
};
