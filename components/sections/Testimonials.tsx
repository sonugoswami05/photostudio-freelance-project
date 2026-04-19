"use client";

import { useState, useEffect } from "react";
import testimonialsData from "@/data/testimonials.json";

function ThumbsUp() {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#E8906D" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" />
      <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
    </svg>
  );
}

export default function Testimonials() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonialsData.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const t = testimonialsData[current];

  return (
    <section id="testimonials" className="section-testimonials" style={{ position: "relative", minHeight: 380 }}>
      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          padding: "60px 0 50px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(26px, 3vw, 38px)",
            fontWeight: 400,
            color: "#fff",
            marginBottom: 32,
            textAlign: "center",
          }}
        >
          Testimonials
        </h2>

        <div
          key={current}
          style={{
            maxWidth: 620,
            width: "100%",
            textAlign: "center",
            padding: "0 24px",
            animation: "fadeIn 0.5s ease",
          }}
        >
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
            <ThumbsUp />
          </div>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.78)", lineHeight: 1.85, marginBottom: 20, fontStyle: "italic" }}>
            "{t.review}"
          </p>
          <p style={{ fontSize: 14, fontWeight: 700, color: "#E8906D", margin: "0 0 4px", letterSpacing: "0.05em" }}>
            {t.name}
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 2, color: "#E8906D", fontSize: 13 }}>
            ★★★★★
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, marginTop: 28 }}>
          {testimonialsData.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              style={{
                width: i === current ? 24 : 8,
                height: 8,
                borderRadius: 4,
                border: "none",
                cursor: "pointer",
                padding: 0,
                background: i === current ? "#E8906D" : "rgba(255,255,255,0.25)",
                transition: "all 0.35s ease",
                boxShadow: i === current ? "0 0 8px rgba(232,144,109,0.7)" : "none",
              }}
              aria-label={`Testimonial ${i + 1}`}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
