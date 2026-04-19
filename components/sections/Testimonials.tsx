"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import testimonialsData from "@/data/testimonials.json";

const BG_IMAGE = "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1600&q=80";

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
    <section id="testimonials" style={{ position: "relative", minHeight: 380 }}>
      {/* Background at z-index 0 */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <Image
          src={BG_IMAGE}
          alt="Testimonials background"
          fill
          sizes="100vw"
          style={{ objectFit: "cover", objectPosition: "center" }}
          loading="lazy"
          unoptimized
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to right, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.97) 22%, rgba(255,255,255,0.97) 78%, rgba(255,255,255,0.55) 100%)",
          }}
        />
      </div>

      {/* Content at z-index 1 */}
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
            color: "#333",
            marginBottom: 32,
            textAlign: "center",
          }}
        >
          Testimonials
        </h2>

        <div
          key={current}
          style={{
            maxWidth: 600,
            width: "100%",
            textAlign: "center",
            padding: "0 24px",
            animation: "fadeIn 0.5s ease",
          }}
        >
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
            <ThumbsUp />
          </div>
          <p style={{ fontSize: 15, color: "#555", lineHeight: 1.75, marginBottom: 20, fontStyle: "italic" }}>
            {t.review}
          </p>
          <p style={{ fontSize: 15, fontWeight: 700, color: "#333", margin: 0 }}>
            {t.name}
          </p>
        </div>

        <div style={{ display: "flex", gap: 8, marginTop: 24 }}>
          {testimonialsData.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                border: "none",
                cursor: "pointer",
                padding: 0,
                background: i === current ? "#555" : "#bbb",
                transition: "background 0.3s",
              }}
              aria-label={`Testimonial ${i + 1}`}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
