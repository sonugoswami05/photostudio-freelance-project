<div align="center">

# 📸 Jaimin Modi Photography

### Full-Stack Photography Studio Website

*Built with Next.js 16 · React 19 · Supabase · TypeScript*

[![Next.js](https://img.shields.io/badge/Next.js-16.2.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![Supabase](https://img.shields.io/badge/Supabase-2.103-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38BDF8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com)

</div>

---

## ✨ Overview

A modern, mobile-first photography studio website for **Jaimin Modi Photography**, Kadi, Gujarat. Every piece of content — hero image, logo, services, gallery, contact info — is managed through a sleek admin panel backed by **Supabase** with zero redeployment needed.

---

## 🖥️ Live Sections

| Section | Highlights |
|---|---|
| **Animated Loading Screen** | Camera aperture rings, shimmer progress bar, logo from Supabase |
| **Top Bar** | Animated dark gradient, orange phone icon badge, location & auth |
| **Navbar** | Sticky glass navbar, dynamic logo, mobile hamburger menu |
| **Hero** | Full-width image or video BG, mobile dark overlay, Enquire CTA |
| **Portfolio Gallery** | 3×3 paginated grid (desktop) · Auto-sliding dark carousel (mobile) |
| **Services — We Offer** | 5-column grid, images + descriptions from Supabase |
| **Testimonials** | Auto-rotating reviews, dot navigation, animated fade |
| **About Us** | Studio story, dynamic Supabase image |
| **Contact Us** | Glass-morphism info cards · Enquiry form · OpenStreetMap embed |
| **Footer** | Links, contact, language switcher (10 langs), developer credit |
| **🔐 Admin Panel** | Dark glass-morphism dashboard — full CRUD for all content |

---

## 🔧 Tech Stack

```
Framework       Next.js 16.2.4  (App Router + Turbopack)
Language        TypeScript 5  +  React 19
Database        Supabase PostgreSQL
Storage         Supabase Storage  (studio-images bucket)
Auth            Supabase Auth  (email / password)
Styling         Tailwind CSS v4  +  CSS-in-JS keyframe animations
Fonts           Playfair Display (display)  +  Open Sans (body)  via next/font
Icons           Lucide React 1.8
Animations      Custom CSS @keyframes  +  GSAP 3.15 (available)
Maps            OpenStreetMap embed
Translate       Google Translate Widget  (10 languages)
```

---

## 📁 Project Structure

```
studio/
├── app/
│   ├── layout.tsx              # Root layout — fonts, Google Translate, LoadingScreen
│   ├── page.tsx                # Homepage composition
│   ├── globals.css             # CSS vars, animated section backgrounds, global resets
│   ├── admin/page.tsx          # 🔐 Admin dashboard (email-guarded)
│   ├── api/enquiry/route.ts    # Enquiry form API endpoint
│   └── auth/reset/page.tsx     # Password reset page
│
├── components/
│   ├── layout/
│   │   ├── TopBar.tsx          # Animated dark top bar
│   │   ├── Navbar.tsx          # Sticky navbar + mobile menu + dynamic logo
│   │   └── Footer.tsx          # Footer + language switcher + developer credit
│   ├── sections/
│   │   ├── Hero.tsx            # Hero — image/video BG + CTA
│   │   ├── Gallery.tsx         # Portfolio — paginated grid + mobile carousel
│   │   ├── Services.tsx        # We Offer — service cards from Supabase
│   │   ├── Testimonials.tsx    # Auto-rotating testimonials
│   │   ├── AboutUs.tsx         # Studio story + dynamic image
│   │   ├── ContactSection.tsx  # Contact cards + form + map (dynamic from Supabase)
│   │   └── WhyUs.tsx           # Why choose us
│   └── ui/
│       ├── LoadingScreen.tsx   # Animated intro screen
│       ├── FloatingContact.tsx # Sticky WhatsApp button
│       ├── EnquireModal.tsx    # Lead capture modal
│       ├── LoginModal.tsx      # Supabase login
│       ├── SignUpModal.tsx     # Supabase sign up
│       └── ProfileModal.tsx    # User profile / logout
│
├── contexts/
│   └── ModalContext.tsx        # Global modal state + Supabase auth
│
├── data/
│   ├── services.json           # Fallback services data
│   ├── testimonials.json       # Testimonials content
│   └── gallery.json            # Fallback gallery items
│
├── lib/
│   ├── supabase.ts             # Supabase client initialisation
│   └── utils.ts                # Utility helpers
│
└── .env.local                  # 🔒 Not committed — see Setup section
```

---

## 🗄️ Supabase Database Schema

### `site_config` — All live site settings

| Key | Description |
|---|---|
| `logo` | Studio logo image URL |
| `hero_image` | Hero background image or video URL |
| `about_image` | About section photo URL |
| `contact_bg` | Contact section background photo URL |
| `contact_phone` | Studio phone number |
| `contact_email` | Studio email address |
| `contact_address` | Full studio address |
| `contact_timings` | Business hours string |

```sql
CREATE TABLE site_config (
  key text PRIMARY KEY,
  value text,
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read"  ON site_config FOR SELECT USING (true);
CREATE POLICY "Auth write"   ON site_config FOR ALL    USING (auth.role() = 'authenticated');
```

### `gallery_images` — Portfolio photos

```sql
CREATE TABLE gallery_images (
  id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  url        text NOT NULL,
  caption    text,
  category   text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON gallery_images FOR SELECT USING (true);
CREATE POLICY "Auth write"  ON gallery_images FOR ALL    USING (auth.role() = 'authenticated');
```

### `services` — We Offer section

```sql
CREATE TABLE services (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title       text NOT NULL,
  description text DEFAULT '',
  image_url   text DEFAULT '',
  sort_order  integer DEFAULT 0,
  created_at  timestamptz DEFAULT now()
);
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON services FOR SELECT USING (true);
CREATE POLICY "Auth write"  ON services FOR ALL    USING (auth.role() = 'authenticated');
```

### Storage Bucket — `studio-images` (public)

```
studio-images/
├── logo/           ← studio logo uploads
├── hero_image/     ← hero background uploads
├── about_image/    ← about section photos
├── contact_bg/     ← contact section background
├── gallery/        ← portfolio photos
└── services/       ← service card images
```

---

## 🔐 Admin Panel — `/admin`

Access is restricted to a **single email** configured in `.env.local`.  
Anyone else who visits `/admin` sees a dark **Access Denied** screen.

### What the admin can manage without redeploying:

| Card | Capability |
|---|---|
| **Studio Logo** | Upload PNG — live in navbar & loading screen immediately |
| **Hero Background** | Upload JPG/PNG or MP4/WebM video |
| **About Us Image** | Upload photographer/studio photo |
| **Contact Section Background** | Upload studio interior for the contact backdrop |
| **Contact Information** | Edit phone, email, address, timings — saved to Supabase |
| **We Offer — Services** | Add new · Edit title/description · Change image · Delete |
| **Portfolio Gallery** | Drag-and-drop multi-upload, per-photo delete |

### Admin visual design:
- `#06060e` dark base with 3 animated radial-gradient orbs + grid overlay
- Sticky glass header with blur + orange `JM` badge
- Glass-morphism cards: `rgba` backgrounds, backdrop-blur, subtle borders
- Orange gradient buttons with glow on hover
- Dark input fields with white text, orange focus ring
- All auth screens (loading / denied / not-logged-in) match dark theme

---

## 🎨 Design System

### Colour Palette

| Token | Hex | Used for |
|---|---|---|
| Accent orange | `#E8906D` | CTAs, icons, active dots, progress bar |
| Accent light | `#F5C4AC` | Hover tints, shimmer effects |
| Warm brown | `#A0845C` | Service enquire buttons |
| Dark base | `#06060e` / `#08080f` | Gallery, admin, dark sections |
| Deep navy | `#080d12` | Contact section bg |

### Typography

| Font | CSS Variable | Role |
|---|---|---|
| **Playfair Display** | `--font-display` | Headings, hero, navbar logo |
| **Open Sans** | `--font-body` | Body text, labels, paragraphs |

### Animated Section Backgrounds

| Section | Background treatment |
|---|---|
| **Top Bar** | Dark shifting gradient + drifting glow orb + pulsing orange accent line |
| **Hero** | Full media (image/video) + white-fade overlay desktop / dark bottom overlay mobile |
| **Gallery** | `#08080f` deep dark + two drifting radial orbs (orange + blue) |
| **Services** | Warm cream animated gradient (`warmFlow` keyframe) |
| **Testimonials** | Dark brown + pulsing centre glow |
| **About Us** | Soft warm off-white shifting gradient |
| **Contact** | `#080d12` dark + studio-light float orbs + optional photo BG |
| **Admin** | `#06060e` + 3 floating orbs + subtle grid overlay |

---

## 📱 Responsive Breakpoints

| Breakpoint | Key changes |
|---|---|
| `≤ 767px` (mobile) | TopBar hidden · Hero dark bottom overlay · Gallery = auto-carousel · Services 2-col · Contact cards 2-col · Form single-column |
| `768px – 1023px` (tablet) | Services 3-col · Gallery 3-col |
| `≥ 1024px` (desktop) | Full layout — 5-col services, 3×3 gallery grid |

**Mobile Hero special treatment:**  
A dark gradient overlays the bottom of the image/video. The title, subtitle and CTA button are anchored to the bottom-centre in white text — the photo is fully visible, not blurred out.

---

## 🌍 Language Switcher (10 languages)

Powered by Google Translate widget (hidden from DOM, triggered programmatically):

`English` · `हिन्दी` · `मराठी` · `বাংলা` · `தமிழ்` · `ગુજરાતી` · `ಕನ್ನಡ` · `മലയാളം` · `తెలుగు` · `ਪੰਜਾਬੀ`

The Google Translate toolbar is hidden via CSS. Clicking a language button in the footer calls `window.__changeLang(code)` which triggers the underlying widget silently.

---

## ⚡ Performance

- `next/image` with `fill` + `sizes` for optimised responsive images
- `loading="lazy"` on all below-fold images
- `priority` on hero image and first carousel slide
- Modern image formats: **AVIF + WebP** via Next.js image config
- Fonts via `next/font/google` with `display: swap` (no layout shift)
- `Promise.all([minTime, window.onload])` on loading screen prevents flash
- Turbopack for fast HMR in development

---

## 🚀 Local Development Setup

### 1. Clone & install

```bash
git clone https://github.com/sonugoswami05/photostudio-freelance-project.git
cd photostudio-freelance-project
npm install
```

### 2. Create `.env.local`

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_ADMIN_EMAIL=your-admin-email@example.com
```

> ⚠️ **Never commit `.env.local`** — it's listed in `.gitignore`

### 3. Set up Supabase

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Run all SQL from the **Database Schema** section above in the SQL Editor
3. Create a **public** storage bucket named exactly `studio-images`
4. Verify RLS policies are enabled on all three tables

### 4. Run dev server

```bash
npm run dev
# → http://localhost:3000
```

### 5. Access Admin Panel

1. Create an account on the website (sign up)
2. Make sure that email matches `NEXT_PUBLIC_ADMIN_EMAIL` in `.env.local`
3. Navigate to `/admin`

### 6. Production build

```bash
npm run build
npm start
```

---

## 📦 Dependencies

| Package | Version | Purpose |
|---|---|---|
| `next` | 16.2.4 | Framework — App Router, Image, Fonts |
| `react` + `react-dom` | 19.2.4 | UI library |
| `@supabase/supabase-js` | 2.103.3 | Database, auth, storage |
| `lucide-react` | 1.8.0 | Icon components |
| `gsap` + `@gsap/react` | 3.15.0 | Animation library |
| `tailwindcss` | v4 | CSS reset + utility classes |
| `typescript` | 5 | Type safety |

---

## 🔒 Security Notes

- Admin is client-side email-guarded — only the `.env` email can access `/admin`
- Supabase **Row Level Security (RLS)** enabled on all tables
- All write/upload operations require an authenticated Supabase session
- Environment variables never committed — all secrets stay in `.env.local`
- No API keys or secrets anywhere in the source code

---

## 🧱 Component Quick Reference

### Sections (data sources)

| Component | Anchor | Primary data |
|---|---|---|
| `Hero` | `#home` | `site_config.hero_image` |
| `Gallery` | `#gallery` | `gallery_images` table |
| `Services` | `#services` | `services` table + JSON fallback |
| `Testimonials` | `#testimonials` | `data/testimonials.json` |
| `AboutUs` | `#about` | `site_config.about_image` |
| `ContactSection` | `#contact` | `site_config.contact_*` keys |

### UI Components

| Component | Purpose |
|---|---|
| `LoadingScreen` | Full-screen animated intro (aperture rings, logo, progress bar) |
| `FloatingContact` | Sticky WhatsApp button bottom-right |
| `EnquireModal` | Lead capture form, triggered from any "Enquire Now" button |
| `LoginModal` | Supabase email/password sign-in |
| `SignUpModal` | New user registration |
| `ProfileModal` | User info display + logout |

---

## 👨‍💻 Developer

<div align="center">

**Sonu Goswami** — Full Stack Developer

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/sonugoswami1/)
[![Instagram](https://img.shields.io/badge/Instagram-Follow-E4405F?style=for-the-badge&logo=instagram&logoColor=white)](https://instagram.com/05_mr_goswami_30)

</div>

---

## 📄 License

This project is a **freelance client project** built for **Jaimin Modi Photography**, Kadi, Gujarat.  
All content and branding rights belong to the client.  
Codebase © 2025 Sonu Goswami.

---

<div align="center">
  <sub>Crafted with ♥ by <strong>Sonu Goswami</strong> for <strong>Jaimin Modi Photography</strong></sub>
</div>
