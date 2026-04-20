"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

export default function LoadingScreen() {
  const [hiding, setHiding] = useState(false);
  const [gone, setGone] = useState(false);
  const [logoUrl, setLogoUrl] = useState("");

  useEffect(() => {
    supabase.from("site_config").select("value").eq("key", "logo").maybeSingle()
      .then(({ data }) => { if (data?.value) setLogoUrl(data.value); });
  }, []);

  useEffect(() => {
    const minTime = new Promise<void>((r) => setTimeout(r, 2600));
    const loaded = new Promise<void>((r) => {
      if (document.readyState === "complete") r();
      else window.addEventListener("load", () => r(), { once: true });
    });

    Promise.all([minTime, loaded]).then(() => {
      setHiding(true);
      setTimeout(() => setGone(true), 750);
    });
  }, []);

  if (gone) return null;

  return (
    <div className={`ls-wrap${hiding ? " ls-hide" : ""}`}>

      {/* Ambient orbs */}
      <div className="ls-orb ls-orb-1" />
      <div className="ls-orb ls-orb-2" />
      <div className="ls-orb ls-orb-3" />

      {/* Aperture ring + monogram */}
      <div className="ls-aperture-wrap">
        <div className="ls-ring ls-ring-outer" />
        <div className="ls-ring ls-ring-inner" />
        <div className="ls-center">
          {logoUrl ? (
            <Image src={logoUrl} alt="Logo" width={52} height={52}
              style={{ objectFit: "contain", borderRadius: 6 }} unoptimized />
          ) : (
            <span className="ls-monogram">NA</span>
          )}
        </div>
      </div>

      {/* Studio name */}
      <p className="ls-title">New Alankar Studio</p>
      <p className="ls-sub">Photography &amp; Studio</p>

      {/* Progress bar */}
      <div className="ls-bar-track">
        <div className="ls-bar-fill" />
      </div>

      {/* Dots */}
      <div className="ls-dots">
        <span className="ls-dot" style={{ animationDelay: "0s" }} />
        <span className="ls-dot" style={{ animationDelay: "0.2s" }} />
        <span className="ls-dot" style={{ animationDelay: "0.4s" }} />
      </div>

      <style>{`
        /* ── Wrapper ── */
        .ls-wrap {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: #07070d;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0;
          opacity: 1;
          transition: opacity 0.75s ease;
          overflow: hidden;
        }
        .ls-hide {
          opacity: 0;
          pointer-events: none;
        }

        /* ── Ambient orbs ── */
        .ls-orb {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          animation: lsOrbFloat linear infinite;
        }
        .ls-orb-1 {
          width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(232,144,109,0.09) 0%, transparent 65%);
          top: -160px; left: -100px;
          animation-duration: 14s;
        }
        .ls-orb-2 {
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(80,130,255,0.07) 0%, transparent 65%);
          bottom: -80px; right: -80px;
          animation-duration: 18s;
          animation-direction: reverse;
        }
        .ls-orb-3 {
          width: 300px; height: 300px;
          background: radial-gradient(circle, rgba(232,144,109,0.05) 0%, transparent 65%);
          top: 50%; right: 10%;
          animation-duration: 11s;
        }

        /* ── Aperture ── */
        .ls-aperture-wrap {
          position: relative;
          width: 120px; height: 120px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 28px;
          animation: lsFadeUp 0.7s ease both;
        }
        .ls-ring {
          position: absolute;
          border-radius: 50%;
          border: 2px solid transparent;
        }
        .ls-ring-outer {
          inset: 0;
          border-top-color: #E8906D;
          border-right-color: rgba(232,144,109,0.25);
          animation: lsSpin 1.4s linear infinite;
        }
        .ls-ring-inner {
          inset: 12px;
          border-bottom-color: rgba(232,144,109,0.5);
          border-left-color: rgba(232,144,109,0.15);
          animation: lsSpin 2.2s linear infinite reverse;
        }
        .ls-center {
          width: 72px; height: 72px;
          border-radius: 50%;
          background: rgba(232,144,109,0.08);
          border: 1px solid rgba(232,144,109,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          animation: lsPulse 2.2s ease-in-out infinite;
        }
        .ls-monogram {
          font-family: var(--font-display);
          font-size: 22px;
          font-weight: 700;
          font-style: italic;
          color: #E8906D;
          letter-spacing: 0.02em;
        }

        /* ── Text ── */
        .ls-title {
          font-family: var(--font-display);
          font-size: clamp(20px, 4vw, 30px);
          font-weight: 300;
          font-style: italic;
          color: #fff;
          margin: 0 0 6px;
          letter-spacing: 0.02em;
          text-align: center;
          animation: lsFadeUp 0.7s ease 0.2s both;
        }
        .ls-sub {
          font-size: 11px;
          color: rgba(255,255,255,0.35);
          letter-spacing: 0.3em;
          text-transform: uppercase;
          margin: 0 0 36px;
          text-align: center;
          animation: lsFadeUp 0.7s ease 0.35s both;
        }

        /* ── Progress bar ── */
        .ls-bar-track {
          width: 180px; height: 1.5px;
          background: rgba(255,255,255,0.08);
          border-radius: 2px;
          overflow: hidden;
          margin-bottom: 20px;
          animation: lsFadeUp 0.7s ease 0.45s both;
        }
        .ls-bar-fill {
          height: 100%;
          border-radius: 2px;
          background: linear-gradient(90deg, #E8906D, #F5C4AC, #E8906D);
          background-size: 200% 100%;
          animation: lsBarSlide 2.6s ease forwards, lsShimmer 1.4s linear infinite;
        }

        /* ── Dots ── */
        .ls-dots {
          display: flex;
          gap: 6px;
          animation: lsFadeUp 0.7s ease 0.55s both;
        }
        .ls-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: rgba(232,144,109,0.6);
          animation: lsDotPulse 1.2s ease-in-out infinite;
        }

        /* ── Keyframes ── */
        @keyframes lsSpin {
          to { transform: rotate(360deg); }
        }
        @keyframes lsPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(232,144,109,0); transform: scale(1); }
          50% { box-shadow: 0 0 24px 6px rgba(232,144,109,0.12); transform: scale(1.05); }
        }
        @keyframes lsOrbFloat {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25%  { transform: translate(30px, -25px) scale(1.05); }
          50%  { transform: translate(-20px, 30px) scale(0.95); }
          75%  { transform: translate(20px, 10px) scale(1.03); }
        }
        @keyframes lsFadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes lsBarSlide {
          0%   { width: 0%; }
          40%  { width: 55%; }
          70%  { width: 80%; }
          90%  { width: 92%; }
          100% { width: 100%; }
        }
        @keyframes lsShimmer {
          0%   { background-position: 100% 0; }
          100% { background-position: -100% 0; }
        }
        @keyframes lsDotPulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}
