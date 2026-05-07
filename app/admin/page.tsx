"use client";

import { useState, useEffect, useRef } from "react";
import { useModal } from "@/contexts/ModalContext";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import { Trash2, Upload, LogOut, Pencil, X, Check, Plus, Phone, MapPin, Mail, Clock, ExternalLink, Wifi, WifiOff } from "lucide-react";
import servicesData from "@/data/services.json";

interface GalleryImage { id: string; url: string; caption: string | null; category: string | null; }
interface Service { id: string; title: string; description: string; image_url: string; sort_order: number; }
interface Testimonial { id: string; name: string; location: string; rating: number; review: string; sort_order: number; }

const DEFAULT_CONTACT = {
  address: "Shefali Compound Near Shefali Cinema, Kadi - Detroj Rd, Near Krishna Hospital, Kadi, Gujarat 382715",
  email:   "jmodi1040@gmail.com",
  phone:   "+91 9974057620",
  timings: "Mon – Sun : Open 24 hrs",
};

// ── Shared dark-glass input style ──────────────────────────────────
const darkInput: React.CSSProperties = {
  width: "100%", boxSizing: "border-box",
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: 8, padding: "10px 14px",
  fontSize: 13, color: "#fff",
  outline: "none", fontFamily: "inherit",
  backdropFilter: "blur(4px)",
  transition: "border-color 0.2s",
};

export default function AdminPage() {
  const { user, logout } = useModal();

  // gallery / config state
  const [gallery, setGallery]         = useState<GalleryImage[]>([]);
  const [logoUrl, setLogoUrl]         = useState("");
  const [heroUrl, setHeroUrl]         = useState("");
  const [aboutUrl, setAboutUrl]       = useState("");
  const [contactBgUrl, setContactBgUrl] = useState("");
  const [uploading, setUploading]     = useState<string | null>(null);
  const [status, setStatus]           = useState("");
  const [authChecked, setAuthChecked] = useState(false);

  // services state
  const [services, setServices]               = useState<Service[]>([]);
  const [editingId, setEditingId]             = useState<string | null>(null);
  const [editForm, setEditForm]               = useState({ title: "", description: "" });
  const [addingService, setAddingService]     = useState(false);
  const [newSvc, setNewSvc]                   = useState({ title: "", description: "" });
  const [serviceTableMissing, setServiceTableMissing] = useState(false);

  // contact info state
  const [contactInfo, setContactInfo]   = useState(DEFAULT_CONTACT);
  const [savingContact, setSavingContact] = useState(false);

  // testimonials state
  const [testimonials,     setTestimonials]     = useState<Testimonial[]>([]);
  const [addingTestimonial, setAddingTestimonial] = useState(false);
  const [savingTestimonial, setSavingTestimonial] = useState(false);
  const [newTestimonial,   setNewTestimonial]   = useState({ name: "", location: "", rating: 5, review: "" });

  // instagram connection check
  const [igStatus, setIgStatus] = useState<{ checking: boolean; configured?: boolean; count?: number; error?: string }>({ checking: false });

  // about us text state
  const [aboutContent, setAboutContent] = useState({
    heading:  "About Jaimin Modi Photography",
    subtitle: "Wedding & Candid Photographer · Kadi, Gujarat",
    para1:    "Welcome to Jaimin Modi Photography — one of the most trusted photography studios in Kadi, Mehsana, Gujarat. We specialise in capturing life's most precious moments through authentic, artistic, and emotionally rich imagery.",
    para2:    "From candid wedding photography and pre-wedding shoots to model portfolios, baby photography, and cinematic video — our studio brings creativity and passion to every frame. With years of experience serving clients across Kadi, Mehsana, Ahmedabad, and all of Gujarat, we understand how to tell your story beautifully.",
    stats: [
      { number: "500+", label: "Weddings Photographed" },
      { number: "8+",   label: "Years of Experience" },
      { number: "15+",  label: "Services Offered" },
      { number: "100%", label: "Client Satisfaction" },
    ],
  });
  const [savingAbout, setSavingAbout] = useState(false);

  // refs
  const galleryRef    = useRef<HTMLInputElement>(null);
  const logoRef       = useRef<HTMLInputElement>(null);
  const heroRef       = useRef<HTMLInputElement>(null);
  const aboutRef      = useRef<HTMLInputElement>(null);
  const contactBgRef  = useRef<HTMLInputElement>(null);
  const svcImgRef     = useRef<HTMLInputElement>(null);
  const [pendingSvcImgId, setPendingSvcImgId] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setAuthChecked(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (user) { setAuthChecked(true); loadData(); }
  }, [user]);

  const loadData = async () => {
    const [{ data: imgs }, { data: cfg }, { data: svcs, error: svcsErr }, { data: reviews }] = await Promise.all([
      supabase.from("gallery_images").select("*").order("created_at", { ascending: false }),
      supabase.from("site_config").select("*"),
      supabase.from("services").select("*").order("sort_order", { ascending: true }),
      supabase.from("testimonials").select("*").order("sort_order", { ascending: true }),
    ]);
    if (reviews) setTestimonials(reviews);

    if (imgs) setGallery(imgs);
    if (cfg) {
      const get = (k: string) => cfg.find((r) => r.key === k)?.value || "";
      setLogoUrl(get("logo"));
      setHeroUrl(get("hero_image"));
      setAboutUrl(get("about_image"));
      setContactBgUrl(get("contact_bg"));
      setContactInfo({
        address: get("contact_address") || DEFAULT_CONTACT.address,
        email:   get("contact_email")   || DEFAULT_CONTACT.email,
        phone:   get("contact_phone")   || DEFAULT_CONTACT.phone,
        timings: get("contact_timings") || DEFAULT_CONTACT.timings,
      });
      const rawStats = get("about_stats");
      setAboutContent({
        heading:  get("about_heading")  || "About Jaimin Modi Photography",
        subtitle: get("about_subtitle") || "Wedding & Candid Photographer · Kadi, Gujarat",
        para1:    get("about_para1")    || "Welcome to Jaimin Modi Photography — one of the most trusted photography studios in Kadi, Mehsana, Gujarat. We specialise in capturing life's most precious moments through authentic, artistic, and emotionally rich imagery.",
        para2:    get("about_para2")    || "From candid wedding photography and pre-wedding shoots to model portfolios, baby photography, and cinematic video — our studio brings creativity and passion to every frame. With years of experience serving clients across Kadi, Mehsana, Ahmedabad, and all of Gujarat, we understand how to tell your story beautifully.",
        stats: rawStats
          ? (JSON.parse(rawStats) as { number: string; label: string }[])
          : [
            { number: "500+", label: "Weddings Photographed" },
            { number: "8+",   label: "Years of Experience" },
            { number: "15+",  label: "Services Offered" },
            { number: "100%", label: "Client Satisfaction" },
          ],
      });
    }
    if (svcsErr) {
      setServiceTableMissing(true);
    } else if (svcs && svcs.length > 0) {
      setServices(svcs);
    } else if (svcs && svcs.length === 0) {
      await seedServices();
    }

  };

  const seedServices = async () => {
    const rows = servicesData.map((s, i) => ({
      title: s.title, description: s.description, image_url: s.image, sort_order: i,
    }));
    const { data } = await supabase.from("services").insert(rows).select();
    if (data) setServices(data);
  };

  // Compress image using Canvas API before upload (reduces Supabase egress by 10–50x)
  const compressImage = (file: File, maxWidth = 1920, quality = 0.82): Promise<File> =>
    new Promise((resolve) => {
      // Skip tiny files or non-images
      if (file.size < 200 * 1024 || !file.type.startsWith("image/")) { resolve(file); return; }
      const img = new window.Image();
      const objectUrl = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
        let { width, height } = img;
        if (width > maxWidth) { height = Math.round(height * maxWidth / width); width = maxWidth; }
        const canvas = document.createElement("canvas");
        canvas.width = width; canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) { resolve(file); return; }
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const outName = file.name.replace(/\.[^.]+$/, ".jpg");
              resolve(new File([blob], outName, { type: "image/jpeg" }));
            } else resolve(file);
          },
          "image/jpeg",
          quality,
        );
      };
      img.onerror = () => { URL.revokeObjectURL(objectUrl); resolve(file); };
      img.src = objectUrl;
    });

  const uploadFile = async (file: File, folder: string): Promise<string | null> => {
    // Compress image before upload
    const compressed = await compressImage(file);

    try {
      // Convert file to base64 and send as JSON to avoid FormData parsing issues
      const arrayBuffer = await compressed.arrayBuffer();
      const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

      const res = await fetch("/api/upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          folder,
          filename:    compressed.name,
          contentType: compressed.type || "image/jpeg",
          base64,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: res.statusText }));
        throw new Error(err.error || res.statusText);
      }

      const { publicUrl } = await res.json();
      return publicUrl;

    } catch (err) {
      // Show actual error and fallback to Supabase
      const errMsg = err instanceof Error ? err.message : String(err);
      console.error("R2 upload failed:", errMsg);
      setStatus("⚠️ R2 failed (" + errMsg + "), using Supabase...");
      const isImg = compressed.type === "image/jpeg";
      const ext   = isImg ? "jpg" : (file.name.split(".").pop() ?? "bin");
      const path  = `${folder}/${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from("studio-images").upload(path, compressed, {
        contentType: isImg ? "image/jpeg" : (file.type || "application/octet-stream"),
        cacheControl: "31536000",
      });
      if (error) { setStatus("Upload failed: " + error.message); return null; }
      const { data: { publicUrl } } = supabase.storage.from("studio-images").getPublicUrl(path);
      return publicUrl;
    }
  };

  // ── Gallery ──────────────────────────────────────────
  const handleGalleryUpload = async (files: FileList) => {
    setUploading("gallery"); setStatus("");
    for (const file of Array.from(files)) {
      const url = await uploadFile(file, "gallery");
      if (url) await supabase.from("gallery_images").insert({ url, caption: null, category: null });
    }
    await loadData();
    setUploading(null);
    setStatus(`✓ ${files.length} image${files.length > 1 ? "s" : ""} uploaded!`);
  };

  const deleteGalleryImage = async (img: GalleryImage) => {
    if (!confirm("Delete this image?")) return;
    const path = img.url.split("/studio-images/")[1];
    if (path) await supabase.storage.from("studio-images").remove([path]);
    await supabase.from("gallery_images").delete().eq("id", img.id);
    setGallery((g) => g.filter((i) => i.id !== img.id));
    setStatus("✓ Image deleted.");
  };

  // ── Site Config ───────────────────────────────────────
  const handleConfigUpload = async (file: File, key: string) => {
    setUploading(key); setStatus("");
    const url = await uploadFile(file, key);
    if (url) {
      await supabase.from("site_config").upsert({ key, value: url, updated_at: new Date().toISOString() });
      if (key === "logo")      setLogoUrl(url);
      if (key === "hero_image") setHeroUrl(url);
      if (key === "about_image") setAboutUrl(url);
      if (key === "contact_bg") setContactBgUrl(url);
      setStatus("✓ Image updated!");
    }
    setUploading(null);
  };

  // ── Contact Info ──────────────────────────────────────
  const saveContactInfo = async () => {
    setSavingContact(true); setStatus("");
    const rows = [
      { key: "contact_address", value: contactInfo.address },
      { key: "contact_email",   value: contactInfo.email },
      { key: "contact_phone",   value: contactInfo.phone },
      { key: "contact_timings", value: contactInfo.timings },
    ];
    await Promise.all(rows.map((r) =>
      supabase.from("site_config").upsert({ ...r, updated_at: new Date().toISOString() })
    ));
    setSavingContact(false);
    setStatus("✓ Contact info updated!");
  };

  // ── About Us Content ──────────────────────────────────
  const saveAboutContent = async () => {
    setSavingAbout(true); setStatus("");
    const rows = [
      { key: "about_heading",  value: aboutContent.heading },
      { key: "about_subtitle", value: aboutContent.subtitle },
      { key: "about_para1",    value: aboutContent.para1 },
      { key: "about_para2",    value: aboutContent.para2 },
      { key: "about_stats",    value: JSON.stringify(aboutContent.stats) },
    ];
    await Promise.all(rows.map((r) =>
      supabase.from("site_config").upsert({ ...r, updated_at: new Date().toISOString() })
    ));
    setSavingAbout(false);
    setStatus("✓ About Us content updated!");
  };

  // ── Services ─────────────────────────────────────────
  const startEdit  = (svc: Service) => { setEditingId(svc.id); setEditForm({ title: svc.title, description: svc.description }); };
  const cancelEdit = () => setEditingId(null);

  const saveEdit = async (id: string) => {
    const { error } = await supabase.from("services").update({ title: editForm.title, description: editForm.description }).eq("id", id);
    if (!error) { setServices((s) => s.map((sv) => sv.id === id ? { ...sv, ...editForm } : sv)); setEditingId(null); setStatus("✓ Service updated."); }
    else setStatus("Error: " + error.message);
  };

  const deleteService = async (id: string) => {
    if (!confirm("Delete this service?")) return;
    await supabase.from("services").delete().eq("id", id);
    setServices((s) => s.filter((sv) => sv.id !== id));
    setStatus("✓ Service deleted.");
  };

  const handleServiceImageUpload = async (id: string, file: File) => {
    setUploading("svc-" + id); setStatus("");
    const url = await uploadFile(file, "services");
    if (url) {
      await supabase.from("services").update({ image_url: url }).eq("id", id);
      setServices((s) => s.map((sv) => sv.id === id ? { ...sv, image_url: url } : sv));
      setStatus("✓ Service image updated.");
    }
    setUploading(null); setPendingSvcImgId(null);
  };

  const handleAddService = async (imageFile: File | null) => {
    if (!newSvc.title.trim()) { setStatus("Please enter a title."); return; }
    setUploading("new-svc"); setStatus("");
    let imageUrl = "";
    if (imageFile) { const url = await uploadFile(imageFile, "services"); if (url) imageUrl = url; }
    const { data, error } = await supabase.from("services").insert({
      title: newSvc.title, description: newSvc.description, image_url: imageUrl, sort_order: services.length,
    }).select().single();
    if (data) { setServices((s) => [...s, data]); setNewSvc({ title: "", description: "" }); setAddingService(false); setStatus("✓ New service added."); }
    else setStatus("Error: " + error?.message);
    setUploading(null);
  };

  // ── Testimonials ─────────────────────────────────────
  const addTestimonial = async () => {
    if (!newTestimonial.name.trim() || !newTestimonial.review.trim()) {
      setStatus("Please enter a name and review."); return;
    }
    setSavingTestimonial(true); setStatus("");
    const { data, error } = await supabase.from("testimonials").insert({
      name:       newTestimonial.name.trim(),
      location:   newTestimonial.location.trim(),
      rating:     newTestimonial.rating,
      review:     newTestimonial.review.trim(),
      sort_order: testimonials.length,
    }).select().single();
    if (data) {
      setTestimonials((t) => [...t, data]);
      setNewTestimonial({ name: "", location: "", rating: 5, review: "" });
      setAddingTestimonial(false);
      setStatus("✓ Testimonial added!");
    } else setStatus("Error: " + error?.message);
    setSavingTestimonial(false);
  };

  const deleteTestimonial = async (id: string) => {
    if (!confirm("Delete this testimonial?")) return;
    await supabase.from("testimonials").delete().eq("id", id);
    setTestimonials((t) => t.filter((r) => r.id !== id));
    setStatus("✓ Testimonial deleted.");
  };

  // ── Instagram connection check ───────────────────────
  const checkInstagram = async () => {
    setIgStatus({ checking: true });
    try {
      const res  = await fetch("/api/instagram");
      const json = await res.json();
      setIgStatus({ checking: false, configured: json.configured, count: json.reels?.length ?? 0, error: json.error });
    } catch {
      setIgStatus({ checking: false, configured: false, error: "Network error" });
    }
  };

  // ── Auth guards ───────────────────────────────────────
  if (!authChecked || (!user && !authChecked)) return <FullscreenState type="loading" />;
  if (!user) return <FullscreenState type="no-user" />;
  const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  if (ADMIN_EMAIL && user.email !== ADMIN_EMAIL) return <FullscreenState type="denied" />;

  // ── Render ────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "#06060e", position: "relative", overflow: "hidden" }}>

      {/* ── Animated background orbs ── */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{ position: "absolute", width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle, rgba(232,144,109,0.06) 0%, transparent 65%)", top: -200, left: -150, animation: "adminOrb1 18s ease-in-out infinite" }} />
        <div style={{ position: "absolute", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(80,130,255,0.05) 0%, transparent 65%)", bottom: -100, right: -100, animation: "adminOrb2 22s ease-in-out infinite reverse" }} />
        <div style={{ position: "absolute", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(232,144,109,0.04) 0%, transparent 65%)", top: "40%", right: "15%", animation: "adminOrb1 14s ease-in-out infinite 3s" }} />
        {/* Subtle grid pattern */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
      </div>

      {/* ── Header ── */}
      <div style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(6,6,14,0.85)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(232,144,109,0.2)", padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
        {/* Left: logo + title */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: "linear-gradient(135deg, #E8906D, #c96a3f)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 15, letterSpacing: "0.05em", boxShadow: "0 0 16px rgba(232,144,109,0.4)" }}>JM</div>
          <div>
            <p style={{ fontSize: 15, fontWeight: 700, color: "#fff", margin: 0, letterSpacing: "0.02em" }}>Admin Panel</p>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", margin: 0 }}>Jaimin Modi Photography</p>
          </div>
        </div>
        {/* Right: nav */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "rgba(255,255,255,0.5)", textDecoration: "none", padding: "7px 14px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", transition: "all 0.2s" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(232,144,109,0.4)"; (e.currentTarget as HTMLElement).style.color = "#E8906D"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.5)"; }}
          >
            <ExternalLink size={13} /> View Site
          </a>
          <button onClick={logout} style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,80,80,0.08)", border: "1px solid rgba(255,80,80,0.2)", borderRadius: 8, padding: "7px 14px", cursor: "pointer", fontSize: 13, color: "rgba(255,120,120,0.8)", transition: "all 0.2s" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,80,80,0.15)"; (e.currentTarget as HTMLElement).style.color = "#ff8080"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,80,80,0.08)"; (e.currentTarget as HTMLElement).style.color = "rgba(255,120,120,0.8)"; }}
          >
            <LogOut size={13} /> Logout
          </button>
        </div>
      </div>

      {/* ── Main content ── */}
      <div style={{ position: "relative", zIndex: 1, maxWidth: 1100, margin: "0 auto", padding: "36px 24px", display: "flex", flexDirection: "column", gap: 28 }}>

        {/* Status toast */}
        {status && (
          <div style={{
            background: status.startsWith("✓") ? "rgba(52,211,153,0.12)" : "rgba(248,113,113,0.12)",
            border: `1px solid ${status.startsWith("✓") ? "rgba(52,211,153,0.3)" : "rgba(248,113,113,0.3)"}`,
            borderRadius: 10, padding: "13px 18px",
            color: status.startsWith("✓") ? "#6ee7b7" : "#fca5a5",
            fontSize: 14, display: "flex", alignItems: "center", gap: 8,
          }}>
            <span style={{ fontSize: 16 }}>{status.startsWith("✓") ? "✓" : "⚠"}</span>
            {status.slice(status.startsWith("✓") ? 2 : 2)}
            <button onClick={() => setStatus("")} style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: "inherit", opacity: 0.6, fontSize: 16 }}>×</button>
          </div>
        )}

        {/* ── Logo ── */}
        <DarkCard title="Studio Logo" subtitle="Shown in the navbar — use a transparent PNG for best results" icon="🖼">
          <div style={{ display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ width: 96, height: 96, borderRadius: 14, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, overflow: "hidden" }}>
              {logoUrl
                ? <Image src={logoUrl} alt="Logo" width={96} height={96} style={{ objectFit: "contain" }} unoptimized />
                : <span style={{ fontSize: 26, fontWeight: 800, color: "#E8906D" }}>JM</span>}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", margin: 0, lineHeight: 1.6 }}>PNG with transparent background recommended.<br />Square format (e.g. 200×200px) works best.</p>
              <input ref={logoRef} type="file" accept="image/*" style={{ display: "none" }}
                onChange={(e) => e.target.files?.[0] && handleConfigUpload(e.target.files[0], "logo")} />
              <DarkUploadBtn loading={uploading === "logo"} onClick={() => logoRef.current?.click()} />
            </div>
          </div>
        </DarkCard>

        {/* ── Hero ── */}
        <DarkCard title="Hero Background" subtitle="The main background on the homepage — supports image or video" icon="🎬">
          <div style={{ display: "flex", gap: 24, alignItems: "flex-start", flexWrap: "wrap" }}>
            {heroUrl && (
              <div style={{ width: 280, height: 160, borderRadius: 10, overflow: "hidden", flexShrink: 0, background: "#000", position: "relative", border: "1px solid rgba(255,255,255,0.1)" }}>
                {["mp4","webm","mov","ogg"].some((e) => heroUrl.toLowerCase().split("?")[0].endsWith(`.${e}`)) ? (
                  <video src={heroUrl} muted autoPlay loop playsInline style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <Image src={heroUrl} alt="Hero" fill style={{ objectFit: "cover" }} unoptimized />
                )}
              </div>
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: 10, justifyContent: "center" }}>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", margin: 0, lineHeight: 1.6 }}>Image: JPG/PNG (recommended 1920×1080)<br />Video: MP4/WebM (keep under 20MB)</p>
              <input ref={heroRef} type="file" accept="image/*,video/mp4,video/webm,video/quicktime" style={{ display: "none" }}
                onChange={(e) => e.target.files?.[0] && handleConfigUpload(e.target.files[0], "hero_image")} />
              <DarkUploadBtn loading={uploading === "hero_image"} onClick={() => heroRef.current?.click()} />
            </div>
          </div>
        </DarkCard>

        {/* ── About ── */}
        <DarkCard title="About Us Image" subtitle="The photo shown in the About Us section" icon="📷">
          <div style={{ display: "flex", gap: 24, alignItems: "flex-start", flexWrap: "wrap" }}>
            {aboutUrl && (
              <div style={{ position: "relative", width: 220, height: 165, borderRadius: 10, overflow: "hidden", flexShrink: 0, border: "1px solid rgba(255,255,255,0.1)" }}>
                <Image src={aboutUrl} alt="About" fill style={{ objectFit: "cover" }} unoptimized />
              </div>
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: 10, justifyContent: "center" }}>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", margin: 0 }}>Upload a portrait or square photo (recommended: 800×600px)</p>
              <input ref={aboutRef} type="file" accept="image/*" style={{ display: "none" }}
                onChange={(e) => e.target.files?.[0] && handleConfigUpload(e.target.files[0], "about_image")} />
              <DarkUploadBtn loading={uploading === "about_image"} onClick={() => aboutRef.current?.click()} />
            </div>
          </div>
        </DarkCard>

        {/* ── About Us Content ── */}
        <DarkCard title="About Us — Text Content" subtitle="Edit the heading, tagline, paragraphs and stats shown in the About section" icon="✍️">
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Heading */}
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.5)", marginBottom: 8, letterSpacing: "0.06em", textTransform: "uppercase" }}>Section Heading</label>
              <input
                type="text"
                value={aboutContent.heading}
                onChange={(e) => setAboutContent((c) => ({ ...c, heading: e.target.value }))}
                style={darkInput}
                placeholder="About Jaimin Modi Photography"
                onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(232,144,109,0.5)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")}
              />
            </div>

            {/* Subtitle / tagline */}
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.5)", marginBottom: 8, letterSpacing: "0.06em", textTransform: "uppercase" }}>Tagline / Subtitle</label>
              <input
                type="text"
                value={aboutContent.subtitle}
                onChange={(e) => setAboutContent((c) => ({ ...c, subtitle: e.target.value }))}
                style={darkInput}
                placeholder="Wedding & Candid Photographer · Kadi, Gujarat"
                onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(232,144,109,0.5)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")}
              />
            </div>

            {/* Paragraph 1 */}
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.5)", marginBottom: 8, letterSpacing: "0.06em", textTransform: "uppercase" }}>Paragraph 1</label>
              <textarea
                value={aboutContent.para1}
                onChange={(e) => setAboutContent((c) => ({ ...c, para1: e.target.value }))}
                rows={4}
                style={{ ...darkInput, resize: "vertical" }}
                placeholder="Introduction paragraph…"
                onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(232,144,109,0.5)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")}
              />
            </div>

            {/* Paragraph 2 */}
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.5)", marginBottom: 8, letterSpacing: "0.06em", textTransform: "uppercase" }}>Paragraph 2</label>
              <textarea
                value={aboutContent.para2}
                onChange={(e) => setAboutContent((c) => ({ ...c, para2: e.target.value }))}
                rows={4}
                style={{ ...darkInput, resize: "vertical" }}
                placeholder="Services / experience paragraph…"
                onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(232,144,109,0.5)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")}
              />
            </div>

            {/* Stats */}
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.5)", marginBottom: 10, letterSpacing: "0.06em", textTransform: "uppercase" }}>Achievement Stats (4 boxes)</label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {aboutContent.stats.map((stat, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, alignItems: "center", background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: "10px 12px", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <input
                      type="text"
                      value={stat.number}
                      onChange={(e) => {
                        const updated = [...aboutContent.stats];
                        updated[i] = { ...updated[i], number: e.target.value };
                        setAboutContent((c) => ({ ...c, stats: updated }));
                      }}
                      style={{ ...darkInput, width: 72, flexShrink: 0, textAlign: "center", fontWeight: 700, fontSize: 15, color: "#E8906D", padding: "8px 10px" }}
                      placeholder="500+"
                      onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(232,144,109,0.5)")}
                      onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")}
                    />
                    <input
                      type="text"
                      value={stat.label}
                      onChange={(e) => {
                        const updated = [...aboutContent.stats];
                        updated[i] = { ...updated[i], label: e.target.value };
                        setAboutContent((c) => ({ ...c, stats: updated }));
                      }}
                      style={{ ...darkInput, flex: 1, padding: "8px 10px", fontSize: 12 }}
                      placeholder="Label"
                      onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(232,144,109,0.5)")}
                      onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")}
                    />
                  </div>
                ))}
              </div>
            </div>

          </div>
          <div style={{ marginTop: 20 }}>
            <button
              onClick={saveAboutContent}
              disabled={savingAbout}
              style={{ display: "flex", alignItems: "center", gap: 8, background: savingAbout ? "rgba(232,144,109,0.3)" : "linear-gradient(135deg, #E8906D, #c96a3f)", border: "none", borderRadius: 8, padding: "11px 24px", color: "#fff", fontSize: 14, fontWeight: 600, cursor: savingAbout ? "not-allowed" : "pointer", boxShadow: savingAbout ? "none" : "0 4px 16px rgba(232,144,109,0.35)", transition: "all 0.2s" }}
            >
              <Check size={15} />
              {savingAbout ? "Saving…" : "Save About Us"}
            </button>
          </div>
        </DarkCard>

        {/* ── Contact Section Background ── */}
        <DarkCard title="Contact Section Background" subtitle="Photo shown behind the Contact Us section" icon="🖼">
          <div style={{ display: "flex", gap: 24, alignItems: "flex-start", flexWrap: "wrap" }}>
            {contactBgUrl && (
              <div style={{ position: "relative", width: 280, height: 160, borderRadius: 10, overflow: "hidden", flexShrink: 0, border: "1px solid rgba(255,255,255,0.1)" }}>
                <Image src={contactBgUrl} alt="Contact BG" fill style={{ objectFit: "cover" }} unoptimized />
              </div>
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: 10, justifyContent: "center" }}>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", margin: 0 }}>JPG/PNG (recommended 1920×1080). A dark overlay is applied automatically.</p>
              <input ref={contactBgRef} type="file" accept="image/*" style={{ display: "none" }}
                onChange={(e) => e.target.files?.[0] && handleConfigUpload(e.target.files[0], "contact_bg")} />
              <DarkUploadBtn loading={uploading === "contact_bg"} onClick={() => contactBgRef.current?.click()} />
            </div>
          </div>
        </DarkCard>

        {/* ── Contact Info ── */}
        <DarkCard title="Contact Information" subtitle="Displayed on the website's Contact Us section — phone, address, email & timings" icon="📞">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {/* Phone */}
            <div>
              <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.5)", marginBottom: 8, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                <Phone size={12} color="#E8906D" /> Phone Number
              </label>
              <input
                type="text"
                value={contactInfo.phone}
                onChange={(e) => setContactInfo((c) => ({ ...c, phone: e.target.value }))}
                style={darkInput}
                placeholder="+91 XXXXXXXXXX"
                onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(232,144,109,0.5)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")}
              />
            </div>
            {/* Email */}
            <div>
              <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.5)", marginBottom: 8, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                <Mail size={12} color="#E8906D" /> Email Address
              </label>
              <input
                type="email"
                value={contactInfo.email}
                onChange={(e) => setContactInfo((c) => ({ ...c, email: e.target.value }))}
                style={darkInput}
                placeholder="studio@example.com"
                onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(232,144,109,0.5)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")}
              />
            </div>
            {/* Timings */}
            <div>
              <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.5)", marginBottom: 8, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                <Clock size={12} color="#E8906D" /> Business Hours
              </label>
              <input
                type="text"
                value={contactInfo.timings}
                onChange={(e) => setContactInfo((c) => ({ ...c, timings: e.target.value }))}
                style={darkInput}
                placeholder="Mon – Sun : Open 24 hrs"
                onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(232,144,109,0.5)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")}
              />
            </div>
            {/* Address spans full width */}
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.5)", marginBottom: 8, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                <MapPin size={12} color="#E8906D" /> Studio Address
              </label>
              <textarea
                value={contactInfo.address}
                onChange={(e) => setContactInfo((c) => ({ ...c, address: e.target.value }))}
                rows={3}
                style={{ ...darkInput, resize: "vertical" }}
                placeholder="Full studio address..."
                onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(232,144,109,0.5)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")}
              />
            </div>
          </div>
          <div style={{ marginTop: 20 }}>
            <button
              onClick={saveContactInfo}
              disabled={savingContact}
              style={{ display: "flex", alignItems: "center", gap: 8, background: savingContact ? "rgba(232,144,109,0.3)" : "linear-gradient(135deg, #E8906D, #c96a3f)", border: "none", borderRadius: 8, padding: "11px 24px", color: "#fff", fontSize: 14, fontWeight: 600, cursor: savingContact ? "not-allowed" : "pointer", boxShadow: savingContact ? "none" : "0 4px 16px rgba(232,144,109,0.35)", transition: "all 0.2s" }}
            >
              <Check size={15} />
              {savingContact ? "Saving…" : "Save Contact Info"}
            </button>
          </div>
        </DarkCard>

        {/* ── Services ── */}
        <DarkCard title={`We Offer — Services (${services.length})`} subtitle="Add, edit, or remove service categories shown on the homepage" icon="⚡">
          {serviceTableMissing ? (
            <div style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.25)", borderRadius: 10, padding: 18 }}>
              <p style={{ fontSize: 14, color: "#fca5a5", fontWeight: 600, marginBottom: 8 }}>⚠ Services table not found in Supabase</p>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 12 }}>Run this SQL in your Supabase dashboard → SQL Editor:</p>
              <pre style={{ background: "rgba(0,0,0,0.4)", color: "#e2e8f0", borderRadius: 8, padding: 14, fontSize: 12, overflowX: "auto", lineHeight: 1.6, border: "1px solid rgba(255,255,255,0.08)" }}>{`CREATE TABLE services (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text DEFAULT '',
  image_url text DEFAULT '',
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON services FOR SELECT USING (true);
CREATE POLICY "Auth write" ON services FOR ALL USING (auth.role() = 'authenticated');`}</pre>
              <button onClick={() => { setServiceTableMissing(false); loadData(); }} style={{ marginTop: 12, background: "linear-gradient(135deg, #E8906D, #c96a3f)", border: "none", borderRadius: 8, padding: "9px 18px", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                I've run the SQL — Retry
              </button>
            </div>
          ) : (
            <>
              <input ref={svcImgRef} type="file" accept="image/*" style={{ display: "none" }}
                onChange={(e) => {
                  if (e.target.files?.[0] && pendingSvcImgId) {
                    handleServiceImageUpload(pendingSvcImgId, e.target.files[0]);
                    e.target.value = "";
                  }
                }} />

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {services.map((svc) => {
                  const isEditing  = editingId === svc.id;
                  const isUploading = uploading === "svc-" + svc.id;
                  return (
                    <div key={svc.id} style={{ display: "flex", gap: 14, alignItems: "flex-start", border: `1px solid ${isEditing ? "rgba(232,144,109,0.3)" : "rgba(255,255,255,0.07)"}`, borderRadius: 12, padding: 14, background: isEditing ? "rgba(232,144,109,0.06)" : "rgba(255,255,255,0.03)", transition: "all 0.2s" }}>
                      {/* Thumbnail */}
                      <div style={{ position: "relative", width: 88, height: 66, borderRadius: 8, overflow: "hidden", background: "rgba(255,255,255,0.05)", flexShrink: 0, border: "1px solid rgba(255,255,255,0.08)" }}>
                        {svc.image_url
                          ? <Image src={svc.image_url} alt={svc.title} fill style={{ objectFit: "cover" }} unoptimized />
                          : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "rgba(255,255,255,0.2)" }}>No image</div>
                        }
                        <button
                          onClick={() => { setPendingSvcImgId(svc.id); svcImgRef.current?.click(); }}
                          disabled={isUploading}
                          style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0, transition: "opacity 0.2s" }}
                          onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                          onMouseLeave={(e) => (e.currentTarget.style.opacity = "0")}
                          title="Change image"
                        >
                          {isUploading ? <span style={{ fontSize: 10, color: "#fff" }}>…</span> : <Upload size={13} color="#fff" />}
                        </button>
                      </div>

                      {/* Content */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        {isEditing ? (
                          <>
                            <input
                              value={editForm.title}
                              onChange={(e) => setEditForm((f) => ({ ...f, title: e.target.value }))}
                              style={{ ...darkInput, marginBottom: 8, fontWeight: 600 }}
                              placeholder="Service title"
                            />
                            <textarea
                              value={editForm.description}
                              onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))}
                              rows={2}
                              style={{ ...darkInput, resize: "vertical" }}
                              placeholder="Description"
                            />
                          </>
                        ) : (
                          <>
                            <p style={{ fontSize: 14, fontWeight: 600, color: "#fff", margin: "0 0 4px" }}>{svc.title}</p>
                            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", margin: 0, lineHeight: 1.5 }}>{svc.description || <span style={{ color: "rgba(255,255,255,0.2)" }}>No description</span>}</p>
                          </>
                        )}
                      </div>

                      {/* Actions */}
                      <div style={{ display: "flex", flexDirection: "column", gap: 6, flexShrink: 0 }}>
                        {isEditing ? (
                          <>
                            <DarkIconBtn onClick={() => saveEdit(svc.id)} accent title="Save"><Check size={13} /></DarkIconBtn>
                            <DarkIconBtn onClick={cancelEdit} title="Cancel"><X size={13} /></DarkIconBtn>
                          </>
                        ) : (
                          <>
                            <DarkIconBtn onClick={() => startEdit(svc)} title="Edit"><Pencil size={13} /></DarkIconBtn>
                            <DarkIconBtn onClick={() => deleteService(svc.id)} danger title="Delete"><Trash2 size={13} /></DarkIconBtn>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {addingService ? (
                <DarkAddServiceForm
                  value={newSvc}
                  onChange={setNewSvc}
                  onSave={handleAddService}
                  onCancel={() => { setAddingService(false); setNewSvc({ title: "", description: "" }); }}
                  loading={uploading === "new-svc"}
                />
              ) : (
                <button
                  onClick={() => setAddingService(true)}
                  style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 8, background: "none", border: "2px dashed rgba(232,144,109,0.4)", borderRadius: 10, padding: "13px 20px", color: "#E8906D", fontSize: 14, fontWeight: 600, cursor: "pointer", width: "100%", transition: "all 0.2s" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(232,144,109,0.8)"; (e.currentTarget as HTMLElement).style.background = "rgba(232,144,109,0.05)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(232,144,109,0.4)"; (e.currentTarget as HTMLElement).style.background = "none"; }}
                >
                  <Plus size={16} /> Add New Service
                </button>
              )}
            </>
          )}
        </DarkCard>

        {/* ── Instagram Reels ── */}
        <DarkCard title="Instagram Reels" subtitle="Automatically shows your latest reels from @jaimin_modi_photography — no manual uploads needed" icon="🎬">

          {/* Status badge */}
          {igStatus.configured !== undefined && (
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 16,
              padding: "8px 14px", borderRadius: 8,
              background: igStatus.configured && !igStatus.error ? "rgba(52,211,153,0.1)" : "rgba(248,113,113,0.1)",
              border: `1px solid ${igStatus.configured && !igStatus.error ? "rgba(52,211,153,0.3)" : "rgba(248,113,113,0.3)"}`,
            }}>
              {igStatus.configured && !igStatus.error
                ? <Wifi size={14} color="#6ee7b7" />
                : <WifiOff size={14} color="#fca5a5" />
              }
              <span style={{ fontSize: 13, color: igStatus.configured && !igStatus.error ? "#6ee7b7" : "#fca5a5", fontWeight: 600 }}>
                {igStatus.configured && !igStatus.error
                  ? `Connected — showing ${igStatus.count} reel${igStatus.count !== 1 ? "s" : ""}`
                  : igStatus.error || "Token not configured"
                }
              </span>
            </div>
          )}

          <button
            onClick={checkInstagram}
            disabled={igStatus.checking}
            style={{ display: "flex", alignItems: "center", gap: 8, background: igStatus.checking ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg, #E8906D, #c96a3f)", border: "none", borderRadius: 8, padding: "10px 20px", color: "#fff", fontSize: 13, fontWeight: 600, cursor: igStatus.checking ? "not-allowed" : "pointer", marginBottom: 22 }}
          >
            {igStatus.checking
              ? <><span style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", display: "inline-block", animation: "spin 0.8s linear infinite" }} /> Checking…</>
              : "Check Connection"
            }
          </button>

          {/* Setup instructions */}
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: 18 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#E8906D", marginBottom: 14 }}>📋 One-time Setup — Get Instagram Access Token</p>

            {[
              { n: 1, text: "Go to developers.facebook.com → My Apps → Create App → choose Business" },
              { n: 2, text: 'Add the "Instagram" product to your app from the dashboard' },
              { n: 3, text: 'Under Instagram → API Setup → click "Add Instagram Account" and log in as jaimin_modi_photography' },
              { n: 4, text: "In Graph API Explorer, select your app, select your Instagram account, generate token with instagram_basic permission" },
              { n: 5, text: "Exchange for a long-lived token (valid 60 days) — use the URL below in your browser:" },
            ].map(({ n, text }) => (
              <div key={n} style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                <div style={{ width: 22, height: 22, borderRadius: "50%", background: "rgba(232,144,109,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontSize: 11, color: "#E8906D", fontWeight: 700 }}>{n}</span>
                </div>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", margin: 0, lineHeight: 1.6 }}>{text}</p>
              </div>
            ))}

            <pre style={{ background: "rgba(0,0,0,0.4)", color: "#a5b4fc", borderRadius: 8, padding: 12, fontSize: 11, overflowX: "auto", lineHeight: 1.6, border: "1px solid rgba(255,255,255,0.08)", marginBottom: 14 }}>{`https://graph.instagram.com/access_token
  ?grant_type=ig_exchange_token
  &client_id=YOUR_APP_ID
  &client_secret=YOUR_APP_SECRET
  &access_token=SHORT_LIVED_TOKEN`}</pre>

            <div style={{ display: "flex", alignItems: "flex-start", gap: 10, background: "rgba(232,144,109,0.06)", border: "1px solid rgba(232,144,109,0.2)", borderRadius: 8, padding: 12 }}>
              <span style={{ fontSize: 16, flexShrink: 0 }}>6</span>
              <div>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", margin: "0 0 6px", fontWeight: 600 }}>Add to Vercel → Settings → Environment Variables:</p>
                <code style={{ fontSize: 12, color: "#E8906D", background: "rgba(0,0,0,0.3)", padding: "3px 8px", borderRadius: 4 }}>INSTAGRAM_ACCESS_TOKEN = your_long_lived_token</code>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", margin: "6px 0 0" }}>Tokens expire after 60 days — refresh by visiting the exchange URL again before expiry</p>
              </div>
            </div>
          </div>
        </DarkCard>

        {/* ── Testimonials ── */}
        <DarkCard title={`Testimonials (${testimonials.length})`} subtitle="Copy reviews from Google and paste them here — they show live on the website" icon="⭐">

          {/* Existing list */}
          {testimonials.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 18 }}>
              {testimonials.map((t) => (
                <div key={t.id} style={{ display: "flex", alignItems: "flex-start", gap: 12, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "12px 14px" }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, #E8906D, #c96a3f)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 12, flexShrink: 0 }}>
                    {t.name.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{t.name}</span>
                      {t.location && <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{t.location}</span>}
                      <span style={{ fontSize: 12, color: "#E8906D", marginLeft: "auto" }}>{"★".repeat(t.rating)}</span>
                    </div>
                    <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", margin: 0, lineHeight: 1.5, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" } as React.CSSProperties}>
                      {t.review}
                    </p>
                  </div>
                  <button onClick={() => deleteTestimonial(t.id)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, flexShrink: 0 }} title="Delete">
                    <Trash2 size={14} color="#ff8080" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add form */}
          {addingTestimonial ? (
            <div style={{ border: "1px solid rgba(232,144,109,0.3)", borderRadius: 12, padding: 18, background: "rgba(232,144,109,0.04)" }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: "#E8906D", marginBottom: 14 }}>+ New Testimonial</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                <input
                  value={newTestimonial.name}
                  onChange={(e) => setNewTestimonial((v) => ({ ...v, name: e.target.value }))}
                  placeholder="Reviewer name *"
                  style={darkInput}
                />
                <input
                  value={newTestimonial.location}
                  onChange={(e) => setNewTestimonial((v) => ({ ...v, location: e.target.value }))}
                  placeholder="Location (e.g. Kadi, Gujarat)"
                  style={darkInput}
                />
              </div>
              <div style={{ marginBottom: 10 }}>
                <label style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 6 }}>Rating</label>
                <div style={{ display: "flex", gap: 6 }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} onClick={() => setNewTestimonial((v) => ({ ...v, rating: star }))}
                      style={{ background: "none", border: "none", cursor: "pointer", fontSize: 22, color: star <= newTestimonial.rating ? "#E8906D" : "rgba(255,255,255,0.2)", transition: "color 0.15s" }}>
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <textarea
                value={newTestimonial.review}
                onChange={(e) => setNewTestimonial((v) => ({ ...v, review: e.target.value }))}
                placeholder="Paste the review text here *"
                rows={4}
                style={{ ...darkInput, resize: "vertical", marginBottom: 14 }}
              />
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={addTestimonial} disabled={savingTestimonial} style={{ background: savingTestimonial ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg, #E8906D, #c96a3f)", border: "none", borderRadius: 8, padding: "10px 22px", color: "#fff", fontSize: 13, fontWeight: 600, cursor: savingTestimonial ? "not-allowed" : "pointer", boxShadow: savingTestimonial ? "none" : "0 4px 14px rgba(232,144,109,0.35)" }}>
                  {savingTestimonial ? "Saving…" : "Add Testimonial"}
                </button>
                <button onClick={() => { setAddingTestimonial(false); setNewTestimonial({ name: "", location: "", rating: 5, review: "" }); }} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "10px 18px", fontSize: 13, cursor: "pointer", color: "rgba(255,255,255,0.5)" }}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button onClick={() => setAddingTestimonial(true)} style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(232,144,109,0.08)", border: "1px solid rgba(232,144,109,0.25)", borderRadius: 8, padding: "10px 18px", color: "#E8906D", fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}>
              <Plus size={15} /> Add Testimonial
            </button>
          )}
        </DarkCard>

        {/* ── Gallery ── */}
        <DarkCard title={`Portfolio Gallery (${gallery.length} photos)`} subtitle="These photos appear in the Portfolio section on the homepage" icon="🖼">
          <div
            onClick={() => galleryRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files; if (f.length) handleGalleryUpload(f); }}
            style={{ border: "2px dashed rgba(232,144,109,0.35)", borderRadius: 12, padding: "32px 20px", textAlign: "center", cursor: "pointer", marginBottom: 24, background: "rgba(232,144,109,0.04)", transition: "all 0.2s" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(232,144,109,0.08)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(232,144,109,0.6)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(232,144,109,0.04)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(232,144,109,0.35)"; }}
          >
            <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(232,144,109,0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
              <Upload size={22} color="#E8906D" />
            </div>
            <p style={{ fontSize: 15, fontWeight: 600, color: "#E8906D", margin: "0 0 4px" }}>
              {uploading === "gallery" ? "Uploading…" : "Click or drag photos here"}
            </p>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", margin: 0 }}>You can select multiple photos at once</p>
            <input ref={galleryRef} type="file" accept="image/*" multiple style={{ display: "none" }}
              onChange={(e) => e.target.files?.length && handleGalleryUpload(e.target.files)} />
          </div>

          {gallery.length === 0 ? (
            <p style={{ textAlign: "center", color: "rgba(255,255,255,0.2)", fontSize: 14, padding: "20px 0" }}>No photos yet. Upload your first photo above.</p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(175px, 1fr))", gap: 10 }}>
              {gallery.map((img) => (
                <div key={img.id} style={{ position: "relative", borderRadius: 10, overflow: "hidden", aspectRatio: "4/3", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <Image src={img.url} alt="" fill style={{ objectFit: "cover" }} unoptimized />
                  <button
                    onClick={() => deleteGalleryImage(img)}
                    style={{ position: "absolute", top: 6, right: 6, width: 28, height: 28, borderRadius: "50%", background: "rgba(0,0,0,0.7)", border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" }}
                    title="Delete"
                  >
                    <Trash2 size={13} color="#ff8080" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </DarkCard>
      </div>

      <style>{`
        @keyframes adminOrb1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(60px, -40px) scale(1.05); }
          66% { transform: translate(-30px, 50px) scale(0.95); }
        }
        @keyframes adminOrb2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-50px, 30px) scale(1.08); }
          66% { transform: translate(40px, -35px) scale(0.92); }
        }
      `}</style>
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────

function FullscreenState({ type }: { type: "loading" | "no-user" | "denied" }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#06060e", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 30% 40%, rgba(232,144,109,0.06) 0%, transparent 60%), radial-gradient(ellipse at 70% 60%, rgba(80,130,255,0.04) 0%, transparent 60%)" }} />
      <div style={{ position: "relative", textAlign: "center", padding: 48, background: "rgba(255,255,255,0.04)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, maxWidth: 380 }}>
        {type === "loading" && (
          <>
            <div style={{ width: 44, height: 44, border: "3px solid rgba(232,144,109,0.3)", borderTopColor: "#E8906D", borderRadius: "50%", margin: "0 auto 20px", animation: "spin 0.9s linear infinite" }} />
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.5)", margin: 0 }}>Checking login…</p>
          </>
        )}
        {type === "no-user" && (
          <>
            <div style={{ fontSize: 44, marginBottom: 16 }}>🔐</div>
            <p style={{ fontSize: 18, color: "#fff", fontWeight: 600, marginBottom: 8 }}>Login Required</p>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginBottom: 24 }}>Please log in to access the admin panel.</p>
            <a href="/" style={{ color: "#E8906D", fontWeight: 600, textDecoration: "none", fontSize: 14 }}>← Go to website and log in</a>
          </>
        )}
        {type === "denied" && (
          <>
            <div style={{ fontSize: 44, marginBottom: 16 }}>🔒</div>
            <p style={{ fontSize: 20, fontWeight: 700, color: "#fff", marginBottom: 8 }}>Access Denied</p>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginBottom: 24 }}>You do not have permission to access the admin panel.</p>
            <a href="/" style={{ color: "#E8906D", fontWeight: 600, fontSize: 14, textDecoration: "none" }}>← Go to website</a>
          </>
        )}
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
}

function DarkCard({ title, subtitle, icon, children }: { title: string; subtitle: string; icon: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(16px)", borderRadius: 16, padding: "26px 28px", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 4px 24px rgba(0,0,0,0.3)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
        <span style={{ fontSize: 18 }}>{icon}</span>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: "#fff", margin: 0 }}>{title}</h2>
      </div>
      <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", margin: "0 0 22px", paddingLeft: 28 }}>{subtitle}</p>
      {children}
    </div>
  );
}

function DarkUploadBtn({ loading, onClick }: { loading: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} disabled={loading} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", background: loading ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg, #E8906D, #c96a3f)", border: "none", borderRadius: 8, color: "#fff", fontSize: 13, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", boxShadow: loading ? "none" : "0 4px 14px rgba(232,144,109,0.35)", transition: "all 0.2s" }}>
      <Upload size={15} />
      {loading ? "Uploading…" : "Upload New Image"}
    </button>
  );
}

function DarkIconBtn({ children, onClick, accent, danger, title }: { children: React.ReactNode; onClick: () => void; accent?: boolean; danger?: boolean; title?: string }) {
  const bg = accent ? "linear-gradient(135deg, #E8906D, #c96a3f)" : "rgba(255,255,255,0.06)";
  const borderColor = accent ? "transparent" : danger ? "rgba(255,80,80,0.2)" : "rgba(255,255,255,0.1)";
  const color = accent ? "#fff" : danger ? "#ff8080" : "rgba(255,255,255,0.55)";
  return (
    <button
      onClick={onClick}
      title={title}
      style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${borderColor}`, background: bg, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color, transition: "all 0.2s" }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = "0.8"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
    >
      {children}
    </button>
  );
}

function DarkAddServiceForm({
  value, onChange, onSave, onCancel, loading,
}: {
  value: { title: string; description: string };
  onChange: (v: { title: string; description: string }) => void;
  onSave: (img: File | null) => void;
  onCancel: () => void;
  loading: boolean;
}) {
  const [imgFile, setImgFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setImgFile(f);
    setPreview(URL.createObjectURL(f));
  };

  return (
    <div style={{ marginTop: 14, border: "1px solid rgba(232,144,109,0.3)", borderRadius: 12, padding: 18, background: "rgba(232,144,109,0.04)" }}>
      <p style={{ fontSize: 14, fontWeight: 700, color: "#E8906D", marginBottom: 14 }}>+ New Service</p>
      <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
        <div
          onClick={() => fileRef.current?.click()}
          style={{ width: 88, height: 66, borderRadius: 8, border: "2px dashed rgba(232,144,109,0.4)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, overflow: "hidden", background: "rgba(255,255,255,0.03)", position: "relative" }}
        >
          {preview
            ? <Image src={preview} alt="preview" fill style={{ objectFit: "cover" }} unoptimized />
            : <Upload size={17} color="#E8906D" />
          }
          <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleImg} />
        </div>
        <div style={{ flex: 1 }}>
          <input
            value={value.title}
            onChange={(e) => onChange({ ...value, title: e.target.value })}
            placeholder="Service title *"
            style={{ ...darkInput, marginBottom: 8 }}
          />
          <textarea
            value={value.description}
            onChange={(e) => onChange({ ...value, description: e.target.value })}
            placeholder="Short description"
            rows={2}
            style={{ ...darkInput, resize: "vertical" }}
          />
        </div>
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
        <button
          onClick={() => onSave(imgFile)}
          disabled={loading}
          style={{ background: loading ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg, #E8906D, #c96a3f)", border: "none", borderRadius: 8, padding: "10px 22px", color: "#fff", fontSize: 13, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", boxShadow: loading ? "none" : "0 4px 14px rgba(232,144,109,0.35)" }}
        >
          {loading ? "Saving…" : "Add Service"}
        </button>
        <button onClick={onCancel} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "10px 18px", fontSize: 13, cursor: "pointer", color: "rgba(255,255,255,0.5)" }}>
          Cancel
        </button>
      </div>
    </div>
  );
}
