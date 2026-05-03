import { NextResponse } from "next/server";

/**
 * GET /api/instagram
 * Fetches the latest Reels from @jaimin_modi_photography via Instagram Graph API.
 * Requires INSTAGRAM_ACCESS_TOKEN env var (long-lived token, valid 60 days).
 * Cached by Next.js ISR for 30 minutes to avoid hitting rate limits.
 */

const FIELDS = [
  "id",
  "media_type",
  "media_product_type",
  "thumbnail_url",
  "permalink",
  "caption",
  "like_count",
  "timestamp",
].join(",");

export async function GET() {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;

  if (!token) {
    return NextResponse.json({ reels: [], configured: false });
  }

  try {
    const res = await fetch(
      `https://graph.instagram.com/v21.0/me/media?fields=${FIELDS}&limit=20&access_token=${token}`,
      {
        // ISR: revalidate every 30 minutes
        next: { revalidate: 1800 },
      }
    );

    const json = await res.json();

    if (json.error) {
      console.error("[Instagram API]", json.error);
      return NextResponse.json(
        { reels: [], configured: true, error: json.error.message },
        { status: 200 } // still 200 so UI can show the error gracefully
      );
    }

    // Keep only Reels (videos), max 6
    const reels = ((json.data as Record<string, string>[]) || [])
      .filter(
        (m) =>
          m.media_type === "VIDEO" &&
          (!m.media_product_type || m.media_product_type === "REELS")
      )
      .slice(0, 6)
      .map((m) => ({
        id:            m.id,
        thumbnail_url: m.thumbnail_url ?? "",
        permalink:     m.permalink,
        caption:       m.caption ?? "",
        likes:         m.like_count != null ? String(m.like_count) : "",
      }));

    return NextResponse.json({ reels, configured: true });
  } catch (err) {
    console.error("[Instagram API] fetch failed", err);
    return NextResponse.json(
      { reels: [], configured: true, error: "Network error — try again later" },
      { status: 200 }
    );
  }
}
