"use client";

import { useState, useEffect } from "react";
import { useModal } from "@/contexts/ModalContext";
const MAX_MSG = 1000;

export default function EnquireModal() {
  const { activeModal, closeModal, enquireService, user } = useModal();
  const [form, setForm] = useState({ name: "", mobile: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /* Auto-fill from logged-in user, clear when logged out */
  useEffect(() => {
    if (activeModal === "enquire") {
      if (user) {
        const meta = user.user_metadata ?? {};
        setForm((f) => ({
          ...f,
          name: (meta.name as string) || "",
          mobile: (meta.mobile as string) || "",
          email: user.email || "",
        }));
      } else {
        setForm({ name: "", mobile: "", email: "", message: "" });
      }
    }
  }, [activeModal, user]);

  if (activeModal !== "enquire") return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/enquiry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        mobile: form.mobile,
        email: form.email || null,
        service: enquireService || null,
        message: form.message || null,
      }),
    });

    setLoading(false);

    if (!res.ok) {
      setError("Something went wrong. Please try again.");
      return;
    }

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      closeModal();
      setForm({ name: "", mobile: "", email: "", message: "" });
      setError("");
    }, 2500);
  };

  const fieldStyle: React.CSSProperties = {
    width: "100%",
    border: "1px solid #e0e0e0",
    borderRadius: 10,
    padding: "13px 16px",
    fontSize: 14,
    color: "#333",
    outline: "none",
    fontFamily: "inherit",
    boxSizing: "border-box",
    background: "#fff",
  };

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
      style={{
        position: "fixed", inset: 0, zIndex: 9000,
        background: "rgba(0,0,0,0.5)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "16px",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          width: 480,
          maxWidth: "100%",
          padding: "36px 32px 32px",
          boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
          position: "relative",
        }}
      >
        {/* Close */}
        <button
          onClick={closeModal}
          style={{
            position: "absolute", top: 16, right: 18,
            background: "none", border: "none", cursor: "pointer",
            fontSize: 20, color: "#aaa", lineHeight: 1,
          }}
        >
          ×
        </button>

        {/* Title */}
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 22,
            fontWeight: 700,
            color: "#222",
            textAlign: "center",
            marginBottom: enquireService ? 4 : 28,
          }}
        >
          Send Enquiry
        </h2>
        {enquireService && (
          <p style={{ textAlign: "center", fontSize: 13, color: "#E8906D", marginBottom: 24 }}>
            {enquireService}
          </p>
        )}

        {submitted ? (
          <div style={{ textAlign: "center", padding: "32px 0" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>✓</div>
            <p style={{ fontSize: 16, fontWeight: 600, color: "#333" }}>Enquiry submitted!</p>
            <p style={{ fontSize: 13, color: "#888", marginTop: 6 }}>We will contact you shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Name */}
            <input
              required
              type="text"
              placeholder="Name *"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              style={fieldStyle}
            />

            {/* Mobile with India flag prefix */}
            <div style={{ display: "flex", border: "1px solid #e0e0e0", borderRadius: 10, overflow: "hidden", background: "#fff" }}>
              {/* Flag + code */}
              <div style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "0 12px", borderRight: "1px solid #e0e0e0",
                flexShrink: 0, background: "#fff",
              }}>
                {/* India flag emoji */}
                <span style={{ fontSize: 18, lineHeight: 1 }}>🇮🇳</span>
                <span style={{ fontSize: 12, color: "#888" }}>▾</span>
                <span style={{ fontSize: 14, color: "#333", fontWeight: 500 }}>+91</span>
              </div>
              <input
                required
                type="tel"
                placeholder="Mobile Number *"
                value={form.mobile}
                onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                style={{
                  flex: 1,
                  border: "none",
                  outline: "none",
                  padding: "13px 14px",
                  fontSize: 14,
                  color: "#333",
                  fontFamily: "inherit",
                  background: "transparent",
                }}
              />
            </div>

            {/* Email */}
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              style={fieldStyle}
            />

            {/* Message */}
            <div style={{ position: "relative" }}>
              <textarea
                rows={4}
                placeholder="Message"
                value={form.message}
                maxLength={MAX_MSG}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                style={{ ...fieldStyle, resize: "none", paddingBottom: 28 }}
              />
              <span style={{
                position: "absolute", bottom: 10, right: 14,
                fontSize: 11, color: "#aaa",
              }}>
                {form.message.length} of {MAX_MSG} characters
              </span>
            </div>

            {error && (
              <p style={{ color: "#e53e3e", fontSize: 13, textAlign: "center", margin: 0 }}>{error}</p>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "14px 0",
                background: loading ? "#ccc" : "#E8706A",
                border: "none",
                borderRadius: 999,
                fontSize: 15,
                fontWeight: 700,
                color: "#fff",
                cursor: loading ? "not-allowed" : "pointer",
                letterSpacing: "0.02em",
                marginTop: 4,
              }}
            >
              {loading ? "Submitting…" : "Submit"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
