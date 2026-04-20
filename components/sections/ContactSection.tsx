"use client";

import { useState, useEffect } from "react";
import { MapPin, MessageSquare, Phone, Clock } from "lucide-react";
import { supabase } from "@/lib/supabase";

const DEFAULT_CONTACT = {
  address: "Shefali Compound Near Shefali Cinema, Kadi - Detroj Rd, Near Krishna Hospital, Kadi, Gujarat 382715",
  email:   "jmodi1040@gmail.com",
  phone:   "+91 9974057620",
  timings: "Mon – Sun : Open 24 hrs",
};

export default function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", mobile: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [contactBg, setContactBg] = useState("");
  const [contactInfo, setContactInfo] = useState(DEFAULT_CONTACT);

  useEffect(() => {
    supabase.from("site_config").select("key, value")
      .in("key", ["contact_bg", "contact_address", "contact_email", "contact_phone", "contact_timings"])
      .then(({ data }) => {
        if (!data) return;
        const get = (k: string) => data.find((r) => r.key === k)?.value || "";
        if (get("contact_bg"))      setContactBg(get("contact_bg"));
        setContactInfo({
          address: get("contact_address") || DEFAULT_CONTACT.address,
          email:   get("contact_email")   || DEFAULT_CONTACT.email,
          phone:   get("contact_phone")   || DEFAULT_CONTACT.phone,
          timings: get("contact_timings") || DEFAULT_CONTACT.timings,
        });
      });
  }, []);

  const infoCards = [
    { icon: MapPin,        title: "Our Address", value: contactInfo.address },
    { icon: MessageSquare, title: "Email Us",    value: contactInfo.email },
    { icon: Phone,         title: "Call Us",     value: contactInfo.phone },
    { icon: Clock,         title: "Our Timings", value: contactInfo.timings },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setForm({ name: "", email: "", mobile: "", message: "" });
    }, 3000);
  };

  const inputStyle: React.CSSProperties = {
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: 8,
    padding: "11px 16px",
    fontSize: 13,
    color: "#fff",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
    fontFamily: "inherit",
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(4px)",
  };

  return (
    <section
      id="contact"
      className="section-contact"
      style={{ padding: "60px 0", position: "relative" }}
    >
      {/* Background photo overlay */}
      {contactBg && (
        <>
          <div style={{
            position: "absolute", inset: 0, zIndex: 0,
            backgroundImage: `url(${contactBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "brightness(0.35) saturate(0.7)",
          }} />
          <div style={{
            position: "absolute", inset: 0, zIndex: 1,
            background: "linear-gradient(135deg, rgba(8,13,18,0.75) 0%, rgba(8,13,18,0.55) 100%)",
          }} />
        </>
      )}

      {/* Studio light orbs */}
      <div style={{
        position: "absolute", width: 600, height: 600, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(140,200,255,0.07) 0%, transparent 65%)",
        top: -150, right: 60, zIndex: 2, pointerEvents: "none",
        animation: "studioLightFloat 14s ease-in-out infinite",
      }} />
      <div style={{
        position: "absolute", width: 450, height: 450, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(255,220,130,0.06) 0%, transparent 65%)",
        bottom: -100, left: 80, zIndex: 2, pointerEvents: "none",
        animation: "studioLightFloat 18s ease-in-out infinite reverse",
      }} />

      <div className="wrap" style={{ position: "relative", zIndex: 3 }}>
        <h2 style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(24px, 2.5vw, 36px)",
          fontWeight: 300, color: "#fff",
          textAlign: "center", marginBottom: 40,
        }}>
          Contact Us
        </h2>

        {/* 4 info cards */}
        <div className="contact-cards" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 40 }}>
          {infoCards.map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.title} style={{
                display: "flex", flexDirection: "column", alignItems: "center",
                textAlign: "center", padding: "24px 16px",
                background: "rgba(255,255,255,0.07)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 12,
                transition: "background 0.2s",
              }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.12)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.07)")}
              >
                <Icon size={24} style={{ color: "#E8906D", marginBottom: 10 }} />
                <h3 style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.6)", marginBottom: 8, letterSpacing: "0.08em", textTransform: "uppercase" }}>{card.title}</h3>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.75)", lineHeight: 1.65, margin: 0 }}>{card.value}</p>
              </div>
            );
          })}
        </div>

        {/* Form */}
        {submitted ? (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <p style={{ fontSize: 16, fontWeight: 500, color: "#E8906D" }}>✓ Thank you! We will get back to you shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{
            maxWidth: 800, margin: "0 auto",
            background: "rgba(255,255,255,0.06)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 16,
            padding: "32px",
          }}>
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
              style={{ ...inputStyle, resize: "none", width: "100%", marginBottom: 20 }}
            />
            <div className="contact-submit-wrap" style={{ textAlign: "center" }}>
              <button type="submit" className="contact-submit-btn" style={{
                background: "#E8906D", color: "#fff", border: "none",
                borderRadius: 999, padding: "13px 48px",
                fontSize: 14, fontWeight: 600, cursor: "pointer",
                boxShadow: "0 4px 20px rgba(232,144,109,0.4)",
                transition: "opacity 0.2s",
              }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                Send Message
              </button>
            </div>
          </form>
        )}

        {/* Map */}
        <div style={{ marginTop: 40, borderRadius: 12, overflow: "hidden", border: "1px solid rgba(255,255,255,0.12)", height: 300, position: "relative" }}>
          <a
            href={`https://maps.google.com?q=${encodeURIComponent(contactInfo.address)}`}
            target="_blank" rel="noopener noreferrer"
            style={{
              position: "absolute", top: 12, left: 12, zIndex: 10,
              display: "flex", alignItems: "center", gap: 6,
              background: "#E8906D", border: "none",
              borderRadius: 6, padding: "7px 14px",
              fontSize: 13, fontWeight: 600, color: "#fff",
              textDecoration: "none", boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
            }}
          >
            Get Direction
            <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </a>
          <iframe
            src="https://www.openstreetmap.org/export/embed.html?bbox=72.95%2C23.28%2C72.99%2C23.32&layer=mapnik&marker=23.30%2C72.97"
            width="100%" height="100%"
            style={{ border: 0 }} loading="lazy"
            title="Jaimin Modi Photography Location - Kadi"
          />
        </div>
      </div>

      <style>{`
        ::placeholder { color: rgba(255,255,255,0.35) !important; }
        @keyframes studioLightFloat {
          0%, 100% { transform: translate(0, 0); opacity: 0.8; }
          33%  { transform: translate(-30px, 20px); opacity: 1; }
          66%  { transform: translate(20px, -25px); opacity: 0.6; }
        }
        @media (max-width: 767px) {
          .contact-cards { grid-template-columns: 1fr 1fr !important; }
          .contact-form-row { grid-template-columns: 1fr !important; }
          .contact-submit-btn { width: 100% !important; }
        }
      `}</style>
    </section>
  );
}
