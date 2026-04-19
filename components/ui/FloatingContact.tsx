"use client";

import { useState } from "react";
import { ChevronUp } from "lucide-react";

export default function FloatingContact() {
  const [open, setOpen] = useState(true);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        right: 16,
        zIndex: 500,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: 10,
      }}
    >
      {open && (
        <div
          style={{
            display: "flex",
            width: "min(300px, calc(100vw - 48px))",
            borderRadius: 12,
            boxShadow: "0 2px 16px rgba(0,0,0,0.18)",
            background: "#fff",
          }}
        >
          {/* Left salmon panel */}
          <div
            style={{
              width: 80,
              flexShrink: 0,
              background: "#F5C4AC",
              borderRadius: "12px 0 0 12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px 0",
            }}
          >
            <svg width="44" height="44" viewBox="0 0 64 64" fill="none">
              <path
                d="M32 8C20.95 8 12 16.95 12 28v2h4a4 4 0 0 1 4 4v8a4 4 0 0 1-4 4h-2a4 4 0 0 1-4-4V28C10 15.85 19.85 6 32 6s22 9.85 22 22v14a4 4 0 0 1-4 4h-2a4 4 0 0 1-4-4v-8a4 4 0 0 1 4-4h4v-2C52 16.95 43.05 8 32 8z"
                fill="white"
              />
            </svg>
          </div>

          {/* Right white panel */}
          <div style={{ flex: 1, padding: "14px 14px 14px 12px", borderRadius: "0 12px 12px 0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: "#2d2d2d", margin: 0 }}>Contact Us</p>
              <button
                onClick={() => setOpen(false)}
                onTouchEnd={(e) => { e.preventDefault(); setOpen(false); }}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: "#eee",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  fontSize: 18,
                  color: "#666",
                  lineHeight: 1,
                  flexShrink: 0,
                }}
                aria-label="Minimize"
              >
                −
              </button>
            </div>
            <a href="tel:+919974057620" style={{ fontSize: 12, color: "#555", marginBottom: 10, display: "block", textDecoration: "none" }}>+91 9974057620</a>
            <p style={{ fontSize: 14, fontWeight: 700, color: "#2d2d2d", marginBottom: 4 }}>Mail Us</p>
            <a href="mailto:jmodi1040@gmail.com" style={{ fontSize: 12, color: "#555", wordBreak: "break-all", textDecoration: "none" }}>jmodi1040@gmail.com</a>
            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              <a href="https://wa.me/919974057620" target="_blank" rel="noopener noreferrer"
                style={{ fontSize: 11, background: "#25D366", color: "#fff", padding: "3px 8px", borderRadius: 4, textDecoration: "none", fontWeight: 600 }}>
                WhatsApp
              </a>
              <a href="https://www.instagram.com/jaimin_modi_photography/" target="_blank" rel="noopener noreferrer"
                style={{ fontSize: 11, background: "#E1306C", color: "#fff", padding: "3px 8px", borderRadius: 4, textDecoration: "none", fontWeight: 600 }}>
                Instagram
              </a>
            </div>
          </div>
        </div>
      )}

      {!open && (
        <button
          onClick={() => setOpen(true)}
          onTouchEnd={(e) => { e.preventDefault(); setOpen(true); }}
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            background: "#E8906D",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 8px rgba(232,144,109,0.45)",
          }}
          aria-label="Contact Us"
        >
          <svg width="22" height="22" viewBox="0 0 64 64" fill="none">
            <path d="M32 8C20.95 8 12 16.95 12 28v2h4a4 4 0 0 1 4 4v8a4 4 0 0 1-4 4h-2a4 4 0 0 1-4-4V28C10 15.85 19.85 6 32 6s22 9.85 22 22v14a4 4 0 0 1-4 4h-2a4 4 0 0 1-4-4v-8a4 4 0 0 1 4-4h4v-2C52 16.95 43.05 8 32 8z" fill="white" />
          </svg>
        </button>
      )}

      <button
        onClick={scrollToTop}
        onTouchEnd={(e) => { e.preventDefault(); scrollToTop(); }}
        style={{
          width: 44,
          height: 44,
          borderRadius: "50%",
          background: "#E8906D",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 2px 6px rgba(232,144,109,0.4)",
        }}
        aria-label="Back to top"
      >
        <ChevronUp size={20} color="#fff" />
      </button>
    </div>
  );
}
