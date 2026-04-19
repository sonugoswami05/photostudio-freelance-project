"use client";

import { useState, useEffect, useRef } from "react";
import { useModal } from "@/contexts/ModalContext";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import { Trash2, Upload, LogOut } from "lucide-react";

interface GalleryImage { id: string; url: string; caption: string | null; category: string | null; }

export default function AdminPage() {
  const { user, logout } = useModal();
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [logoUrl, setLogoUrl] = useState("");
  const [heroUrl, setHeroUrl] = useState("");
  const [aboutUrl, setAboutUrl] = useState("");
  const [uploading, setUploading] = useState<string | null>(null);
  const [status, setStatus] = useState("");
  const [authChecked, setAuthChecked] = useState(false);
  const galleryRef = useRef<HTMLInputElement>(null);
  const logoRef = useRef<HTMLInputElement>(null);
  const heroRef = useRef<HTMLInputElement>(null);
  const aboutRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setAuthChecked(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (user) { setAuthChecked(true); loadData(); }
  }, [user]);

  const loadData = async () => {
    const [{ data: imgs }, { data: cfg }] = await Promise.all([
      supabase.from("gallery_images").select("*").order("created_at", { ascending: false }),
      supabase.from("site_config").select("*"),
    ]);
    if (imgs) setGallery(imgs);
    if (cfg) {
      setLogoUrl(cfg.find((r) => r.key === "logo")?.value || "");
      setHeroUrl(cfg.find((r) => r.key === "hero_image")?.value || "");
      setAboutUrl(cfg.find((r) => r.key === "about_image")?.value || "");
    }
  };

  const uploadFile = async (file: File, folder: string): Promise<string | null> => {
    const ext = file.name.split(".").pop();
    const path = `${folder}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("studio-images").upload(path, file);
    if (error) { setStatus("Upload failed: " + error.message); return null; }
    const { data: { publicUrl } } = supabase.storage.from("studio-images").getPublicUrl(path);
    return publicUrl;
  };

  const handleGalleryUpload = async (files: FileList) => {
    setUploading("gallery");
    setStatus("");
    for (const file of Array.from(files)) {
      const url = await uploadFile(file, "gallery");
      if (url) await supabase.from("gallery_images").insert({ url, caption: null, category: null });
    }
    await loadData();
    setUploading(null);
    setStatus(`✓ ${files.length} image${files.length > 1 ? "s" : ""} uploaded!`);
  };

  const handleConfigUpload = async (file: File, key: string) => {
    setUploading(key);
    setStatus("");
    const url = await uploadFile(file, key);
    if (url) {
      await supabase.from("site_config").upsert({ key, value: url, updated_at: new Date().toISOString() });
      if (key === "logo") setLogoUrl(url);
      if (key === "hero_image") setHeroUrl(url);
      if (key === "about_image") setAboutUrl(url);
      setStatus("✓ Image updated! Rebuild the site to see changes.");
    }
    setUploading(null);
  };

  const deleteGalleryImage = async (img: GalleryImage) => {
    if (!confirm("Delete this image?")) return;
    const path = img.url.split("/studio-images/")[1];
    if (path) await supabase.storage.from("studio-images").remove([path]);
    await supabase.from("gallery_images").delete().eq("id", img.id);
    setGallery((g) => g.filter((i) => i.id !== img.id));
    setStatus("✓ Image deleted.");
  };

  if (!authChecked || (!user && !authChecked)) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#fafafa" }}>
      <div style={{ textAlign: "center", padding: 40 }}>
        <div style={{ width: 40, height: 40, border: "3px solid #E8906D", borderTopColor: "transparent", borderRadius: "50%", margin: "0 auto 16px", animation: "spin 0.8s linear infinite" }} />
        <p style={{ fontSize: 15, color: "#888" }}>Checking login…</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );

  if (!user) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#fafafa" }}>
      <div style={{ textAlign: "center", padding: 40 }}>
        <p style={{ fontSize: 18, color: "#555", marginBottom: 16 }}>Please log in to access the admin panel.</p>
        <a href="/" style={{ color: "#E8906D", fontWeight: 600 }}>← Go to website and log in</a>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5" }}>
      {/* Header */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e0e0e0", padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: "#E8906D", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 14 }}>NA</div>
          <span style={{ fontSize: 16, fontWeight: 600, color: "#222" }}>Admin Panel</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <a href="/" style={{ fontSize: 13, color: "#888", textDecoration: "none" }}>← View Site</a>
          <button onClick={logout} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "1px solid #ddd", borderRadius: 6, padding: "6px 12px", cursor: "pointer", fontSize: 13, color: "#555" }}>
            <LogOut size={14} /> Logout
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px", display: "flex", flexDirection: "column", gap: 32 }}>
        {status && (
          <div style={{ background: status.startsWith("✓") ? "#f0fff4" : "#fff5f5", border: `1px solid ${status.startsWith("✓") ? "#9ae6b4" : "#fed7d7"}`, borderRadius: 8, padding: "12px 16px", color: status.startsWith("✓") ? "#276749" : "#c53030", fontSize: 14 }}>
            {status}
          </div>
        )}

        {/* ── Logo ── */}
        <Card title="Studio Logo" subtitle="Shown in the navbar — use a transparent PNG for best results">
          <div style={{ display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ width: 100, height: 100, borderRadius: 12, background: "#f5f5f5", border: "1px solid #eee", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, overflow: "hidden" }}>
              {logoUrl
                ? <Image src={logoUrl} alt="Logo" width={100} height={100} style={{ objectFit: "contain" }} unoptimized />
                : <span style={{ fontSize: 28, fontWeight: 700, color: "#E8906D" }}>NA</span>}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <p style={{ fontSize: 13, color: "#777", margin: 0 }}>PNG with transparent background recommended.<br />Square format (e.g. 200×200px) works best.</p>
              <input ref={logoRef} type="file" accept="image/*" style={{ display: "none" }}
                onChange={(e) => e.target.files?.[0] && handleConfigUpload(e.target.files[0], "logo")} />
              <UploadBtn loading={uploading === "logo"} onClick={() => logoRef.current?.click()} />
            </div>
          </div>
        </Card>

        {/* ── Hero Image ── */}
        <Card title="Hero Background" subtitle="The main background on the homepage — supports image or video">
          <div style={{ display: "flex", gap: 24, alignItems: "flex-start", flexWrap: "wrap" }}>
            {heroUrl && (
              <div style={{ width: 280, height: 160, borderRadius: 8, overflow: "hidden", flexShrink: 0, background: "#000", position: "relative" }}>
                {["mp4","webm","mov","ogg"].some((e) => heroUrl.toLowerCase().split("?")[0].endsWith(`.${e}`)) ? (
                  <video src={heroUrl} muted autoPlay loop playsInline style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <Image src={heroUrl} alt="Hero" fill style={{ objectFit: "cover" }} unoptimized />
                )}
              </div>
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: 12, justifyContent: "center" }}>
              <p style={{ fontSize: 13, color: "#777", margin: 0 }}>
                Image: JPG/PNG (recommended 1920×1080)<br />
                Video: MP4/WebM (keep under 20MB for fast loading)
              </p>
              <input ref={heroRef} type="file" accept="image/*,video/mp4,video/webm,video/quicktime" style={{ display: "none" }}
                onChange={(e) => e.target.files?.[0] && handleConfigUpload(e.target.files[0], "hero_image")} />
              <UploadBtn loading={uploading === "hero_image"} onClick={() => heroRef.current?.click()} />
            </div>
          </div>
        </Card>

        {/* ── About Image ── */}
        <Card title="About Us Image" subtitle="The photo shown in the About Us section">
          <div style={{ display: "flex", gap: 24, alignItems: "flex-start", flexWrap: "wrap" }}>
            {aboutUrl && (
              <div style={{ position: "relative", width: 220, height: 165, borderRadius: 8, overflow: "hidden", flexShrink: 0 }}>
                <Image src={aboutUrl} alt="About" fill style={{ objectFit: "cover" }} unoptimized />
              </div>
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: 12, justifyContent: "center" }}>
              <p style={{ fontSize: 13, color: "#777", margin: 0 }}>Upload a portrait or square photo (recommended: 800×600px)</p>
              <input ref={aboutRef} type="file" accept="image/*" style={{ display: "none" }}
                onChange={(e) => e.target.files?.[0] && handleConfigUpload(e.target.files[0], "about_image")} />
              <UploadBtn loading={uploading === "about_image"} onClick={() => aboutRef.current?.click()} />
            </div>
          </div>
        </Card>

        {/* ── Gallery ── */}
        <Card title={`Portfolio Gallery (${gallery.length} photos)`} subtitle="These photos appear in the Portfolio section on the homepage">
          {/* Upload area */}
          <div
            onClick={() => galleryRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files; if (f.length) handleGalleryUpload(f); }}
            style={{
              border: "2px dashed #E8906D", borderRadius: 10, padding: "28px 20px",
              textAlign: "center", cursor: "pointer", marginBottom: 24, background: "#FEF0EA",
              transition: "background 0.2s",
            }}
          >
            <Upload size={28} color="#E8906D" style={{ marginBottom: 8 }} />
            <p style={{ fontSize: 15, fontWeight: 600, color: "#E8906D", margin: "0 0 4px" }}>
              {uploading === "gallery" ? "Uploading…" : "Click or drag photos here"}
            </p>
            <p style={{ fontSize: 12, color: "#aaa", margin: 0 }}>You can select multiple photos at once</p>
            <input ref={galleryRef} type="file" accept="image/*" multiple style={{ display: "none" }}
              onChange={(e) => e.target.files?.length && handleGalleryUpload(e.target.files)} />
          </div>

          {/* Grid */}
          {gallery.length === 0 ? (
            <p style={{ textAlign: "center", color: "#aaa", fontSize: 14 }}>No photos yet. Upload your first photo above.</p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12 }}>
              {gallery.map((img) => (
                <div key={img.id} style={{ position: "relative", borderRadius: 8, overflow: "hidden", aspectRatio: "4/3", background: "#f0f0f0" }}>
                  <Image src={img.url} alt="" fill style={{ objectFit: "cover" }} unoptimized />
                  <button
                    onClick={() => deleteGalleryImage(img)}
                    style={{
                      position: "absolute", top: 6, right: 6,
                      width: 28, height: 28, borderRadius: "50%",
                      background: "rgba(0,0,0,0.6)", border: "none", cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                    title="Delete"
                  >
                    <Trash2 size={13} color="#fff" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

function Card({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "#fff", borderRadius: 12, padding: "24px 28px", boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}>
      <h2 style={{ fontSize: 17, fontWeight: 600, color: "#222", margin: "0 0 4px" }}>{title}</h2>
      <p style={{ fontSize: 13, color: "#999", margin: "0 0 20px" }}>{subtitle}</p>
      {children}
    </div>
  );
}

function UploadBtn({ loading, onClick }: { loading: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} disabled={loading} style={{
      display: "flex", alignItems: "center", gap: 8,
      padding: "10px 20px", background: loading ? "#ccc" : "#E8906D",
      border: "none", borderRadius: 8, color: "#fff", fontSize: 14,
      fontWeight: 600, cursor: loading ? "not-allowed" : "pointer",
    }}>
      <Upload size={16} />
      {loading ? "Uploading…" : "Upload New Image"}
    </button>
  );
}
