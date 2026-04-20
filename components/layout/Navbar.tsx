"use client";

import { useState, useEffect } from "react";
import { Menu, X, User } from "lucide-react";
import { useModal } from "@/contexts/ModalContext";
import { supabase } from "@/lib/supabase";
import Image from "next/image";

const leftLinks = [
  { href: "#home", label: "HOME" },
  { href: "#gallery", label: "PORTFOLIO" },
  { href: "#services", label: "SERVICES" },
  { href: "#testimonials", label: "TESTIMONIALS" },
];

const rightLinks = [
  { href: "#about", label: "ABOUT US" },
  { href: "#contact", label: "CONTACT US" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { openLogin, user, logout } = useModal();
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    supabase.from("site_config").select("value").eq("key", "logo").maybeSingle()
      .then(({ data }) => { if (data?.value) setLogoUrl(data.value); });
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNav = (href: string) => {
    setMobileOpen(false);
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const linkStyle: React.CSSProperties = {
    fontSize: 13,
    fontWeight: 500,
    color: "#333",
    background: "none",
    border: "none",
    cursor: "pointer",
    letterSpacing: "0.05em",
    whiteSpace: "nowrap",
    padding: "0 4px",
    textDecoration: "none",
  };

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 400,
        background: "#fff",
        boxShadow: scrolled ? "0 2px 8px rgba(0,0,0,0.1)" : "0 1px 3px rgba(0,0,0,0.06)",
      }}
    >
      <div className="wrap" style={{ padding: 0 }}>
        {/* ── Desktop ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            height: 80,
            padding: "0 0",
          }}
          className="hidden-mobile"
        >
          {/* Left links — right-justified within their half */}
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: 28,
              paddingRight: 32,
            }}
          >
            {leftLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNav(link.href)}
                style={linkStyle}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#E8906D")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#333")}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Center logo */}
          <button
            onClick={() => handleNav("#home")}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              flexShrink: 0,
            }}
          >
            {logoUrl ? (
              <Image src={logoUrl} alt="New Alankar Studio" width={48} height={48}
                style={{ borderRadius: 8, objectFit: "contain" }} unoptimized />
            ) : (
              <div style={{
                width: 48, height: 48, borderRadius: 8, background: "#E8906D",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", fontWeight: 700, fontSize: 15, letterSpacing: "0.05em",
              }}>NA</div>
            )}
            <span style={{ fontSize: 13, fontWeight: 600, color: "#333", letterSpacing: "0.03em" }}>
              New Alankar Studio
            </span>
          </button>

          {/* Right links — left-justified */}
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              gap: 28,
              paddingLeft: 32,
            }}
          >
            {rightLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNav(link.href)}
                style={linkStyle}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#E8906D")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#333")}
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Mobile ── */}
        <div
          className="visible-mobile"
          style={{ display: "flex", alignItems: "center", height: 60, padding: "0 8px" }}
        >
          {/* Hamburger — large 44px touch target */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            onTouchEnd={(e) => { e.preventDefault(); setMobileOpen((v) => !v); }}
            style={{
              width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center",
              background: "none", border: "none", cursor: "pointer", color: "#555", flexShrink: 0,
              position: "relative", zIndex: 1,
            }}
            aria-label="Menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* Logo + Studio name — centered */}
          <button
            onClick={() => handleNav("#home")}
            style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "none", border: "none", cursor: "pointer" }}
          >
            {logoUrl ? (
              <Image src={logoUrl} alt="Logo" width={32} height={32}
                style={{ borderRadius: 6, objectFit: "contain" }} unoptimized />
            ) : (
              <div style={{ width: 32, height: 32, borderRadius: 6, background: "#E8906D", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 12, flexShrink: 0 }}>NA</div>
            )}
            <span style={{ fontSize: 15, fontWeight: 600, color: "#333", letterSpacing: "0.02em" }}>
              New Alankar Studio
            </span>
          </button>

          {/* User icon */}
          <button
            onClick={user ? logout : openLogin}
            onTouchEnd={(e) => { e.preventDefault(); user ? logout() : openLogin(); }}
            style={{ width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", cursor: "pointer", color: user ? "#E8906D" : "#555", flexShrink: 0 }}
            aria-label={user ? "Logout" : "Login"}
          >
            <User size={20} />
          </button>
        </div>

        {mobileOpen && (
          <div style={{ borderTop: "1px solid #f0f0f0", padding: "8px 0" }}>
            {[...leftLinks, ...rightLinks].map((link) => (
              <button
                key={link.href}
                onClick={() => handleNav(link.href)}
                onTouchEnd={(e) => { e.preventDefault(); handleNav(link.href); }}
                style={{ display: "block", width: "100%", textAlign: "left", padding: "10px 16px", fontSize: 14, fontWeight: 500, color: "#333", background: "none", border: "none", cursor: "pointer" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#FEF0EA"; e.currentTarget.style.color = "#E8906D"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "#333"; }}
              >
                {link.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @media (min-width: 768px) { .hidden-mobile { display: flex !important; } .visible-mobile { display: none !important; } }
        @media (max-width: 767px) { .hidden-mobile { display: none !important; } .visible-mobile { display: flex !important; } }
      `}</style>
    </nav>
  );
}
