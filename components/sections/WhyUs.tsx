export default function WhyUs() {
  const features = [
    {
      label: "Exceptional Staff",
      icon: (
        <svg viewBox="0 0 60 60" fill="none" stroke="#E8906D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 48, height: 48 }}>
          <circle cx="30" cy="16" r="7" />
          <circle cx="12" cy="34" r="5" />
          <circle cx="48" cy="34" r="5" />
          <line x1="18" y1="31" x2="25" y2="22" />
          <line x1="42" y1="31" x2="35" y2="22" />
          <line x1="17" y1="39" x2="43" y2="39" />
        </svg>
      ),
    },
    {
      label: "Premium Quality",
      icon: (
        <svg viewBox="0 0 60 60" fill="none" stroke="#E8906D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 48, height: 48 }}>
          <circle cx="30" cy="24" r="12" />
          <polyline points="24,24 28,28 36,18" />
          <path d="M22 38 L18 54 L30 46 L42 54 L38 38" />
        </svg>
      ),
    },
    {
      label: "Affordable Pricing",
      icon: (
        <svg viewBox="0 0 60 60" fill="none" stroke="#E8906D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 48, height: 48 }}>
          <circle cx="30" cy="20" r="10" />
          <path d="M26 20 h8 M30 16 v8" />
          <path d="M10 46 C10 38 18 34 30 34 C42 34 50 38 50 46" />
        </svg>
      ),
    },
    {
      label: "High Industry Standards",
      icon: (
        <svg viewBox="0 0 60 60" fill="none" stroke="#E8906D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 48, height: 48 }}>
          <circle cx="30" cy="30" r="18" />
          <circle cx="30" cy="30" r="8" />
          <circle cx="30" cy="12" r="3" />
          <circle cx="30" cy="48" r="3" />
          <circle cx="12" cy="30" r="3" />
          <circle cx="48" cy="30" r="3" />
        </svg>
      ),
    },
  ];

  return (
    <section id="why-us" style={{ padding: "45px 0", background: "#fff", borderTop: "1px solid #f0f0f0" }}>
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
          Why Us
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16, maxWidth: 720, margin: "0 auto" }}>
          {features.map((f) => (
            <div
              key={f.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 20,
                background: "#FAFAFA",
                border: "1px solid #eee",
                borderRadius: 12,
                padding: 20,
              }}
            >
              <div
                style={{
                  flexShrink: 0,
                  width: 76,
                  height: 76,
                  background: "#fff",
                  borderRadius: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                  border: "1px solid #eee",
                }}
              >
                {f.icon}
              </div>
              <span style={{ fontSize: 15, fontWeight: 500, color: "#444" }}>{f.label}</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 600px) {
          #why-us .wrap > div:last-child { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
