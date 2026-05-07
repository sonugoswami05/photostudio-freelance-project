import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl }               from "@aws-sdk/s3-request-presigner";
import { NextRequest, NextResponse }  from "next/server";

export const maxDuration = 30;

const ACCOUNT_ID  = process.env.CLOUDFLARE_R2_ACCOUNT_ID  || "a22e1c29a8e14fd58319b3b81663414a";
const ACCESS_KEY  = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || "e5fe083f0486c74793de0597503a2804";
const SECRET_KEY  = process.env.CLOUDFLARE_R2_SECRET_KEY   || "2f6149f32b63316be43f646e59b09985b48542240261069a8d2cd6a602c81f6c";
const BUCKET      = process.env.CLOUDFLARE_R2_BUCKET       || "studio-images";
const PUB_URL     = process.env.CLOUDFLARE_R2_PUBLIC_URL   || "https://pub-698ac57851a9467e9ef80ad4e6424aca.r2.dev";

const R2 = new S3Client({
  region:   "auto",
  endpoint: `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId: ACCESS_KEY, secretAccessKey: SECRET_KEY },
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { folder, filename, contentType } = body;

    if (!folder || !filename) {
      return NextResponse.json({ error: "Missing folder or filename" }, { status: 400 });
    }

    const ext = filename.split(".").pop() ?? "bin";
    const key = `${folder}/${Date.now()}.${ext}`;

    // ── Video: return presigned URL for direct browser → R2 upload ──
    if (body.presign) {
      const command   = new PutObjectCommand({ Bucket: BUCKET, Key: key, ContentType: contentType });
      const uploadUrl = await getSignedUrl(R2, command, { expiresIn: 300 });
      const publicUrl = `${PUB_URL}/${key}`;
      return NextResponse.json({ uploadUrl, publicUrl });
    }

    // ── Image: server-side upload via base64 ──
    const { base64 } = body;
    if (!base64) return NextResponse.json({ error: "Missing base64 data" }, { status: 400 });

    const buffer = Buffer.from(base64, "base64");
    await R2.send(new PutObjectCommand({
      Bucket:      BUCKET,
      Key:         key,
      Body:        buffer,
      ContentType: contentType || "image/jpeg",
    }));

    return NextResponse.json({ publicUrl: `${PUB_URL}/${key}` });

  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("R2 upload error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
