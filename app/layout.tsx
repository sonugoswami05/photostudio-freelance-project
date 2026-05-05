import type { Metadata, Viewport } from "next";
import { Playfair_Display, Open_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { ModalProvider } from "@/contexts/ModalContext";
import TopBar from "@/components/layout/TopBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingContact from "@/components/ui/FloatingContact";
import LoginModal from "@/components/ui/LoginModal";
import SignUpModal from "@/components/ui/SignUpModal";
import EnquireModal from "@/components/ui/EnquireModal";
import ProfileModal from "@/components/ui/ProfileModal";
import LoadingScreen from "@/components/ui/LoadingScreen";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://jaiminmodiphotography.in";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#E8906D",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  icons: {
    icon: [
      { url: "/icon.png", type: "image/png" },
      { url: "/favicon.ico",  sizes: "any" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", type: "image/png" },
    ],
    shortcut: "/icon.png",
  },

  title: {
    default: "Jaimin Modi Photography | Best Wedding & Candid Photographer in Kadi, Gujarat",
    template: "%s | Jaimin Modi Photography – Kadi, Gujarat",
  },

  description:
    "Jaimin Modi Photography — professional wedding, candid, model & baby photographer in Kadi, Mehsana, Gujarat. Stunning portraits, pre-wedding shoots & video services. Book your session today!",

  keywords: [
    "Jaimin Modi Photography",
    "wedding photographer Kadi",
    "photographer in Kadi Gujarat",
    "candid wedding photography Kadi",
    "photography studio Kadi",
    "pre-wedding shoot Kadi",
    "model photography Gujarat",
    "baby photography Kadi",
    "wedding photographer Mehsana",
    "best photographer Kadi",
    "portrait photography Gujarat",
    "studio photography Kadi",
    "wedding photographer Gujarat",
    "professional photographer Kadi",
    "photography near Kadi",
    "Jaimin Modi photographer",
    "JM Photography Kadi",
  ],

  authors: [{ name: "Jaimin Modi Photography", url: SITE_URL }],
  creator: "Jaimin Modi Photography",
  publisher: "Jaimin Modi Photography",

  verification: {
    google: "Q5dfA3koL005kgu6TyNB-O3acYhO7pkt6ke_rnL26sM",
  },

  alternates: {
    canonical: SITE_URL,
    languages: {
      "en-IN": SITE_URL,
      "gu-IN": SITE_URL,
      "hi-IN": SITE_URL,
    },
  },

  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: "Jaimin Modi Photography",
    title: "Jaimin Modi Photography | Best Wedding & Candid Photographer in Kadi, Gujarat",
    description:
      "Professional wedding, candid, model & baby photographer in Kadi, Mehsana, Gujarat. Book your perfect photography session with Jaimin Modi Photography.",
    images: [
      {
        url: `${SITE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Jaimin Modi Photography – Wedding & Studio Photographer in Kadi Gujarat",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Jaimin Modi Photography | Wedding & Candid Photographer – Kadi, Gujarat",
    description:
      "Professional wedding, candid, model & baby photographer in Kadi, Gujarat. Stunning photography sessions. Book today!",
    images: [`${SITE_URL}/og-image.jpg`],
    creator: "@jaiminmodiphoto",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  category: "Photography",

  other: {
    // Geo tags for local SEO
    "geo.region":      "IN-GJ",
    "geo.placename":   "Kadi, Mehsana, Gujarat, India",
    "geo.position":    "23.2978;72.9735",
    "ICBM":            "23.2978, 72.9735",
    // Business info
    "business:contact_data:street_address": "Shefali Compound Near Shefali Cinema, Kadi - Detroj Rd",
    "business:contact_data:locality":       "Kadi",
    "business:contact_data:region":         "Gujarat",
    "business:contact_data:postal_code":    "382715",
    "business:contact_data:country_name":   "India",
    "business:contact_data:phone_number":   "+91-9974057620",
    "business:contact_data:email":          "jmodi1040@gmail.com",
    "business:contact_data:website":        SITE_URL,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${openSans.variable}`}>
      <head>
        {/* Preconnect for performance / SEO Core Web Vitals */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://translate.google.com" />
        {/* Favicon – icon.png & apple-icon.png in app/ are auto-served by Next.js */}
        <link rel="icon"             href="/icon.png"           type="image/png" />
        <link rel="shortcut icon"    href="/icon.png"           type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body style={{ fontFamily: "var(--font-body, Open Sans, sans-serif)" }}>
        <ModalProvider>
          <LoadingScreen />
          <TopBar />
          <Navbar />
          {children}
          <Footer />
          <FloatingContact />
          <LoginModal />
          <SignUpModal />
          <EnquireModal />
          <ProfileModal />
        </ModalProvider>

        {/* Hidden Google Translate element */}
        <div id="google_translate_element" style={{ display: "none" }} />
        <Script id="gt-init" strategy="afterInteractive">{`
          function googleTranslateElementInit() {
            new google.translate.TranslateElement({
              pageLanguage: 'en',
              includedLanguages: 'en,hi,mr,bn,ta,gu,kn,ml,te,pa',
              autoDisplay: false,
            }, 'google_translate_element');
          }
          window.__changeLang = function(lang) {
            var sel = document.querySelector('.goog-te-combo');
            if (sel) { sel.value = lang; sel.dispatchEvent(new Event('change')); }
          };
        `}</Script>
        <Script
          src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
