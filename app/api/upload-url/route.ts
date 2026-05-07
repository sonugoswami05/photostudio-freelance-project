import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 30;

const R2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CLOUDFLARE_R2_ACCOUNT_ID || "a22e1c29a8e14fd58319b3b81663414a"}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId:     process.env.CLOUDFLARE_R2_ACCESS_KEY_ID     || "e5fe083f0486c74793de0597503a2804",
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_KEY        || "2f6149f32b63316be43f646e59b09985b48542240261069a8d2cd6a602c81f6c",
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
    const bucket  = process.env.CLOUDFLARE_R2_BUCKET || "studio-images";
    const pubUrl  = process.env.CLOUDFLARE_R2_PUBLIC_URL || "https://pub-698ac57851a9467e9ef80ad4e6424aca.r2.dev";

    await R2.send(new PutObjectCommand({
      Bucket:      bucket,
      Key:         key,
      Body:        buffer,
      ContentType: contentType || "image/jpeg",
    }));

    const publicUrl = `${pubUrl}/${key}`;
    return NextResponse.json({ publicUrl });

  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("R2 upload error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
