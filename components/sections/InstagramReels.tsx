"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Heart, MessageCircle, Send, Home, Search, User, X } from "lucide-react";

interface InstaReel {
  id:            string;
  thumbnail_url: string;
  permalink:     string;
  caption:       string;
  likes:         string;
}

const HANDLE    = "jaimin_modi_photography";
const REELS_URL = `https://www.instagram.com/${HANDLE}/reels/`;

/** Extract shortcode from permalink, e.g. https://www.instagram.com/reel/ABC123/ → ABC123 */
function shortcode(permalink: string): string {
  return permalink.replace(/\/$/, "").split("/").pop() ?? "";
}

export default function InstagramReels() {
  const [reels,      setReels]      = useState<InstaReel[]>([]);
  const [activeReel, setActiveReel] = useState<InstaReel | null>(null);
  const [opening,    setOpening]    = useState(false);
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

  // Close modal on Escape key
  const closeModal = useCallback(() => setActiveReel(null), []);
  useEffect(() => {
    if (!activeReel) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") closeModal(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [activeReel, closeModal]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = activeReel ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [activeReel]);

  if (!configured || !reels.length) return null;

  const openInstagram = (url: string) => {
    window.open(url, "_blank");
    setOpening(true);
    setTimeout(() => setOpening(false), 1500);
  };

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

          {/* ── Reel cards ── */}
          <div className="reels-scroll-wrapper">
            <div className="reels-row">
              {reels.map((r) => (
                <ReelCard
                  key={r.id}
                  reel={r}
                  onOpen={() => setActiveReel(r)}
                />
              ))}
            </div>
          </div>

          {/* ── See More ── */}
          <div style={{ textAlign: "center", marginTop: 48 }}>
            <button onClick={() => openInstagram(REELS_URL)} className="reels-see-more">
              SEE MORE
            </button>
          </div>

        </div>
      </section>

      {/* ── Reel player modal ── */}
      {activeReel && (
        <div className="reel-modal-backdrop" onClick={closeModal}>
          <div className="reel-modal-inner" onClick={(e) => e.stopPropagation()}>
            {/* Close button */}
            <button className="reel-modal-close" onClick={closeModal} aria-label="Close">
              <X size={20} color="#fff" />
            </button>

            {/* Instagram embed iframe */}
            <iframe
              src={`https://www.instagram.com/reel/${shortcode(activeReel.permalink)}/embed/`}
              width="340"
              height="600"
              frameBorder="0"
              scrolling="no"
              allowTransparency
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              style={{ display: "block", borderRadius: 16, border: "none" }}
            />

            {/* Open on Instagram link */}
            <a
              href={activeReel.permalink}
              target="_blank"
              rel="noopener noreferrer"
              className="reel-modal-ig-link"
              onClick={(e) => e.stopPropagation()}
            >
              Open on Instagram ↗
            </a>
          </div>
        </div>
      )}

      {/* ── Instagram loading overlay (See More only) ── */}
      {opening && (
        <div className="ig-overlay">
          <div className="ig-overlay-logo">JM</div>
          <div className="ig-overlay-spinner" />
          <p className="ig-overlay-label">Opening Instagram…</p>
        </div>
      )}

      <style>{`
        .reels-scroll-wrapper { overflow: visible; }
        .reels-row {
          display: flex; gap: 20px;
          justify-content: center; flex-wrap: wrap;
          padding-bottom: 4px;
        }
        .reels-see-more {
          background: #1a1a1a; color: #fff; border: none;
          padding: 15px 46px; border-radius: 3px;
          font-size: 12px; font-weight: 800; letter-spacing: 0.13em;
          text-transform: uppercase; cursor: pointer; font-family: inherit;
          transition: background 0.2s, transform 0.15s;
        }
        .reels-see-more:hover { background: #E8906D; transform: translateY(-2px); }

        /* ── Modal ── */
        .reel-modal-backdrop {
          position: fixed; inset: 0; z-index: 9999;
          background: rgba(0,0,0,0.88); backdrop-filter: blur(16px);
          display: flex; align-items: center; justify-content: center;
          animation: igFadeIn 0.22s ease;
        }
        .reel-modal-inner {
          position: relative;
          display: flex; flex-direction: column; align-items: center; gap: 14px;
        }
        .reel-modal-close {
          position: absolute; top: -44px; right: 0;
          width: 36px; height: 36px; border-radius: 50%;
          background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.2);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: background 0.2s;
        }
        .reel-modal-close:hover { background: rgba(232,144,109,0.6); }
        .reel-modal-ig-link {
          font-size: 12px; color: rgba(255,255,255,0.5);
          text-decoration: none; letter-spacing: 0.04em;
          transition: color 0.2s;
        }
        .reel-modal-ig-link:hover { color: #E8906D; }

        /* ── See More overlay ── */
        .ig-overlay {
          position: fixed; inset: 0; z-index: 10000;
          background: rgba(6,6,14,0.94); backdrop-filter: blur(14px);
          display: flex; align-items: center; justify-content: center;
          flex-direction: column; gap: 20px;
          animation: igFadeIn 0.28s ease;
        }
        .ig-overlay-logo {
          width: 74px; height: 74px; border-radius: 20px;
          background: linear-gradient(135deg, #E8906D, #c96a3f);
          display: flex; align-items: center; justify-content: center;
          color: #fff; font-weight: 800; font-size: 24px; letter-spacing: 0.05em;
          box-shadow: 0 0 52px rgba(232,144,109,0.55);
          animation: igPulse 1s ease infinite;
        }
        .ig-overlay-spinner {
          width: 38px; height: 38px;
          border: 2.5px solid rgba(232,144,109,0.18); border-top-color: #E8906D;
          border-radius: 50%; animation: igSpin 0.85s linear infinite;
        }
        .ig-overlay-label { font-size: 13px; color: rgba(255,255,255,0.38); margin: 0; letter-spacing: 0.05em; }

        @keyframes igFadeIn { from { opacity: 0; } to   { opacity: 1; } }
        @keyframes igPulse  { 0%,100% { transform: scale(1); } 50% { transform: scale(1.05); } }
        @keyframes igSpin   { to { transform: rotate(360deg); } }

        @media (max-width: 640px) {
          .reels-scroll-wrapper {
            margin: 0 -20px; padding: 0 20px 16px;
            overflow-x: auto; overflow-y: visible;
            scrollbar-width: none; -webkit-overflow-scrolling: touch;
          }
          .reels-scroll-wrapper::-webkit-scrollbar { display: none; }
          .reels-row { flex-wrap: nowrap !important; justify-content: flex-start !important; width: max-content; }
          .reel-modal-inner iframe { width: 92vw !important; height: 500px !important; }
        }
      `}</style>
    </>
  );
}

/* ──────────────────────────────────────────────────────────
   Phone mockup card
   ────────────────────────────────────────────────────────── */
function ReelCard({ reel, onOpen }: { reel: InstaReel; onOpen: () => void }) {
  return (
    <div
      onClick={onOpen}
      style={{ width: 168, flexShrink: 0, cursor: "pointer" }}
      title="Play reel"
    >
      <div
        style={{
          width: 168, borderRadius: 28, overflow: "hidden",
          border: "2.5px solid #1c1c1e", background: "#000",
          boxShadow: "0 10px 38px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.08)",
          transition: "transform 0.28s ease, box-shadow 0.28s ease",
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLElement;
          el.style.transform = "translateY(-8px) scale(1.025)";
          el.style.boxShadow = "0 28px 60px rgba(0,0,0,0.26)";
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLElement;
          el.style.transform = "";
          el.style.boxShadow = "0 10px 38px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.08)";
        }}
      >
        {/* ── Top bar ── */}
        <div style={{
          background: "#000", padding: "8px 13px 6px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <span style={{ color: "#fff", fontSize: 11, fontWeight: 700, letterSpacing: "0.02em" }}>Reels</span>
          <svg width="15" height="13" viewBox="0 0 24 22" fill="none">
            <path d="M23 18a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"
              stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="12" cy="12.5" r="3.5" stroke="white" strokeWidth="2"/>
          </svg>
        </div>

        {/* ── Thumbnail ── */}
        <div style={{ position: "relative", width: "100%", height: 284, background: "#0a0a0a", overflow: "hidden" }}>

          {reel.thumbnail_url ? (
            <Image
              src={reel.thumbnail_url}
              alt={reel.caption || "Instagram Reel — Jaimin Modi Photography"}
              fill
              style={{ objectFit: "cover" }}
              unoptimized
            />
          ) : (
            <div style={{
              position: "absolute", inset: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              background: "linear-gradient(160deg, #1a0800, #0a0a0a)",
            }}>
              <span style={{ fontSize: 28, opacity: 0.15 }}>🎬</span>
            </div>
          )}

          {/* Gradient overlay */}
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            background: "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.05) 50%, transparent 70%)",
          }} />

          {/* Play button */}
          <div style={{
            position: "absolute", top: "50%", left: "50%",
            transform: "translate(-50%,-50%)",
            width: 46, height: 46, borderRadius: "50%",
            background: "rgba(255,255,255,0.22)", backdropFilter: "blur(8px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 10,
            transition: "background 0.2s, transform 0.15s",
          }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "rgba(232,144,109,0.7)";
              (e.currentTarget as HTMLElement).style.transform = "translate(-50%,-50%) scale(1.1)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.22)";
              (e.currentTarget as HTMLElement).style.transform = "translate(-50%,-50%) scale(1)";
            }}
          >
            <div style={{ width: 0, height: 0, borderLeft: "14px solid #fff", borderTop: "8px solid transparent", borderBottom: "8px solid transparent", marginLeft: 3 }} />
          </div>

          {/* Right-side action icons */}
          <div style={{
            position: "absolute", right: 9, bottom: 52, zIndex: 10,
            display: "flex", flexDirection: "column", alignItems: "center", gap: 14,
          }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
              <Heart size={17} color="#fff" />
              {reel.likes && (
                <span style={{ fontSize: 9, color: "#fff", fontWeight: 700, textShadow: "0 1px 3px rgba(0,0,0,0.7)" }}>
                  {reel.likes}
                </span>
              )}
            </div>
            <MessageCircle size={17} color="#fff" />
            <Send size={17} color="#fff" />
          </div>

          {/* Username + Caption stacked */}
          <div style={{
            position: "absolute",
            bottom: 8, left: 8, right: 36, zIndex: 10,
            display: "flex", flexDirection: "column", gap: 4,
          }}>
            {reel.caption && (
              <p style={{
                fontSize: 9, color: "rgba(255,255,255,0.85)", margin: 0, lineHeight: 1.4,
                textShadow: "0 1px 3px rgba(0,0,0,0.7)",
                overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis",
              }}>
                {reel.caption}
              </p>
            )}
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{
                width: 19, height: 19, borderRadius: "50%",
                background: "linear-gradient(135deg, #E8906D, #c96a3f)",
                border: "1.5px solid rgba(255,255,255,0.35)",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <span style={{ fontSize: 7, color: "#fff", fontWeight: 800 }}>JM</span>
              </div>
              <span style={{
                fontSize: 9.5, color: "#fff", fontWeight: 700,
                textShadow: "0 1px 3px rgba(0,0,0,0.7)",
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}>
                jaimin_modi...
              </span>
            </div>
          </div>
        </div>

        {/* ── Bottom nav ── */}
        <div style={{
          background: "#000", borderTop: "0.5px solid #1e1e1e",
          padding: "7px 0 10px",
          display: "flex", justifyContent: "space-around", alignItems: "center",
        }}>
          <Home size={14} color="rgba(255,255,255,0.5)" />
          <Search size={14} color="rgba(255,255,255,0.5)" />
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.8">
            <rect x="2" y="2" width="20" height="20" rx="2"/>
            <line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/>
            <line x1="2" y1="12" x2="22" y2="12"/>
            <line x1="2" y1="7" x2="7" y2="7"/><line x1="17" y1="7" x2="22" y2="7"/>
            <line x1="17" y1="17" x2="22" y2="17"/><line x1="2" y1="17" x2="7" y2="17"/>
          </svg>
          <Heart size={14} color="rgba(255,255,255,0.5)" />
          <div style={{ width: 18, height: 18, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.35)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <User size={10} color="rgba(255,255,255,0.5)" />
          </div>
        </div>
      </div>
    </div>
  );
}
