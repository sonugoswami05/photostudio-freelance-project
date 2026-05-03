import Hero from "@/components/sections/Hero";
import Gallery from "@/components/sections/Gallery";
import InstagramReels from "@/components/sections/InstagramReels";
import Services from "@/components/sections/Services";
import Testimonials from "@/components/sections/Testimonials";
import AboutUs from "@/components/sections/AboutUs";
import ContactSection from "@/components/sections/ContactSection";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://jaiminmodiphotography.in";

// ── JSON-LD Structured Data ──────────────────────────────────────────────────
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    // ── LocalBusiness + Photographer ──
    {
      "@type": ["LocalBusiness", "Photographer", "ProfessionalService"],
      "@id": `${SITE_URL}/#business`,
      name:          "Jaimin Modi Photography",
      alternateName: ["JM Photography", "Jaimin Modi", "Jaimin Modi Studio"],
      description:
        "Jaimin Modi Photography is a professional photography studio based in Kadi, Gujarat, specialising in wedding photography, candid photography, model portfolios, baby shoots, pre-wedding sessions, and video services.",
      url:        SITE_URL,
      telephone:  "+91-9974057620",
      email:      "jmodi1040@gmail.com",
      priceRange: "₹₹",
      image: [
        `${SITE_URL}/og-image.jpg`,
      ],
      logo: {
        "@type": "ImageObject",
        url:    `${SITE_URL}/logo.png`,
        width:  200,
        height: 200,
      },
      address: {
        "@type":           "PostalAddress",
        streetAddress:     "Shefali Compound, Near Shefali Cinema, Kadi - Detroj Rd, Near Krishna Hospital",
        addressLocality:   "Kadi",
        addressRegion:     "Gujarat",
        postalCode:        "382715",
        addressCountry:    "IN",
      },
      geo: {
        "@type":    "GeoCoordinates",
        latitude:   23.2978,
        longitude:  72.9735,
      },
      hasMap: "https://maps.google.com?q=23.2978,72.9735",
      openingHoursSpecification: [
        {
          "@type":       "OpeningHoursSpecification",
          dayOfWeek:     ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
          opens:         "08:00",
          closes:        "22:00",
        },
      ],
      areaServed: [
        { "@type": "City",  name: "Kadi",     sameAs: "https://en.wikipedia.org/wiki/Kadi,_India" },
        { "@type": "City",  name: "Mehsana",  sameAs: "https://en.wikipedia.org/wiki/Mehsana" },
        { "@type": "City",  name: "Ahmedabad",sameAs: "https://en.wikipedia.org/wiki/Ahmedabad" },
        { "@type": "City",  name: "Gandhinagar" },
        { "@type": "State", name: "Gujarat",  sameAs: "https://en.wikipedia.org/wiki/Gujarat" },
      ],
      sameAs: [
        "https://www.instagram.com/jaimin_modi_photography/",
      ],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Photography Services",
        itemListElement: [
          {
            "@type": "Offer",
            itemOffered: {
              "@type":       "Service",
              name:          "Wedding Photography",
              description:   "Professional wedding photography capturing every precious moment of your special day in Kadi and across Gujarat.",
              provider:      { "@id": `${SITE_URL}/#business` },
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type":       "Service",
              name:          "Candid Photography",
              description:   "Natural, unposed candid photography for weddings and events.",
              provider:      { "@id": `${SITE_URL}/#business` },
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type":       "Service",
              name:          "Pre-Wedding Shoot",
              description:   "Romantic pre-wedding photography sessions at beautiful locations.",
              provider:      { "@id": `${SITE_URL}/#business` },
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type":       "Service",
              name:          "Model Portfolio Photography",
              description:   "Professional model portfolio shoots for aspiring models in Gujarat.",
              provider:      { "@id": `${SITE_URL}/#business` },
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type":       "Service",
              name:          "Baby & Kids Photography",
              description:   "Adorable baby and kids photography sessions in studio or outdoor.",
              provider:      { "@id": `${SITE_URL}/#business` },
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type":       "Service",
              name:          "Video Services",
              description:   "Cinematic wedding and event videography services in Gujarat.",
              provider:      { "@id": `${SITE_URL}/#business` },
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type":       "Service",
              name:          "Studio Photography",
              description:   "Professional studio photography sessions for portraits, products, and more.",
              provider:      { "@id": `${SITE_URL}/#business` },
            },
          },
        ],
      },
    },

    // ── WebSite (enables Google Sitelinks Search) ──
    {
      "@type":       "WebSite",
      "@id":         `${SITE_URL}/#website`,
      url:           SITE_URL,
      name:          "Jaimin Modi Photography",
      description:   "Wedding & candid photographer in Kadi, Gujarat",
      publisher:     { "@id": `${SITE_URL}/#business` },
      inLanguage:    ["en-IN", "gu-IN", "hi-IN"],
      potentialAction: {
        "@type":       "SearchAction",
        target:        { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/?q={search_term_string}` },
        "query-input": "required name=search_term_string",
      },
    },

    // ── WebPage ──
    {
      "@type":          "WebPage",
      "@id":            `${SITE_URL}/#webpage`,
      url:              SITE_URL,
      name:             "Jaimin Modi Photography | Best Wedding & Candid Photographer in Kadi, Gujarat",
      description:      "Professional wedding, candid, model & baby photographer in Kadi, Gujarat. Book your session today.",
      isPartOf:         { "@id": `${SITE_URL}/#website` },
      about:            { "@id": `${SITE_URL}/#business` },
      inLanguage:       "en-IN",
      breadcrumb: {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home",       item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Portfolio",  item: `${SITE_URL}/#gallery` },
          { "@type": "ListItem", position: 3, name: "Services",   item: `${SITE_URL}/#services` },
          { "@type": "ListItem", position: 4, name: "About Us",   item: `${SITE_URL}/#about` },
          { "@type": "ListItem", position: 5, name: "Contact Us", item: `${SITE_URL}/#contact` },
        ],
      },
    },
  ],
};

export default function HomePage() {
  return (
    <>
      {/* Inject JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Hero />
      <Gallery />
      <InstagramReels />
      <Services />
      <Testimonials />
      <AboutUs />
      <ContactSection />
    </>
  );
}
