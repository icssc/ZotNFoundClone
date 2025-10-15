"use server";

import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandInput
} from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";

// server uploads to s3 and returns public url
export default async function uploadImageToS3(base64Data: string): Promise<string> {
    const s3Client = new S3Client({
        region: "us-east-1", // not sure what this should be
    });  
    const type = "image/jpeg";
    const key = `uploads/${Date.now()}-${randomUUID()}.${type.split("/")[1]}`;

    const uploadParams: PutObjectCommandInput = {
        ACL: "public-read",
        Bucket: "zotnfound-rebecca-backend-bucketbucketf19722a9-byo4gmbw2dew", // replace with Bucket.bucket.bucketName
        Key: key,
        Body: base64Data,
        ContentType: type,
    };
    
    const uploadCommand = new PutObjectCommand(uploadParams);
    await s3Client.send(uploadCommand);

    const url = `https://zotnfound-rebecca-backend-bucketbucketf19722a9-byo4gmbw2dew.s3.amazonaws.com/${key}`;

    // const url = `https://${Bucket.bucket.bucketName}.s3.amazonaws.com/${key}`;
    return url;
}
