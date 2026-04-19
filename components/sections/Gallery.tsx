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

  useEffect(() => {
    supabase
      .from("gallery_images")
      .select("id, url, caption")
      .order("created_at", { ascending: false })
      .then(({ data }) => { if (data && data.length > 0) setImages(data); });
  }, []);

  const totalPages = Math.max(1, Math.ceil(images.length / PAGE_SIZE));
  const visible = images.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  return (
    <section id="gallery" style={{ padding: "45px 0", background: "#fff", borderTop: "1px solid #f0f0f0" }}>
      <div className="wrap">
        <h2 style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(24px, 2.5vw, 36px)",
          fontWeight: 300, color: "#444",
          textAlign: "center", marginBottom: 32,
        }}>
          Portfolio
        </h2>

        {images.length === 0 ? (
          <p style={{ textAlign: "center", color: "#aaa", fontSize: 15, padding: "40px 0" }}>
            No photos yet — upload your portfolio in the Admin panel.
          </p>
        ) : (
          <div className="gallery-wrapper" style={{ position: "relative", paddingLeft: 36, paddingRight: 36 }}>
            <button
              onClick={() => setPage((p) => (p - 1 + totalPages) % totalPages)}
              style={{
                position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)",
                width: 32, height: 32, borderRadius: "50%", background: "#fff",
                border: "1px solid #ddd", boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", zIndex: 10,
              }}
              aria-label="Previous"
            >
              <ChevronLeft size={16} color="#666" />
            </button>

            <div className="gallery-grid">
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
                width: 32, height: 32, borderRadius: "50%", background: "#fff",
                border: "1px solid #ddd", boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", zIndex: 10,
              }}
              aria-label="Next"
            >
              <ChevronRight size={16} color="#666" />
            </button>
          </div>
        )}

        <style>{`
          @media (max-width: 767px) {
            .gallery-wrapper { padding-left: 0 !important; padding-right: 0 !important; margin-left: -15px; margin-right: -15px; }
            .gallery-wrapper > button { display: none !important; }
            .gallery-dots { display: none !important; }
          }
          .gallery-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
          @media (max-width: 767px) {
            .gallery-grid { display: flex; overflow-x: auto; scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch; gap: 12px; padding-bottom: 4px; scrollbar-width: none; }
            .gallery-grid::-webkit-scrollbar { display: none; }
            .gallery-grid > div { flex: 0 0 85vw; height: 220px !important; scroll-snap-align: start; }
          }
        `}</style>

        {images.length > PAGE_SIZE && (
          <div className="gallery-dots" style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 20 }}>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button key={i} onClick={() => setPage(i)}
                style={{ width: 8, height: 8, borderRadius: "50%", border: "none", cursor: "pointer", padding: 0, background: i === page ? "#E8906D" : "#ccc" }} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
