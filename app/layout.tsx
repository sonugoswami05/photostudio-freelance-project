import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "New Alankar Studio Photography",
  description:
    "New Alankar Studio, Kadi, Gujarat — premier photography studio offering candid wedding, model photography, video services, and more.",
  keywords: ["New Alankar Studio", "photography studio", "Kadi", "Gujarat", "wedding photographer", "candid photography", "Jaimin Modi"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${openSans.variable}`}>
      <body style={{ fontFamily: "var(--font-body, Open Sans, sans-serif)" }}>
        <ModalProvider>
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
