import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextRequest, NextResponse } from "next/server";

const R2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId:     process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_KEY!,
  },
});

export async function POST(req: NextRequest) {
  try {
    const { folder, filename, contentType } = await req.json();

    if (!folder || !filename) {
      return NextResponse.json({ error: "Missing folder or filename" }, { status: 400 });
    }

    const key = `${folder}/${Date.now()}-${filename}`;
    const bucket = process.env.CLOUDFLARE_R2_BUCKET!;

    const command = new PutObjectCommand({
      Bucket:      bucket,
      Key:         key,
      ContentType: contentType || "image/jpeg",
    });

    // Presigned URL valid for 5 minutes
    const uploadUrl = await getSignedUrl(R2, command, { expiresIn: 300 });

    // Public URL for accessing the file after upload
    const publicUrl = `${process.env.CLOUDFLARE_R2_PUBLIC_URL}/${key}`;

    return NextResponse.json({ uploadUrl, publicUrl, key });
  } catch (err) {
    console.error("R2 presign error:", err);
    return NextResponse.json({ error: "Failed to generate upload URL" }, { status: 500 });
  }
}
