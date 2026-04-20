"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useModal } from "@/contexts/ModalContext";
import { supabase } from "@/lib/supabase";
import servicesData from "@/data/services.json";

interface Service { id: string; title: string; description: string; image_url: string; sort_order: number; }

const fallback: Service[] = servicesData.map((s, i) => ({
  id: String(s.id), title: s.title, description: s.description, image_url: s.image, sort_order: i,
}));

export default function Services() {
  const { openEnquire } = useModal();
  const [services, setServices] = useState<Service[]>(fallback);

  useEffect(() => {
    supabase.from("services").select("*").order("sort_order", { ascending: true })
      .then(({ data, error }) => { if (!error && data && data.length > 0) setServices(data); });
  }, []);

  const chunkSize = 5;
  const rows: Service[][] = [];
  for (let i = 0; i < services.length; i += chunkSize) rows.push(services.slice(i, i + chunkSize));

  return (
    <section id="services" className="section-services" style={{ padding: "45px 0" }}>
      <div className="wrap">
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(24px, 2.5vw, 36px)",
            fontWeight: 300,
            color: "#444",
            textAlign: "center",
            marginBottom: 32,
          }}
        >
          We Offer
        </h2>

        {rows.map((row, ri) => (
          <div key={ri} className="services-grid" style={{ marginBottom: ri < rows.length - 1 ? 20 : 0 }}>
            {row.map((s) => (
              <ServiceCard key={s.id} service={s} onEnquire={openEnquire} />
            ))}
          </div>
        ))}
      </div>

      <style>{`
        .services-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 20px;
        }
        @media (max-width: 767px) {
          .services-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 14px;
          }
          .svc-img { height: 120px !important; }
        }
        @media (min-width: 768px) and (max-width: 1023px) {
          .services-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 16px;
          }
          .svc-img { height: 140px !important; }
        }
      `}</style>
    </section>
  );
}

function ServiceCard({
  service,
  onEnquire,
}: {
  service: Service;
  onEnquire: (s: string) => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
      <div className="svc-img" style={{ width: "100%", height: 165, overflow: "hidden", borderRadius: 8, marginBottom: 10, position: "relative", background: "#f5f5f5" }}>
        <Image
          src={service.image_url}
          alt={service.title}
          fill
          sizes="(max-width: 768px) 50vw, 20vw"
          style={{ objectFit: "cover" }}
          loading="lazy"
          unoptimized
        />
      </div>

      <h3 style={{ fontSize: 14, fontWeight: 600, color: "#333", marginBottom: 6, lineHeight: 1.4, padding: "0 4px" }}>
        {service.title}
      </h3>

      <p style={{ fontSize: 12, color: "#777", lineHeight: 1.6, marginBottom: 12, padding: "0 4px" }}>
        {service.description}
      </p>

      <button
        onClick={() => onEnquire(service.title)}
        style={{
          background: "#A0845C",
          border: "none",
          borderRadius: 999,
          padding: "6px 20px",
          fontSize: 12,
          fontWeight: 500,
          color: "#fff",
          cursor: "pointer",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
      >
        Enquire Now
      </button>
    </div>
  );
}
