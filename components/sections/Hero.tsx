"use client";

import Image from "next/image";
import { useModal } from "@/contexts/ModalContext";

export default function Hero() {
  const { openEnquire } = useModal();

  return (
    <section
      id="home"
      style={{ position: "relative", width: "100%", minHeight: "58vh" }}
    >
      {/* Background — lower z-index, no pointer-events manipulation needed */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <Image
          src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1920&q=85"
          alt="MD Studio"
          fill
          priority
          sizes="100vw"
          style={{ objectFit: "cover", objectPosition: "center" }}
          unoptimized
        />
        <div
          className="hero-gradient"
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to right, rgba(255,255,255,0.93) 0%, rgba(255,255,255,0.82) 30%, rgba(255,255,255,0.35) 55%, rgba(255,255,255,0) 75%)",
          }}
        />
      </div>

      {/* Content — higher z-index, normal flow */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          minHeight: "58vh",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div
          className="hero-content"
          style={{
            paddingLeft: "clamp(25px, 5vw, 80px)",
            paddingRight: 16,
            maxWidth: 520,
          }}
        >
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(32px, 5vw, 60px)",
              fontWeight: 700,
              fontStyle: "italic",
              color: "#222",
              lineHeight: 1.2,
              margin: "0 0 10px",
            }}
          >
            MD Studio
          </h1>
          <p
            style={{
              fontSize: "clamp(14px, 1.8vw, 18px)",
              color: "#555",
              margin: "0 0 28px",
              letterSpacing: "0.04em",
            }}
          >
            the creator
          </p>
          <button
            onClick={() => openEnquire()}
            onTouchEnd={(e) => { e.preventDefault(); openEnquire(); }}
            style={{
              background: "#A0845C",
              color: "#fff",
              border: "none",
              borderRadius: 999,
              padding: "12px 32px",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              letterSpacing: "0.02em",
              boxShadow: "0 2px 8px rgba(160,132,92,0.4)",
              position: "relative",
              zIndex: 2,
            }}
          >
            Enquire Now
          </button>
        </div>
      </div>

      <style>{`
        @media (max-width: 767px) {
          .hero-gradient {
            background: rgba(255,255,255,0.88) !important;
          }
          .hero-content {
            padding-left: 20px !important;
            padding-right: 20px !important;
            max-width: 100% !important;
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
        }
      `}</style>
    </section>
  );
}
