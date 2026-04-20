"use client";

import { Phone, MapPin, LogOut, User } from "lucide-react";
import { useModal } from "@/contexts/ModalContext";

export default function TopBar() {
  const { openLogin, user, logout, openProfile } = useModal();
  const mobile = user?.user_metadata?.mobile as string | undefined;
  const name = user?.user_metadata?.name as string | undefined;

  return (
    <div className="topbar-wrap" style={{ position: "relative", overflow: "hidden", fontSize: 12 }}>
      {/* Animated gradient background */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(90deg, #0d0a14 0%, #15101e 30%, #1a0e18 60%, #0d0a14 100%)",
        backgroundSize: "300% 100%",
        animation: "topbarShift 8s ease infinite",
      }} />
      {/* Subtle accent line at bottom */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: 1,
        background: "linear-gradient(90deg, transparent 0%, rgba(232,144,109,0.5) 30%, rgba(232,144,109,0.8) 50%, rgba(232,144,109,0.5) 70%, transparent 100%)",
        animation: "topbarLine 4s ease-in-out infinite",
      }} />
      {/* Ambient glow orb */}
      <div style={{
        position: "absolute", width: 300, height: 60, borderRadius: "50%",
        background: "radial-gradient(ellipse, rgba(232,144,109,0.07) 0%, transparent 70%)",
        top: 0, left: "20%", pointerEvents: "none",
        animation: "topbarOrb 10s ease-in-out infinite",
      }} />

      <div className="wrap" style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", justifyContent: "space-between", height: 33, padding: "0 25px" }}>
        {/* Left */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {/* Phone badge instead of NA */}
          <span style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            width: 22, height: 22, borderRadius: 5,
            background: "linear-gradient(135deg, #E8906D, #c96a3f)",
            boxShadow: "0 0 8px rgba(232,144,109,0.4)",
            flexShrink: 0,
          }}>
            <Phone size={11} color="#fff" strokeWidth={2.2} />
          </span>
          <a
            href="tel:+919974057620"
            style={{ display: "flex", alignItems: "center", gap: 5, color: "rgba(255,255,255,0.7)", textDecoration: "none", transition: "color 0.2s" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#E8906D")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
          >
            +91 9974057620
          </a>
        </div>

        {/* Right */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4, color: "rgba(255,255,255,0.55)" }}>
            <MapPin size={11} color="#E8906D" />
            Kadi, Gujarat
          </span>

          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <button
                onClick={openProfile}
                style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, color: "rgba(255,255,255,0.8)", fontWeight: 600, fontSize: 12, fontFamily: "inherit", padding: 0, transition: "color 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#E8906D")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.8)")}
              >
                <User size={12} color="#E8906D" />
                {name || mobile || "My Account"}
              </button>
              <button
                onClick={logout}
                style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.45)", display: "flex", alignItems: "center", gap: 3, fontSize: 12, transition: "color 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#E8906D")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.45)")}
              >
                <LogOut size={11} />
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={openLogin}
              style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.55)", display: "flex", alignItems: "center", gap: 4, fontSize: 12, transition: "color 0.2s" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#E8906D")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.55)")}
            >
              <User size={12} />
              Log In | Sign Up
            </button>
          )}
        </div>
      </div>

      <style>{`
        @keyframes topbarShift {
          0%, 100% { background-position: 0% 50%; }
          50%       { background-position: 100% 50%; }
        }
        @keyframes topbarLine {
          0%, 100% { opacity: 0.6; }
          50%       { opacity: 1; }
        }
        @keyframes topbarOrb {
          0%, 100% { transform: translateX(0); opacity: 1; }
          50%       { transform: translateX(120px); opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
