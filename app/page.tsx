import Hero from "@/components/sections/Hero";
import Services from "@/components/sections/Services";
import AboutUs from "@/components/sections/AboutUs";
import WhyUs from "@/components/sections/WhyUs";
import Gallery from "@/components/sections/Gallery";
import Testimonials from "@/components/sections/Testimonials";
import ContactSection from "@/components/sections/ContactSection";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Services />
      <AboutUs />
      <WhyUs />
      <Gallery />
      <Testimonials />
      <ContactSection />
    </>
  );
}
