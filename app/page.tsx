import Hero from "@/components/sections/Hero";
import Gallery from "@/components/sections/Gallery";
import Services from "@/components/sections/Services";
import Testimonials from "@/components/sections/Testimonials";
import AboutUs from "@/components/sections/AboutUs";
import ContactSection from "@/components/sections/ContactSection";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Gallery />
      <Services />
      <Testimonials />
      <AboutUs />
      <ContactSection />
    </>
  );
}
