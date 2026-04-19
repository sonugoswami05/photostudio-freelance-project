"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    /* Supabase puts the session tokens in the URL hash after redirect */
    supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setReady(true);
    });
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!password || !confirm) { setError("Please fill in both fields."); return; }
    if (password !== confirm) { setError("Passwords do not match."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }

    setLoading(true);
    const { error: err } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (err) { setError(err.message); return; }
    setDone(true);
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "12px 16px", border: "1px solid #e0e0e0",
    borderRadius: 8, fontSize: 14, color: "#333", outline: "none",
    fontFamily: "inherit", boxSizing: "border-box",
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      justifyContent: "center", background: "#fafafa", padding: "24px 16px",
    }}>
      <div style={{
        background: "#fff", borderRadius: 16, padding: "48px 40px",
        width: 420, maxWidth: "100%",
        boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 10, background: "#E8906D",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 10,
          }}>NA</div>
          <p style={{ fontSize: 13, color: "#888", margin: 0 }}>New Alankar Studio</p>
        </div>

        {done ? (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 44, marginBottom: 16 }}>✓</div>
            <p style={{ fontSize: 16, fontWeight: 600, color: "#333", marginBottom: 8 }}>Password updated!</p>
            <p style={{ fontSize: 14, color: "#777", marginBottom: 24 }}>You can now log in with your new password.</p>
            <a href="/" style={{
              display: "inline-block", padding: "12px 28px",
              background: "#E8906D", color: "#fff", borderRadius: 8,
              textDecoration: "none", fontWeight: 600, fontSize: 14,
            }}>Go to Home</a>
          </div>
        ) : !ready ? (
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: 15, color: "#555", marginBottom: 8 }}>Verifying reset link…</p>
            <p style={{ fontSize: 13, color: "#999" }}>If this takes too long, the link may have expired. Request a new one from the login page.</p>
          </div>
        ) : (
          <form onSubmit={handleReset} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <h2 style={{ fontSize: 22, fontWeight: 600, color: "#222", margin: "0 0 8px", textAlign: "center" }}>
              Set New Password
            </h2>

            <div>
              <label style={{ display: "block", fontSize: 12, color: "#888", marginBottom: 6 }}>New Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} placeholder="Min. 6 characters" />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, color: "#888", marginBottom: 6 }}>Confirm Password</label>
              <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} style={inputStyle} placeholder="Repeat password" />
            </div>

            {error && <p style={{ color: "#e53e3e", fontSize: 13, margin: 0 }}>{error}</p>}

            <button type="submit" disabled={loading} style={{
              width: "100%", padding: "14px 0", marginTop: 4,
              background: loading ? "#ccc" : "#E8906D",
              border: "none", borderRadius: 8, fontSize: 15, fontWeight: 700,
              color: "#fff", cursor: loading ? "not-allowed" : "pointer",
            }}>
              {loading ? "Updating…" : "Update Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
