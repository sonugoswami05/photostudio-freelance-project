"use client";

import { useState, useEffect } from "react";

interface InstaReel {
  id:        string;
  permalink: string;
  caption:   string;
}

const HANDLE    = "jaimin_modi_photography";
const REELS_URL = `https://www.instagram.com/${HANDLE}/reels/`;

/** Extract shortcode from permalink, e.g. https://www.instagram.com/reel/ABC123/ → ABC123 */
function shortcode(permalink: string): string {
  return permalink.replace(/\/$/, "").split("/").pop() ?? "";
}

export default function InstagramReels() {
  const [reels,      setReels]      = useState<InstaReel[]>([]);
  const [configured, setConfigured] = useState(true);

  useEffect(() => {
    fetch("/api/instagram")
      .then((r) => r.json())
      .then((json) => {
        setConfigured(json.configured !== false);
        if (json.reels?.length) setReels(json.reels);
      })
      .catch(() => {});
  }, []);

  if (!configured || !reels.length) return null;

  return (
    <>
      <section id="reels" style={{ padding: "72px 0 64px", background: "#f8f7f5" }}>
        <div className="wrap">

          {/* ── Heading ── */}
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <p style={{
              fontSize: 11, fontWeight: 700, color: "#E8906D",
              letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 12,
            }}>
              @{HANDLE}
            </p>
            <h2 style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(32px, 5vw, 58px)",
              fontWeight: 300, color: "#1e1e1e",
              margin: "0 0 16px", lineHeight: 1.05, letterSpacing: "-0.01em",
            }}>
              INSTAGRAM{" "}
              <em style={{ fontStyle: "italic", fontWeight: 400, color: "#E8906D" }}>reels</em>
            </h2>
            <p style={{ fontSize: 14, color: "#888", margin: "0 auto", maxWidth: 430, lineHeight: 1.7 }}>
              We splatter the moments in a brief frame of time —{" "}
              <em>call it a teaser if you may</em>
            </p>
          </div>

          {/* ── Embed row ── */}
          <div className="reels-scroll-wrapper">
            <div className="reels-embed-row">
              {reels.map((r) => (
                <div key={r.id} className="reel-embed-card">
                  <iframe
                    src={`https://www.instagram.com/reel/${shortcode(r.permalink)}/embed/`}
                    width="320"
                    height="560"
                    frameBorder="0"
                    scrolling="no"
                    allowTransparency
                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                    style={{ display: "block", borderRadius: 12, border: "none" }}
                    title={r.caption || "Instagram Reel"}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* ── See More ── */}
          <div style={{ textAlign: "center", marginTop: 48 }}>
            <a
              href={REELS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="reels-see-more"
            >
              SEE MORE
            </a>
          </div>

        </div>
      </section>

      <style>{`
        .reels-scroll-wrapper {
          overflow-x: auto;
          overflow-y: visible;
          scrollbar-width: none;
          -webkit-overflow-scrolling: touch;
          margin: 0 -12px;
          padding: 8px 12px 16px;
        }
        .reels-scroll-wrapper::-webkit-scrollbar { display: none; }

        .reels-embed-row {
          display: flex;
          gap: 16px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .reel-embed-card {
          flex-shrink: 0;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(0,0,0,0.12);
          background: #fff;
        }

        .reels-see-more {
          display: inline-block;
          background: #1a1a1a; color: #fff;
          padding: 15px 46px; border-radius: 3px;
          font-size: 12px; font-weight: 800; letter-spacing: 0.13em;
          text-transform: uppercase; text-decoration: none; font-family: inherit;
          transition: background 0.2s, transform 0.15s;
        }
        .reels-see-more:hover { background: #E8906D; transform: translateY(-2px); }

        @media (max-width: 768px) {
          .reels-embed-row {
            flex-wrap: nowrap;
            justify-content: flex-start;
            width: max-content;
          }
          .reel-embed-card iframe {
            width: 280px !important;
            height: 500px !important;
          }
        }
      `}</style>
    </>
  );
}
