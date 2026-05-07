import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
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
    const formData = await req.formData();
    const file     = formData.get("file") as File | null;
    const folder   = formData.get("folder") as string | null;

    if (!file || !folder) {
      return NextResponse.json({ error: "Missing file or folder" }, { status: 400 });
    }

    const ext         = file.name.split(".").pop() ?? "jpg";
    const key         = `${folder}/${Date.now()}.${ext}`;
    const bucket      = process.env.CLOUDFLARE_R2_BUCKET!;
    const arrayBuffer = await file.arrayBuffer();
    const buffer      = Buffer.from(arrayBuffer);

    await R2.send(new PutObjectCommand({
      Bucket:      bucket,
      Key:         key,
      Body:        buffer,
      ContentType: file.type || "image/jpeg",
    }));

    const publicUrl = `${process.env.CLOUDFLARE_R2_PUBLIC_URL}/${key}`;
    return NextResponse.json({ publicUrl });

  } catch (err) {
    console.error("R2 upload error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
