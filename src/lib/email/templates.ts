export interface EmailTemplateData {
  itemName: string;
  finderName?: string;
  finderEmail?: string;
  itemUrl: string;
  itemImage?: string;
}

export const itemFoundTemplate = (data: EmailTemplateData) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Item Has Been Found!</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: #ddff95; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 20px;">
    <h1 style="margin: 0; color: #000;">🎉 Great News!</h1>
    <p style="margin: 10px 0 0 0; font-size: 18px; color: #000;">Someone found your item!</p>
  </div>

  <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
    ${data.itemImage ? `<img src="${data.itemImage}" alt="${data.itemName}" style="width: 100%; max-width: 200px; height: auto; border-radius: 8px; margin-bottom: 15px;">` : ""}
    <h2 style="margin: 0 0 10px 0; color: #333;">${data.itemName}</h2>
    ${data.finderName ? `<p style="margin: 5px 0;"><strong>Found by:</strong> ${data.finderName}</p>` : ""}
    ${data.finderEmail ? `<p style="margin: 5px 0;"><strong>Contact:</strong> ${data.finderEmail}</p>` : ""}
  </div>

  <div style="text-align: center; margin: 20px 0;">
    <a href="${data.itemUrl}" style="background: #ddff95; color: #000; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">View Item Details</a>
  </div>

  <div style="text-align: center; color: #666; font-size: 14px; margin-top: 30px;">
    <p>Thanks for using ZotNFound! 🐻</p>
    <p><a href="https://zotnfound.com" style="color: #666;">zotnfound.com</a></p>
  </div>
</body>
</html>
`;

export const itemLostNotificationTemplate = (data: EmailTemplateData) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Lost Item Alert</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: #282828; color: #ddff95; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 20px;">
    <h1 style="margin: 0;">🔍 New Lost Item</h1>
    <p style="margin: 10px 0 0 0; font-size: 18px;">Someone lost an item you might have seen!</p>
  </div>

  <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
    ${data.itemImage ? `<img src="${data.itemImage}" alt="${data.itemName}" style="width: 100%; max-width: 200px; height: auto; border-radius: 8px; margin-bottom: 15px;">` : ""}
    <h2 style="margin: 0 0 10px 0; color: #333;">${data.itemName}</h2>
    <p style="margin: 5px 0; color: #666;">Have you seen this item? Help a fellow Anteater!</p>
  </div>

  <div style="text-align: center; margin: 20px 0;">
    <a href="${data.itemUrl}" style="background: #3498db; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Help Find This Item</a>
  </div>

  <div style="text-align: center; color: #666; font-size: 14px; margin-top: 30px;">
    <p>Thanks for being part of the ZotNFound community! 🐻</p>
    <p><a href="https://zotnfound.com/keywords" style="color: #666;">Manage your keyword alerts</a></p>
  </div>
</body>
</html>
`;

export const generateItemUrl = (
  itemId: number,
  baseUrl = "https://zotnfound.com"
): string => `${baseUrl}/item/${itemId}`;

export const getFromAddress = (): string =>
  process.env.NEXT_PUBLIC_APP_EMAIL ?? "example@email.com";
