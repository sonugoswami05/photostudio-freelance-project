"use client";

import { useState } from "react";
import { useModal } from "@/contexts/ModalContext";
import { supabase } from "@/lib/supabase";

type View = "login" | "forgot" | "forgot-sent";

export default function LoginModal() {
  const { activeModal, closeModal, openSignup } = useModal();
  const [view, setView] = useState<View>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (activeModal !== "login") return null;

  const reset = () => { setView("login"); setError(""); setResetEmail(""); };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError("Please fill in all fields."); return; }
    setLoading(true);
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (err) { setError("Invalid email or password."); return; }
    reset();
    closeModal();
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!resetEmail) { setError("Please enter your email address."); return; }
    setLoading(true);
    await supabase.auth.resetPasswordForEmail(resetEmail, {
      redirectTo: `${window.location.origin}/auth/reset`,
    });
    setLoading(false);
    setView("forgot-sent");
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
  const btnStyle: React.CSSProperties = {
    width: "100%", padding: "14px 0", background: "#F5C4AC",
    border: "none", borderRadius: 6, fontSize: 15, fontWeight: 700,
    color: "#333", cursor: "pointer", letterSpacing: "0.02em",
  };

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) { reset(); closeModal(); } }}
      style={{
        position: "fixed", inset: 0, zIndex: 9000,
        background: "rgba(0,0,0,0.5)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
    >
      <style>{`
        @media(max-width:600px){
          .login-modal-left{display:none!important}
          .login-modal-right{padding:32px 20px!important}
        }
      `}</style>
      <div style={{
        background: "#fff", borderRadius: 14, display: "flex",
        width: 780, maxWidth: "95vw",
        boxShadow: "0 8px 40px rgba(0,0,0,0.18)", position: "relative",
      }}>
        {/* Left panel */}
        <div className="login-modal-left" style={{
          width: 300, flexShrink: 0, padding: "48px 36px",
          borderRight: "1px solid #eee", display: "flex",
          flexDirection: "column", alignItems: "flex-start",
        }}>
          <div style={{
            width: 110, height: 110, borderRadius: "50%", background: "#F5C4AC",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 28, fontWeight: 700, color: "#444", marginBottom: 28,
          }}>MD</div>
          <h2 style={{ fontSize: 26, fontWeight: 500, color: "#222", margin: "0 0 14px" }}>
            {view === "login" ? "Log In" : "Reset Password"}
          </h2>
          <div style={{ width: "100%", height: 1, background: "#e0e0e0", marginBottom: 16 }} />
          <p style={{ fontSize: 14, color: "#777", lineHeight: 1.6, margin: 0 }}>
            {view === "login"
              ? "Get access to your bookings and profile."
              : "Enter your email to receive a password reset link."}
          </p>
        </div>

        {/* Right panel */}
        <div className="login-modal-right" style={{ flex: 1, padding: "48px 44px" }}>
          <button onClick={() => { reset(); closeModal(); }} style={{
            position: "absolute", top: 16, right: 20,
            background: "none", border: "none", cursor: "pointer",
            fontSize: 20, color: "#aaa", lineHeight: 1,
          }}>×</button>

          {/* ── Login ── */}
          {view === "login" && (
            <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 28 }}>
              <div>
                <label style={labelStyle}>Email Address</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} placeholder="your@email.com" />
              </div>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <label style={{ ...labelStyle, marginBottom: 0 }}>Password</label>
                  <button type="button" onClick={() => { setError(""); setView("forgot"); }}
                    style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, color: "#0086ff", fontFamily: "inherit" }}>
                    Forgot ?
                  </button>
                </div>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} />
              </div>

              {error && <p style={{ color: "#e53e3e", fontSize: 13, margin: 0 }}>{error}</p>}

              <button type="submit" disabled={loading}
                style={{ ...btnStyle, background: loading ? "#ccc" : "#F5C4AC", cursor: loading ? "not-allowed" : "pointer" }}>
                {loading ? "Logging in…" : "Log In"}
              </button>

              <p style={{ textAlign: "center", fontSize: 14, color: "#555", margin: 0 }}>
                Don&apos;t have an account?{" "}
                <button type="button" onClick={() => { reset(); closeModal(); setTimeout(openSignup, 80); }}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#0086ff", fontSize: 14, fontFamily: "inherit" }}>
                  Sign Up
                </button>
              </p>
            </form>
          )}

          {/* ── Forgot password ── */}
          {view === "forgot" && (
            <form onSubmit={handleForgot} style={{ display: "flex", flexDirection: "column", gap: 28 }}>
              <div>
                <label style={labelStyle}>Email Address</label>
                <input type="email" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)}
                  style={inputStyle} placeholder="your@email.com" autoFocus />
              </div>

              {error && <p style={{ color: "#e53e3e", fontSize: 13, margin: 0 }}>{error}</p>}

              <button type="submit" disabled={loading}
                style={{ ...btnStyle, background: loading ? "#ccc" : "#F5C4AC", cursor: loading ? "not-allowed" : "pointer" }}>
                {loading ? "Sending…" : "Send Reset Link"}
              </button>

              <button type="button" onClick={() => { setError(""); setView("login"); }}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#0086ff", fontSize: 14, fontFamily: "inherit" }}>
                ← Back to Login
              </button>
            </form>
          )}

          {/* ── Sent ── */}
          {view === "forgot-sent" && (
            <div style={{ textAlign: "center", padding: "24px 0" }}>
              <div style={{ fontSize: 44, marginBottom: 16 }}>📧</div>
              <p style={{ fontSize: 16, fontWeight: 600, color: "#333", marginBottom: 8 }}>Check your inbox!</p>
              <p style={{ fontSize: 14, color: "#777", lineHeight: 1.6, marginBottom: 24 }}>
                A password reset link has been sent to <strong>{resetEmail}</strong>.<br />
                Click the link in the email to set a new password.
              </p>
              <button onClick={reset} style={{ ...btnStyle, width: "auto", padding: "10px 28px" }}>
                Back to Login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
