"use client";

import { useState, useEffect } from "react";
import { useModal } from "@/contexts/ModalContext";
import { supabase } from "@/lib/supabase";

export default function ProfileModal() {
  const { activeModal, closeModal, user, refreshUser } = useModal();
  const [form, setForm] = useState({ name: "", mobile: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (activeModal === "profile" && user) {
      setForm({
        name: (user.user_metadata?.name as string) || "",
        mobile: (user.user_metadata?.mobile as string) || "",
        email: user.email || "",
      });
      setError("");
      setSaved(false);
    }
  }, [activeModal, user]);

  if (activeModal !== "profile") return null;

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.mobile) { setError("Name and mobile are required."); return; }

    setLoading(true);
    const updates: Record<string, string> = { name: form.name, mobile: form.mobile };
    const { error: err } = await supabase.auth.updateUser({ data: updates });
    setLoading(false);

    if (err) { setError(err.message); return; }
    await refreshUser();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
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

  const initials = form.name ? form.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() : "MD";

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
          .profile-modal-left{display:none!important}
          .profile-modal-right{padding:32px 20px!important}
        }
      `}</style>
      <div style={{
        background: "#fff", borderRadius: 14, display: "flex",
        width: 680, maxWidth: "95vw",
        boxShadow: "0 8px 40px rgba(0,0,0,0.18)", position: "relative",
      }}>
        {/* Left panel */}
        <div className="profile-modal-left" style={{
          width: 240, flexShrink: 0, padding: "48px 32px",
          borderRight: "1px solid #eee", display: "flex",
          flexDirection: "column", alignItems: "center", textAlign: "center",
        }}>
          <div style={{
            width: 90, height: 90, borderRadius: "50%", background: "#E8906D",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 26, fontWeight: 700, color: "#fff", marginBottom: 16,
          }}>{initials}</div>
          <p style={{ fontSize: 16, fontWeight: 600, color: "#222", margin: "0 0 4px" }}>{form.name || "Your Name"}</p>
          <p style={{ fontSize: 12, color: "#999", margin: 0 }}>{form.mobile || "Mobile"}</p>
        </div>

        {/* Right panel */}
        <div className="profile-modal-right" style={{ flex: 1, padding: "40px 44px" }}>
          <button onClick={closeModal} style={{
            position: "absolute", top: 16, right: 20,
            background: "none", border: "none", cursor: "pointer",
            fontSize: 20, color: "#aaa", lineHeight: 1,
          }}>×</button>

          <h2 style={{ fontSize: 20, fontWeight: 600, color: "#222", margin: "0 0 28px" }}>My Profile</h2>

          <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            <div>
              <label style={labelStyle}>Full Name *</label>
              <input type="text" value={form.name} onChange={set("name")} style={inputStyle} placeholder="Your name" />
            </div>
            <div>
              <label style={labelStyle}>Mobile No. *</label>
              <input type="tel" value={form.mobile} onChange={set("mobile")} style={inputStyle} placeholder="e.g. 9925305809" />
            </div>
            <div>
              <label style={labelStyle}>Email</label>
              <input type="email" value={form.email} style={{ ...inputStyle, color: "#aaa" }} disabled
                placeholder="Contact support to change email" />
              <p style={{ fontSize: 11, color: "#bbb", margin: "4px 0 0" }}>Email cannot be changed after signup</p>
            </div>

            {error && <p style={{ color: "#e53e3e", fontSize: 13, margin: 0 }}>{error}</p>}
            {saved && <p style={{ color: "#38a169", fontSize: 13, margin: 0 }}>✓ Profile saved!</p>}

            <button type="submit" disabled={loading} style={{
              width: "100%", padding: "13px 0",
              background: loading ? "#ccc" : "#E8906D",
              border: "none", borderRadius: 6, fontSize: 15, fontWeight: 700,
              color: "#fff", cursor: loading ? "not-allowed" : "pointer",
            }}>
              {loading ? "Saving…" : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
