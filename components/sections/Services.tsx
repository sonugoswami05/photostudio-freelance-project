"use client";

import Image from "next/image";
import { useModal } from "@/contexts/ModalContext";
import servicesData from "@/data/services.json";

export default function Services() {
  const { openEnquire } = useModal();

  const row1 = servicesData.slice(0, 5);
  const row2 = servicesData.slice(5, 10);

  return (
    <section id="services" style={{ padding: "45px 0", background: "#fff", borderTop: "1px solid #f0f0f0" }}>
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

        {/* Row 1 */}
        <div className="services-grid" style={{ marginBottom: 20 }}>
          {row1.map((s) => (
            <ServiceCard key={s.id} service={s} onEnquire={openEnquire} />
          ))}
        </div>

        {/* Row 2 */}
        <div className="services-grid">
          {row2.map((s) => (
            <ServiceCard key={s.id} service={s} onEnquire={openEnquire} />
          ))}
        </div>
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
  service: { id: number; title: string; description: string; image: string };
  onEnquire: (s: string) => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
      {/* Image — exactly 165px tall as in reference */}
      <div className="svc-img" style={{ width: "100%", height: 165, overflow: "hidden", borderRadius: 8, marginBottom: 10, position: "relative", background: "#f5f5f5" }}>
        <Image
          src={service.image}
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
