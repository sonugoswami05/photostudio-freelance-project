import type { Metadata } from "next";
import { Playfair_Display, Open_Sans } from "next/font/google";
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
  title: "MD Studio — Photography & Services",
  description:
    "MD Studio, Rajmahel Road, Mehsana — premier photography studio offering candid wedding, model photography, video services, and more.",
  keywords: ["MD Studio", "photography studio", "Mehsana", "wedding photographer", "candid photography"],
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
      </body>
    </html>
  );
}
