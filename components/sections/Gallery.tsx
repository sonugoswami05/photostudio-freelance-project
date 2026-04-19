"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface GalleryImage { id: string; url: string; caption: string | null; }

const PAGE_SIZE = 9;

export default function Gallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [page, setPage] = useState(0);
  const [mobileIndex, setMobileIndex] = useState(0);

  useEffect(() => {
    supabase
      .from("gallery_images")
      .select("id, url, caption")
      .order("created_at", { ascending: false })
      .then(({ data }) => { if (data && data.length > 0) setImages(data); });
  }, []);

  /* Auto-advance carousel on mobile every 1 second */
  useEffect(() => {
    if (images.length < 2) return;
    const timer = setInterval(() => {
      setMobileIndex((i) => (i + 1) % images.length);
    }, 1000);
    return () => clearInterval(timer);
  }, [images.length]);

  const totalPages = Math.max(1, Math.ceil(images.length / PAGE_SIZE));
  const visible = images.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  return (
    <section id="gallery" className="section-gallery" style={{ padding: "45px 0" }}>
      <div className="wrap" style={{ position: "relative", zIndex: 1 }}>
        <h2 style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(24px, 2.5vw, 36px)",
          fontWeight: 300, color: "#fff",
          textAlign: "center", marginBottom: 32,
        }}>
          Portfolio
        </h2>

        {images.length === 0 ? (
          <p style={{ textAlign: "center", color: "rgba(255,255,255,0.4)", fontSize: 15, padding: "40px 0" }}>
            No photos yet — upload your portfolio in the Admin panel.
          </p>
        ) : (
          <>
            {/* ── Desktop: 3×3 paginated grid ── */}
            <div className="gallery-desktop">
              <div className="gallery-wrapper" style={{ position: "relative", paddingLeft: 36, paddingRight: 36 }}>
                <button
                  onClick={() => setPage((p) => (p - 1 + totalPages) % totalPages)}
                  style={{
                    position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)",
                    width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.1)",
                    border: "1px solid rgba(255,255,255,0.2)", boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", zIndex: 10,
                  }}
                  aria-label="Previous"
                ><ChevronLeft size={16} color="#fff" /></button>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                  {visible.map((img) => (
                    <div key={img.id} style={{ position: "relative", height: 225, borderRadius: 8, overflow: "hidden", background: "#f0f0f0" }}>
                      <Image src={img.url} alt={img.caption || "Portfolio"} fill
                        sizes="33vw" style={{ objectFit: "cover" }} loading="lazy" unoptimized />
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setPage((p) => (p + 1) % totalPages)}
                  style={{
                    position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)",
                    width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.1)",
                    border: "1px solid rgba(255,255,255,0.2)", boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", zIndex: 10,
                  }}
                  aria-label="Next"
                ><ChevronRight size={16} color="#fff" /></button>
              </div>

              {totalPages > 1 && (
                <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 20 }}>
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button key={i} onClick={() => setPage(i)}
                      style={{ width: 8, height: 8, borderRadius: "50%", border: "none", cursor: "pointer", padding: 0, background: i === page ? "#E8906D" : "rgba(255,255,255,0.25)" }} />
                  ))}
                </div>
              )}
            </div>

            {/* ── Mobile: full-width auto-sliding carousel ── */}
            <div className="gallery-mobile">
              {/* Carousel card */}
              <div style={{
                borderRadius: 16, overflow: "hidden",
                boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
                background: "#111",
                margin: "0 -4px",
              }}>
                {/* Sliding track */}
                <div style={{
                  display: "flex",
                  transform: `translateX(-${mobileIndex * 100}%)`,
                  transition: "transform 0.5s cubic-bezier(0.4,0,0.2,1)",
                  willChange: "transform",
                }}>
                  {images.map((img, i) => (
                    <div key={img.id} style={{ flex: "0 0 100%", position: "relative", height: 320, background: "#000" }}>
                      <Image src={img.url} alt={img.caption || "Portfolio"} fill
                        sizes="100vw"
                        style={{ objectFit: "cover", opacity: 0.95 }}
                        priority={i === 0}
                        unoptimized />
                      {/* Bottom vignette */}
                      <div style={{
                        position: "absolute", bottom: 0, left: 0, right: 0, height: 90,
                        background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 100%)",
                        pointerEvents: "none",
                      }} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Dots */}
              <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 16, flexWrap: "wrap" }}>
                {images.map((_, i) => (
                  <button key={i} onClick={() => setMobileIndex(i)}
                    style={{
                      width: i === mobileIndex ? 24 : 8, height: 8,
                      borderRadius: 4, border: "none", cursor: "pointer", padding: 0,
                      background: i === mobileIndex ? "#E8906D" : "#ddd",
                      boxShadow: i === mobileIndex ? "0 0 8px rgba(232,144,109,0.7)" : "none",
                      transition: "all 0.35s ease",
                    }} />
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      <style>{`
        .gallery-desktop { display: block; }
        .gallery-mobile  { display: none; }
        @media (max-width: 767px) {
          .gallery-desktop { display: none; }
          .gallery-mobile  { display: block; }
        }
      `}</style>
    </section>
  );
}
