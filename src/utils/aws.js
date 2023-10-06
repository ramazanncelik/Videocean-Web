import { S3 } from "aws-sdk";

export const s3 = new S3({
  accessKeyId: 'AKIAUTG57LHEM6LZ4FNZ',
  secretAccessKey: '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',
  region: 'us-west-2',
});

export const bucketName = 'fyuzion-app';