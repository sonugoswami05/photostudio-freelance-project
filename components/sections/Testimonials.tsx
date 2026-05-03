"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import testimonialsJson from "@/data/testimonials.json";

interface Testimonial {
  id:       string | number;
  name:     string;
  location: string;
  rating:   number;
  review:   string;
}

function getInitials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

function ThumbsUp() {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#E8906D" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" />
      <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
    </svg>
  );
}

export default function Testimonials() {
  const [items,   setItems]   = useState<Testimonial[]>([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await supabase
          .from("testimonials")
          .select("id, name, location, rating, review")
          .order("sort_order", { ascending: true });
        if (data && data.length > 0) setItems(data as Testimonial[]);
        else setItems(testimonialsJson as Testimonial[]);
      } catch {
        setItems(testimonialsJson as Testimonial[]);
      }
    })();
  }, []);

  useEffect(() => {
    if (items.length < 2) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % items.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [items.length]);

  if (!items.length) return null;

  const t = items[current];

  return (
    <section id="testimonials" className="section-testimonials" style={{ position: "relative", minHeight: 380 }}>
      <div style={{ position: "relative", zIndex: 1, padding: "60px 0 50px", display: "flex", flexDirection: "column", alignItems: "center" }}>

        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(26px, 3vw, 38px)", fontWeight: 400, color: "#fff", marginBottom: 32, textAlign: "center" }}>
          Testimonials
        </h2>

        <div key={current} style={{ maxWidth: 620, width: "100%", textAlign: "center", padding: "0 24px", animation: "fadeIn 0.5s ease" }}>
          {/* Avatar initials */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}>
            <div style={{
              width: 52, height: 52, borderRadius: "50%",
              background: "linear-gradient(135deg, #E8906D, #c96a3f)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontWeight: 800, fontSize: 16, letterSpacing: "0.04em",
              boxShadow: "0 0 20px rgba(232,144,109,0.4)",
            }}>
              {getInitials(t.name)}
            </div>
          </div>

          {/* Stars */}
          <div style={{ display: "flex", justifyContent: "center", gap: 3, marginBottom: 14, fontSize: 16, color: "#E8906D" }}>
            {Array.from({ length: t.rating ?? 5 }).map((_, i) => <span key={i}>★</span>)}
          </div>

          {/* Review text */}
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.78)", lineHeight: 1.85, marginBottom: 20, fontStyle: "italic" }}>
            &ldquo;{t.review}&rdquo;
          </p>

          {/* Name + location */}
          <p style={{ fontSize: 14, fontWeight: 700, color: "#E8906D", margin: "0 0 2px", letterSpacing: "0.05em" }}>
            {t.name}
          </p>
          {t.location && (
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", margin: 0 }}>{t.location}</p>
          )}
        </div>

        {/* Dots */}
        <div style={{ display: "flex", gap: 8, marginTop: 28 }}>
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              style={{
                width: i === current ? 24 : 8, height: 8, borderRadius: 4,
                border: "none", cursor: "pointer", padding: 0,
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
