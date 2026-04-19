"use client";

const usefulLinks1 = [
  { label: "PRIVACY POLICY", href: "#" },
  { label: "SERVICES",       href: "#services" },
  { label: "WHY US",         href: "#why-us" },
  { label: "TESTIMONIALS",   href: "#testimonials" },
];

const usefulLinks2 = [
  { label: "HOME",       href: "#home" },
  { label: "ABOUT US",  href: "#about" },
  { label: "PORTFOLIO", href: "#gallery" },
  { label: "CONTACT US", href: "#contact" },
];

const languages = [
  "English", "हिंदी", "मराठी", "বাংলা", "தமிழ்",
  "ગુજરાતી", "ಕನ್ನಡ", "മലയാളം", "తెలుగు", "ਪੰਜਾਬੀ",
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
            <p style={{ fontSize: 13, color: "#555", lineHeight: 1.65, marginBottom: 10 }}>
              15, First Floor Mahatma Gandhi Shopping Centre,
              Kadi, Gujarat 384440
            </p>
            <p style={{ fontSize: 13, color: "#555" }}>+91-9925305809</p>
          </div>

          {/* Col 3 — Connect */}
          <div>
            <h4 style={{ fontSize: 12, fontWeight: 700, color: "#333", letterSpacing: "0.1em", marginBottom: 16, textTransform: "uppercase" }}>
              Connect
            </h4>
            {/* Jd badge + rating */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {/* Jd circular badge */}
              <div
                style={{
                  width: 38, height: 38, borderRadius: "50%",
                  background: "#222",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", fontWeight: 800, fontSize: 13,
                  fontStyle: "italic", letterSpacing: "-0.5px",
                  flexShrink: 0,
                }}
              >
                Jd
              </div>
              {/* Rating */}
              <div
                style={{
                  display: "flex", alignItems: "center",
                  border: "1px solid #ccc", borderRadius: 4,
                  overflow: "hidden", height: 28,
                }}
              >
                <span style={{ background: "#008C41", color: "#fff", fontSize: 12, fontWeight: 700, padding: "0 8px", height: "100%", display: "flex", alignItems: "center" }}>
                  5.0
                </span>
                <span style={{ padding: "0 8px", fontSize: 13, color: "#E95C29", letterSpacing: 1 }}>
                  ★★★★★
                </span>
              </div>
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
      <div style={{ background: "#fff", borderTop: "1px solid #eee", padding: "12px 0" }}>
        <div
          className="wrap"
          style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}
        >
          <p style={{ fontSize: 12, color: "#888", margin: 0 }}>
            © Copyrights 2026 - 2027. MD Studio. All Rights Reserved.
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 26, height: 26, borderRadius: "50%", background: "#222", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 10, fontStyle: "italic" }}>
              Jd
            </div>
            <div style={{ display: "flex", alignItems: "center", border: "1px solid #ccc", borderRadius: 4, overflow: "hidden", height: 24 }}>
              <span style={{ background: "#008C41", color: "#fff", fontSize: 11, fontWeight: 700, padding: "0 6px", height: "100%", display: "flex", alignItems: "center" }}>5.0</span>
              <span style={{ padding: "0 6px", fontSize: 12, color: "#E95C29" }}>★★★★★</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Language strip ── */}
      <div style={{ background: "#fff", borderTop: "1px solid #f0f0f0", padding: "10px 0" }}>
        <div className="wrap" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "4px 12px", justifyContent: "center" }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: "#555", letterSpacing: "0.05em" }}>CHANGE LANGUAGE :</span>
          {languages.map((lang, i) => (
            <span
              key={lang}
              style={{
                fontSize: 12,
                color: i === 0 ? "#333" : "#777",
                fontWeight: i === 0 ? 600 : 400,
                cursor: i === 0 ? "default" : "pointer",
              }}
              onMouseEnter={(e) => { if (i !== 0) e.currentTarget.style.color = "#E8906D"; }}
              onMouseLeave={(e) => { if (i !== 0) e.currentTarget.style.color = "#777"; }}
            >
              {lang}
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}
