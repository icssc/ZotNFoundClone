import {
  PublishCommand,
  PublishCommandInput,
  PublishCommandOutput,
} from "@aws-sdk/client-sns";
import { snsClient } from "@/lib/sms/client";

export async function sendSMS(
  message: string,
  phoneNumber: string
): Promise<PublishCommandOutput> {
  const params: PublishCommandInput = {
    Message: message,
    PhoneNumber: phoneNumber,
  };
  const result = await snsClient.send(new PublishCommand(params));
  return result;
}
