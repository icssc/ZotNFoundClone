import { Resend, type CreateEmailResponse } from "resend";
import {
  itemFoundTemplate,
  itemLostNotificationTemplate,
  generateItemUrl,
  getFromAddress,
  type EmailTemplateData,
} from "./templates";

const apiKey = process.env.RESEND_API_KEY ?? "";
const resend = new Resend(apiKey);

interface ItemData {
  id: number;
  name: string;
  type: string;
  image?: string;
  email?: string; // owner's email (provided by contact flow)
}

interface ItemFoundEmailParams {
  item: ItemData;
  finderName: string;
  finderEmail: string;
}

interface ItemLostEmailParams {
  item: ItemData;
  subscriberEmails: string[];
}

export const sendItemFoundEmail = async ({
  item,
  finderName,
  finderEmail,
}: ItemFoundEmailParams): Promise<CreateEmailResponse> => {
  const data: EmailTemplateData = {
    itemName: item.name,
    finderName,
    finderEmail,
    itemUrl: generateItemUrl(item.id),
    itemImage: item.image,
  };

  const ownerEmail = item.email;
  if (!ownerEmail) {
    throw new Error(
      "Owner email is required in item data for found notifications"
    );
  }

  const response: CreateEmailResponse = await resend.emails.send({
    from: getFromAddress(),
    to: ownerEmail,
    cc: finderEmail,
    subject: `🎉 Your ${item.name} has been found!`,
    html: itemFoundTemplate(data),
  });

  return response;
};

export const sendItemLostNotification = async ({
  item,
  subscriberEmails,
}: ItemLostEmailParams): Promise<CreateEmailResponse | null> => {
  if (subscriberEmails.length === 0) return null;

  const data: EmailTemplateData = {
    itemName: item.name,
    itemUrl: generateItemUrl(item.id),
    itemImage: item.image,
  };

  const response: CreateEmailResponse = await resend.emails.send({
    from: getFromAddress(),
    to: subscriberEmails,
    subject: `🔍 New ${item.type} lost: ${item.name}`,
    html: itemLostNotificationTemplate(data),
  });

  return response;
};
