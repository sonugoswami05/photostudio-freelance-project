"use client";

import { useState } from "react";
import { MapPin, MessageSquare, Phone, Clock } from "lucide-react";

const infoCards = [
  { icon: MapPin,        title: "Our Address", value: "Shefali Compound Near Shefali Cinema, Kadi - Detroj Rd, Near Krishna Hospital, Kadi, Gujarat 382715" },
  { icon: MessageSquare, title: "Email Us",    value: "jmodi1040@gmail.com" },
  { icon: Phone,         title: "Call Us",     value: "+91 9974057620" },
  { icon: Clock,         title: "Our Timings", value: "Mon - Sun : Open 24 hrs" },
];

export default function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", mobile: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setForm({ name: "", email: "", mobile: "", message: "" });
    }, 3000);
  };

  const inputStyle: React.CSSProperties = {
    border: "1px solid #e0e0e0",
    borderRadius: 8,
    padding: "11px 16px",
    fontSize: 13,
    color: "#555",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
    fontFamily: "inherit",
  };

  return (
    <section id="contact" style={{ padding: "45px 0", background: "#fff", borderTop: "1px solid #f0f0f0" }}>
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
          Contact Us
        </h2>

        {/* 4 info cards */}
        <div className="contact-cards" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", border: "1px solid #eee", borderRadius: 12, overflow: "hidden", marginBottom: 32 }}>
          {infoCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                style={{
                  display: "flex", flexDirection: "column", alignItems: "center",
                  textAlign: "center", padding: "24px 16px",
                  borderRight: i < infoCards.length - 1 ? "1px solid #eee" : "none",
                }}
              >
                <Icon size={24} style={{ color: "#E8906D", marginBottom: 10 }} />
                <h3 style={{ fontSize: 13, fontWeight: 600, color: "#333", marginBottom: 8 }}>{card.title}</h3>
                <p style={{ fontSize: 12, color: "#888", lineHeight: 1.6, margin: 0 }}>{card.value}</p>
              </div>
            );
          })}
        </div>

        {/* Form */}
        {submitted ? (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <p style={{ fontSize: 16, fontWeight: 500, color: "#444" }}>✓ Thank you! We will get back to you shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ maxWidth: 800, margin: "0 auto" }}>
            <div className="contact-form-row" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 16 }}>
              <input required type="text"  placeholder="Full Name"     value={form.name}   onChange={(e) => setForm({ ...form, name: e.target.value })}   style={inputStyle} />
              <input required type="email" placeholder="Email ID"      value={form.email}  onChange={(e) => setForm({ ...form, email: e.target.value })}  style={inputStyle} />
              <input required type="tel"   placeholder="Mobile Number" value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} style={inputStyle} />
            </div>
            <textarea
              rows={4}
              placeholder="Message"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              style={{ ...inputStyle, resize: "none", width: "100%", marginBottom: 16 }}
            />
            <div className="contact-submit-wrap" style={{ textAlign: "center" }}>
              <button
                type="submit"
                className="contact-submit-btn"
                style={{
                  background: "#A0845C", color: "#fff", border: "none",
                  borderRadius: 999, padding: "12px 40px",
                  fontSize: 14, fontWeight: 600, cursor: "pointer",
                }}
              >
                Submit
              </button>
            </div>
          </form>
        )}

        {/* Map */}
        <div style={{ marginTop: 32, borderRadius: 12, overflow: "hidden", border: "1px solid #eee", height: 300, position: "relative" }}>
          <a
            href="https://maps.google.com?q=New+Alankar+Studio,Kadi,Gujarat,India"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              position: "absolute", top: 12, left: 12, zIndex: 10,
              display: "flex", alignItems: "center", gap: 6,
              background: "#F5C4AC", border: "1px solid #e0b090",
              borderRadius: 4, padding: "6px 12px",
              fontSize: 13, fontWeight: 500, color: "#555",
              textDecoration: "none",
            }}
          >
            Get Direction
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </a>
          <iframe
            src="https://www.openstreetmap.org/export/embed.html?bbox=72.95%2C23.28%2C72.99%2C23.32&layer=mapnik&marker=23.30%2C72.97"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            title="New Alankar Studio Location - Kadi"
          />
        </div>
      </div>

      <style>{`
        @media (max-width: 767px) {
          .contact-cards { display: none !important; }
          .contact-form-row { grid-template-columns: 1fr !important; }
          .contact-submit-btn { width: 100% !important; padding: 13px 20px !important; }
        }
      `}</style>
    </section>
  );
}
