"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

const DEFAULT = "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800&q=80";

export default function AboutUs() {
  const [aboutImg, setAboutImg] = useState(DEFAULT);

  useEffect(() => {
    supabase.from("site_config").select("value").eq("key", "about_image").maybeSingle()
      .then(({ data }) => { if (data?.value) setAboutImg(data.value); });
  }, []);

  return (
    <section id="about" className="section-about" style={{ padding: "45px 0" }}>
      <div className="wrap">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "center" }}>
          <div style={{ position: "relative", width: "100%", aspectRatio: "4/3", borderRadius: 10, overflow: "hidden", background: "#f0f0f0" }}>
            <Image src={aboutImg} alt="About Jaimin Modi Photography" fill sizes="50vw"
              style={{ objectFit: "cover" }} loading="lazy" unoptimized />
          </div>
          <div className="about-text">
            <h2 style={{
              fontFamily: "var(--font-display)", fontSize: "clamp(24px, 2.5vw, 36px)",
              fontWeight: 300, color: "#444", marginBottom: 20,
            }}>About Us</h2>
            <p style={{ fontSize: 15, color: "#555", lineHeight: 1.75 }}>
              We, Jaimin Modi Photography, situated at Kadi, Gujarat are one of the leading
              firm in the country, set up to cater to the growing requirements
              in all sectors. We have strengthened the business of our customers
              through proactive product development, timely delivery and superior
              product attributes by reinforcing innovation, cost leadership and
              premium quality.
            </p>
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 767px) {
          #about .wrap > div { grid-template-columns: 1fr !important; }
          #about .about-text { text-align: center !important; }
          #about .about-text h2 { text-align: center !important; }
        }
      `}</style>
    </section>
  );
}
