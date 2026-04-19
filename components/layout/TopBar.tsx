"use client";

import { Phone, MapPin, LogOut, User } from "lucide-react";
import { useModal } from "@/contexts/ModalContext";

export default function TopBar() {
  const { openLogin, user, logout, openProfile } = useModal();
  const mobile = user?.user_metadata?.mobile as string | undefined;
  const name = user?.user_metadata?.name as string | undefined;

  return (
    <div className="topbar-wrap" style={{ background: "#fff", borderBottom: "1px solid #e8e8e8", fontSize: 12, color: "#555" }}>
      <div className="wrap" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 33, padding: "0 25px" }}>
        {/* Left */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4, fontWeight: 700, color: "#333", border: "1px solid #ccc", padding: "1px 6px", borderRadius: 3, fontSize: 11 }}>
            MD
          </span>
          <a
            href="tel:+919925305809"
            style={{ display: "flex", alignItems: "center", gap: 5, color: "#555", textDecoration: "none" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#E8906D")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#555")}
          >
            <Phone size={11} />
            +91-9925305809
          </a>
        </div>

        {/* Right */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <MapPin size={11} color="#E8906D" />
            Kadi, Gujarat
          </span>

          {user ? (
            /* Logged-in state */
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <button
                onClick={openProfile}
                style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, color: "#333", fontWeight: 600, fontSize: 12, fontFamily: "inherit", padding: 0 }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#E8906D")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#333")}
              >
                <User size={12} color="#E8906D" />
                {name || mobile || "My Account"}
              </button>
              <button
                onClick={logout}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#888", display: "flex", alignItems: "center", gap: 3, fontSize: 12 }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#E8906D")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#888")}
              >
                <LogOut size={11} />
                Logout
              </button>
            </div>
          ) : (
            /* Logged-out state */
            <button
              onClick={openLogin}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#555", display: "flex", alignItems: "center", gap: 4, fontSize: 12 }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#E8906D")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#555")}
            >
              <User size={12} />
              Log In | Sign Up
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
