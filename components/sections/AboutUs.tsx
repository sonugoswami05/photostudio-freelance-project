"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

const DEFAULT_IMG = "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800&q=80";

const DEFAULT_STATS = [
  { number: "500+", label: "Weddings Photographed" },
  { number: "8+",   label: "Years of Experience" },
  { number: "15+",  label: "Services Offered" },
  { number: "100%", label: "Client Satisfaction" },
];

export default function AboutUs() {
  const [aboutImg,  setAboutImg]  = useState(DEFAULT_IMG);
  const [imgError,  setImgError]  = useState(false);
  const [heading,   setHeading]   = useState("About Jaimin Modi Photography");
  const [subtitle,  setSubtitle]  = useState("Wedding & Candid Photographer · Kadi, Gujarat");
  const [para1,     setPara1]     = useState("Welcome to Jaimin Modi Photography — one of the most trusted photography studios in Kadi, Mehsana, Gujarat. We specialise in capturing life's most precious moments through authentic, artistic, and emotionally rich imagery.");
  const [para2,     setPara2]     = useState("From candid wedding photography and pre-wedding shoots to model portfolios, baby photography, and cinematic video — our studio brings creativity and passion to every frame. With years of experience serving clients across Kadi, Mehsana, Ahmedabad, and all of Gujarat, we understand how to tell your story beautifully.");
  const [stats,     setStats]     = useState(DEFAULT_STATS);

  useEffect(() => {
    supabase
      .from("site_config")
      .select("key, value")
      .in("key", ["about_image", "about_heading", "about_subtitle", "about_para1", "about_para2", "about_stats"])
      .then(({ data }) => {
        if (!data) return;
        const get = (k: string) => data.find((r) => r.key === k)?.value || "";
        if (get("about_image")) { setImgError(false); setAboutImg(get("about_image")); }
        if (get("about_heading"))  setHeading(get("about_heading"));
        if (get("about_subtitle")) setSubtitle(get("about_subtitle"));
        if (get("about_para1"))    setPara1(get("about_para1"));
        if (get("about_para2"))    setPara2(get("about_para2"));
        if (get("about_stats")) {
          try { setStats(JSON.parse(get("about_stats"))); } catch { /* keep default */ }
        }
      });
  }, []);

  const handleImgError = () => {
    if (aboutImg !== DEFAULT_IMG) {
      setImgError(true);
      setAboutImg(DEFAULT_IMG);
    }
  };

  return (
    <section
      id="about"
      className="section-about"
      aria-label="About Jaimin Modi Photography"
      style={{ padding: "60px 0" }}
      itemScope
      itemType="https://schema.org/AboutPage"
    >
      <div className="wrap">
        <div className="about-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }}>

          {/* Image */}
          <div style={{ position: "relative", width: "100%", aspectRatio: "4/3", borderRadius: 12, overflow: "hidden", background: "#e8e0d8", boxShadow: "0 8px 32px rgba(0,0,0,0.1)" }}>
            <Image
              src={imgError ? DEFAULT_IMG : aboutImg}
              alt="Jaimin Modi Photography studio — professional photographer in Kadi, Gujarat"
              fill
              sizes="(max-width: 767px) 100vw, 50vw"
              style={{ objectFit: "cover" }}
              loading="lazy"
              onError={handleImgError}
            />
          </div>

          {/* Text */}
          <div className="about-text" itemProp="description">
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(24px, 2.5vw, 38px)",
                fontWeight: 300, color: "#444",
                marginBottom: 16,
              }}
            >
              {heading}
            </h2>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#E8906D", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16 }}>
              {subtitle}
            </p>

            <p style={{ fontSize: 15, color: "#555", lineHeight: 1.85, marginBottom: 16 }}>
              {para1}
            </p>

            <p style={{ fontSize: 15, color: "#555", lineHeight: 1.85, marginBottom: 24 }}>
              {para2}
            </p>

            {/* Stats */}
            <div className="about-stats" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
              {stats.map((h) => (
                <div key={h.label} style={{ textAlign: "center", padding: "14px 8px", background: "#fef8f5", borderRadius: 10, border: "1px solid rgba(232,144,109,0.15)" }}>
                  <p style={{ fontSize: "clamp(20px, 2.5vw, 28px)", fontWeight: 800, color: "#E8906D", margin: "0 0 4px", fontFamily: "var(--font-display)" }}>{h.number}</p>
                  <p style={{ fontSize: 11, color: "#777", margin: 0, letterSpacing: "0.04em", lineHeight: 1.3 }}>{h.label}</p>
                </div>
              ))}
            </div>

            <a
              href="#contact"
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "#A0845C", color: "#fff", textDecoration: "none",
                borderRadius: 999, padding: "12px 28px",
                fontSize: 14, fontWeight: 600, letterSpacing: "0.02em",
                boxShadow: "0 2px 8px rgba(160,132,92,0.4)",
                transition: "opacity 0.2s",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.opacity = "0.85")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.opacity = "1")}
            >
              Book a Session
            </a>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 767px) {
          .about-grid { grid-template-columns: 1fr !important; gap: 28px !important; }
          .about-text  { text-align: center !important; }
          .about-text h2 { text-align: center !important; }
          .about-stats { grid-template-columns: repeat(2, 1fr) !important; }
          .about-text a { margin: 0 auto; }
        }
      `}</style>
    </section>
  );
}
