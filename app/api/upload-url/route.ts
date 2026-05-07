import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 30;

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
    // Accept JSON body with base64-encoded file
    const { folder, filename, contentType, base64 } = await req.json();

    if (!folder || !base64) {
      return NextResponse.json({ error: "Missing folder or base64 data" }, { status: 400 });
    }

    const buffer  = Buffer.from(base64, "base64");
    const ext     = (filename ?? "file").split(".").pop() ?? "jpg";
    const key     = `${folder}/${Date.now()}.${ext}`;
    const bucket  = process.env.CLOUDFLARE_R2_BUCKET!;

    await R2.send(new PutObjectCommand({
      Bucket:      bucket,
      Key:         key,
      Body:        buffer,
      ContentType: contentType || "image/jpeg",
    }));

    const publicUrl = `${process.env.CLOUDFLARE_R2_PUBLIC_URL}/${key}`;
    return NextResponse.json({ publicUrl });

  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("R2 upload error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
