"use server";

import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandInput,
} from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import { Resource } from "sst/resource";

export default async function uploadImageToS3(file: File): Promise<string> {
  const s3Client = new S3Client({});
  const type = "image/webp";
  const key = `uploads/${Date.now()}-${randomUUID()}.${type.split("/")[1]}`;

  const uploadParams: PutObjectCommandInput = {
    Bucket: Resource.ItemImages.name,
    Key: key,
    Body: Buffer.from(await file.arrayBuffer()),
    ContentType: type,
  };

  const uploadCommand = new PutObjectCommand(uploadParams);
  await s3Client.send(uploadCommand);

  const url = `https://${Resource.ItemImages.name}.s3.amazonaws.com/${key}`;
  return url;
}
