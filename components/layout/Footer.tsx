"use client";

import { useState } from "react";

const usefulLinks1 = [
  { label: "PRIVACY POLICY", href: "#" },
  { label: "SERVICES",       href: "#services" },
  { label: "PORTFOLIO",      href: "#gallery" },
  { label: "TESTIMONIALS",   href: "#testimonials" },
];

const usefulLinks2 = [
  { label: "HOME",       href: "#home" },
  { label: "ABOUT US",  href: "#about" },
  { label: "PORTFOLIO", href: "#gallery" },
  { label: "CONTACT US", href: "#contact" },
];

const languages = [
  { label: "English",   code: "en" },
  { label: "हिंदी",     code: "hi" },
  { label: "मराठी",     code: "mr" },
  { label: "বাংলা",     code: "bn" },
  { label: "தமிழ்",    code: "ta" },
  { label: "ગુજરાતી",  code: "gu" },
  { label: "ಕನ್ನಡ",    code: "kn" },
  { label: "മലയാളം",   code: "ml" },
  { label: "తెలుగు",   code: "te" },
  { label: "ਪੰਜਾਬੀ",   code: "pa" },
];

const linkStyle: React.CSSProperties = {
  display: "block",
  fontSize: 12,
  color: "#555",
  textDecoration: "none",
  marginBottom: 8,
  letterSpacing: "0.04em",
};

export default function Footer() {
  const [activeLang, setActiveLang] = useState("en");

  const handleLang = (code: string) => {
    setActiveLang(code);
    if (typeof window !== "undefined" && (window as any).__changeLang) {
      (window as any).__changeLang(code);
    }
  };

  return (
    <footer style={{ borderTop: "1px solid #eee" }}>

      {/* ── Main footer ── */}
      <div style={{ background: "#fff", padding: "40px 0" }}>
        <div className="wrap footer-grid">

          {/* Col 1 — Useful Links */}
          <div>
            <h4 style={{ fontSize: 12, fontWeight: 700, color: "#333", letterSpacing: "0.1em", marginBottom: 16, textTransform: "uppercase" }}>
              Useful Links
            </h4>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
              <div>
                {usefulLinks1.map((l) => (
                  <a key={l.label} href={l.href} style={linkStyle}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#E8906D")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#555")}
                  >
                    {l.label}
                  </a>
                ))}
              </div>
              <div>
                {usefulLinks2.map((l) => (
                  <a key={l.label} href={l.href} style={linkStyle}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#E8906D")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#555")}
                  >
                    {l.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Col 2 — Contact */}
          <div>
            <h4 style={{ fontSize: 12, fontWeight: 700, color: "#333", letterSpacing: "0.1em", marginBottom: 16, textTransform: "uppercase" }}>
              Contact
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", gap: 10 }}>
                <span style={{ fontSize: 15, flexShrink: 0, marginTop: 1 }}>📍</span>
                <p style={{ fontSize: 13, color: "#555", lineHeight: 1.65, margin: 0 }}>
                  Shefali Compound Near Shefali Cinema,<br />
                  Kadi - Detroj Rd, Near Krishna Hospital,<br />
                  Kadi, Gujarat 382715
                </p>
              </div>
              <a href="tel:+919974057620" style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "#555", textDecoration: "none" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#E8906D")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#555")}
              >
                <span style={{ fontSize: 15 }}>📞</span> +91 99740 57620
              </a>
              <a href="mailto:jmodi1040@gmail.com" style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "#555", textDecoration: "none" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#E8906D")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#555")}
              >
                <span style={{ fontSize: 15 }}>✉️</span> jmodi1040@gmail.com
              </a>
              <div style={{ display: "flex", gap: 8, marginTop: 2 }}>
                <a href="https://wa.me/919974057620" target="_blank" rel="noopener noreferrer"
                  style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, background: "#25D366", color: "#fff", padding: "6px 12px", borderRadius: 6, textDecoration: "none", fontWeight: 600 }}>
                  <svg width="13" height="13" fill="#fff" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  WhatsApp
                </a>
                <a href="https://www.instagram.com/jaimin_modi_photography/" target="_blank" rel="noopener noreferrer"
                  style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, background: "linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366)", color: "#fff", padding: "6px 12px", borderRadius: 6, textDecoration: "none", fontWeight: 600 }}>
                  <svg width="13" height="13" fill="#fff" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                  Instagram
                </a>
              </div>
            </div>
          </div>

          {/* Col 3 — Follow Us */}
          <div>
            <h4 style={{ fontSize: 12, fontWeight: 700, color: "#333", letterSpacing: "0.1em", marginBottom: 16, textTransform: "uppercase" }}>
              Follow Us
            </h4>
            <p style={{ fontSize: 13, color: "#555", lineHeight: 1.65, marginBottom: 14 }}>
              Stay updated with our latest work and behind-the-scenes moments.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <a href="https://www.instagram.com/jaimin_modi_photography/" target="_blank" rel="noopener noreferrer"
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  textDecoration: "none", color: "#555",
                  fontSize: 13, fontWeight: 500,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#E1306C")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#555")}
              >
                <span style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="16" height="16" fill="#fff" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                </span>
                @jaimin_modi_photography
              </a>
              <a href="https://wa.me/919974057620" target="_blank" rel="noopener noreferrer"
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  textDecoration: "none", color: "#555",
                  fontSize: 13, fontWeight: 500,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#25D366")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#555")}
              >
                <span style={{ width: 32, height: 32, borderRadius: 8, background: "#25D366", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="16" height="16" fill="#fff" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                </span>
                +91 99740 57620
              </a>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .footer-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 40px;
        }
        @media (max-width: 767px) {
          .footer-grid {
            grid-template-columns: 1fr;
            gap: 28px;
          }
        }
        @media (min-width: 768px) and (max-width: 1023px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr;
            gap: 24px;
          }
        }
      `}</style>

      {/* ── Copyright bar ── */}
      <div style={{ background: "#fafafa", borderTop: "1px solid #eee", padding: "14px 0" }}>
        <div
          className="wrap"
          style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}
        >
          <p style={{ fontSize: 12, color: "#888", margin: 0 }}>
            © 2026 – 2027 New Alankar Studio. All Rights Reserved.
          </p>
          <p style={{ fontSize: 12, color: "#bbb", margin: 0 }}>
            Crafted with ♥ in Kadi, Gujarat
          </p>
        </div>
      </div>

      {/* ── Language strip ── */}
      <div style={{ background: "#fff", borderTop: "1px solid #f0f0f0", padding: "10px 0" }}>
        <div className="wrap" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "4px 12px", justifyContent: "center" }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: "#555", letterSpacing: "0.05em" }}>CHANGE LANGUAGE :</span>
          {languages.map(({ label, code }) => {
            const isActive = activeLang === code;
            return (
              <button
                key={code}
                onClick={() => handleLang(code)}
                style={{
                  fontSize: 12,
                  color: isActive ? "#E8906D" : "#777",
                  fontWeight: isActive ? 700 : 400,
                  cursor: "pointer",
                  background: "none",
                  border: "none",
                  padding: "2px 0",
                  borderBottom: isActive ? "1.5px solid #E8906D" : "1.5px solid transparent",
                  transition: "color 0.2s, border-color 0.2s",
                }}
                onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.color = "#E8906D"; }}
                onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.color = "#777"; }}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>
    </footer>
  );
}
