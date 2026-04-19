"use client";

import { useState } from "react";
import { useModal } from "@/contexts/ModalContext";
import { supabase } from "@/lib/supabase";

export default function SignUpModal() {
  const { activeModal, closeModal, openLogin } = useModal();
  const [form, setForm] = useState({ name: "", mobile: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  if (activeModal !== "signup") return null;

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.mobile || !form.email || !form.password) {
      setError("All fields are required.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    const { error: err } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { name: form.name, mobile: form.mobile } },
    });
    setLoading(false);

    if (err) { setError(err.message); return; }
    setSuccess(true);
  };

  const labelStyle: React.CSSProperties = {
    display: "block", fontSize: 11, letterSpacing: "0.12em",
    color: "#aaa", textTransform: "uppercase", marginBottom: 6, fontWeight: 500,
  };
  const inputStyle: React.CSSProperties = {
    width: "100%", border: "none", borderBottom: "1px solid #ddd",
    outline: "none", fontSize: 14, color: "#333", padding: "6px 0",
    background: "transparent", fontFamily: "inherit",
  };

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
      style={{
        position: "fixed", inset: 0, zIndex: 9000,
        background: "rgba(0,0,0,0.5)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
    >
      <style>{`
        @media(max-width:600px){
          .signup-modal-left{display:none!important}
          .signup-modal-right{padding:32px 20px!important}
        }
      `}</style>
      <div style={{
        background: "#fff", borderRadius: 14, display: "flex",
        width: 720, maxWidth: "95vw",
        boxShadow: "0 8px 40px rgba(0,0,0,0.18)", position: "relative",
      }}>
        {/* Left panel */}
        <div className="signup-modal-left" style={{
          width: 280, flexShrink: 0, padding: "48px 36px",
          borderRight: "1px solid #eee", display: "flex",
          flexDirection: "column", alignItems: "flex-start",
        }}>
          <div style={{
            width: 110, height: 110, borderRadius: "50%", background: "#F5C4AC",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 28, fontWeight: 700, color: "#444", marginBottom: 28,
          }}>MD</div>
          <h2 style={{ fontSize: 26, fontWeight: 500, color: "#222", margin: "0 0 14px" }}>Sign Up</h2>
          <div style={{ width: "100%", height: 1, background: "#e0e0e0", marginBottom: 16 }} />
          <p style={{ fontSize: 14, color: "#777", lineHeight: 1.6, margin: 0 }}>
            We do not share your personal details with anyone
          </p>
        </div>

        {/* Right panel */}
        <div className="signup-modal-right" style={{ flex: 1, padding: "40px 44px" }}>
          <button onClick={closeModal} style={{
            position: "absolute", top: 16, right: 20,
            background: "none", border: "none", cursor: "pointer",
            fontSize: 20, color: "#aaa", lineHeight: 1,
          }}>×</button>

          {success ? (
            <div style={{ textAlign: "center", padding: "32px 0" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>✓</div>
              <p style={{ fontSize: 16, fontWeight: 600, color: "#333" }}>Account created!</p>
              <p style={{ fontSize: 13, color: "#888", marginTop: 6 }}>You can now log in with your email and password.</p>
              <button
                onClick={() => { closeModal(); setTimeout(openLogin, 80); }}
                style={{ marginTop: 20, padding: "10px 28px", background: "#F5C4AC", border: "none", borderRadius: 6, fontWeight: 700, cursor: "pointer" }}
              >Log In</button>
            </div>
          ) : (
            <form onSubmit={handleSignUp} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div>
                <label style={labelStyle}>Full Name *</label>
                <input type="text" value={form.name} onChange={set("name")} style={inputStyle} placeholder="Your name" />
              </div>
              <div>
                <label style={labelStyle}>Mobile No. *</label>
                <input type="tel" value={form.mobile} onChange={set("mobile")} style={inputStyle} placeholder="e.g. 9925305809" />
              </div>
              <div>
                <label style={labelStyle}>Email *</label>
                <input type="email" value={form.email} onChange={set("email")} style={inputStyle} placeholder="your@email.com" />
              </div>
              <div>
                <label style={labelStyle}>Password *</label>
                <input type="password" value={form.password} onChange={set("password")} style={inputStyle} placeholder="Min. 6 characters" />
              </div>

              {error && <p style={{ color: "#e53e3e", fontSize: 13, margin: 0 }}>{error}</p>}

              <button type="submit" disabled={loading} style={{
                width: "100%", padding: "14px 0",
                background: loading ? "#ccc" : "#F5C4AC",
                border: "none", borderRadius: 6, fontSize: 15, fontWeight: 700,
                color: "#333", cursor: loading ? "not-allowed" : "pointer",
              }}>
                {loading ? "Creating account…" : "Continue"}
              </button>

              <p style={{ textAlign: "center", fontSize: 14, color: "#555", margin: 0 }}>
                Existing User?{" "}
                <button type="button"
                  onClick={() => { closeModal(); setTimeout(openLogin, 80); }}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#0086ff", fontSize: 14, fontFamily: "inherit" }}
                >Log In</button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
