export interface ServiceItem {
  slug: string;
  number: string;
  name: string;
  tagline: string;
  heroHeadline: string;
  description: string;
  overview: string;
  approach: string;
  deliverables: string[];
  capabilities: { title: string; desc: string }[];
  image: string;
  relatedProjectSlugs: string[];
}

export const servicesData: ServiceItem[] = [
  {
    slug: "brand",
    number: "01",
    name: "BRAND",
    tagline: "Strategic Identity & Visual Systems",
    heroHeadline: "Designing enduring identities that command authority and inspire trust.",
    description: "Visual identity design, brand architecture, typography guidelines, naming, and brand manuals.",
    overview:
      "A brand is more than a mark; it is an organization's visual and emotional shorthand in the world. We build comprehensive identity systems from foundational strategy to granular execution—ensuring every touchpoint communicates precision, purpose, and unmistakable presence.",
    approach:
      "We begin with diagnostic interrogation of market positioning, audience psychology, and competitive white space. From there, we develop cohesive visual architectures: typographic hierarchies, calibrated color palettes, custom iconography, and strict application standards that scale effortlessly across physical and digital realms.",
    deliverables: [
      "Visual Identity Systems",
      "Brand Architecture & Positioning",
      "Logo Systems & Logotypes",
      "Comprehensive Brand Guidelines",
      "Typography Standards & Custom Sets",
      "Stationery & Corporate Collateral",
    ],
    capabilities: [
      {
        title: "Brand Architecture",
        desc: "Structuring multi-tier sub-brands, product lines, and corporate parent relationships for absolute market clarity.",
      },
      {
        title: "Visual Language Systems",
        desc: "Developing harmonious color rules, typographic scales, spatial layouts, and visual motifs.",
      },
      {
        title: "Guidelines & Brand Books",
        desc: "Exhaustive technical documentation detailing safe zones, digital specs, and fabrication standards.",
      },
    ],
    image: "/img/remote/brand.jpg",
    relatedProjectSlugs: ["garageplug", "baiturrokhman", "festival-mbois-8"],
  },
  {
    slug: "product",
    number: "02",
    name: "PRODUCT",
    tagline: "Packaging & Structural Forms",
    heroHeadline: "Crafting tactile physical containers that make an indelible first impression.",
    description: "Physical product packaging, structural containers, label design, and bespoke merchandise.",
    overview:
      "Packaging is the physical handshake between your brand and the consumer. Before an item is consumed or experienced, hands feel the form, weight, and paper stock. We engineer packaging that combines shelf dominance with ergonomic utility and production feasibility.",
    approach:
      "Our studio approaches packaging as three-dimensional brand architecture. We examine substrate durability, printing finishes (foil stamping, spot UV, blind deboss), shelf lighting, regulatory nutritional/barcode placement, and unboxing rituals to elevate consumer delight.",
    deliverables: [
      "Primary & Secondary Packaging",
      "Custom Structural Die-lines",
      "Label Systems & Bottle Artwork",
      "Unboxing Experience Design",
      "Retail Shipper & Display Boxes",
      "Production File Technical Pre-press",
    ],
    capabilities: [
      {
        title: "Structural Engineering",
        desc: "Creating bespoke physical form factors, closures, and folding geometries tailored to material efficiency.",
      },
      {
        title: "Pre-Press Calibration",
        desc: "Direct coordination with print houses, pantone matching, and proof verification to guarantee zero production variance.",
      },
      {
        title: "Material & Sustainability",
        desc: "Specifying sustainable paper stocks, soy inks, and recyclable finishes that fulfill environmental stewardship.",
      },
    ],
    image: "/img/remote/product.jpg",
    relatedProjectSlugs: ["kopilogi-packaging", "keripik-tempe-malang"],
  },
  {
    slug: "promotion",
    number: "03",
    name: "PROMOTION",
    tagline: "High-Impact Creative Campaigns",
    heroHeadline: "Creating disruptive promotional narratives that generate measurable momentum.",
    description: "Launch campaigns, key visual development, print collateral, social assets, and marketing toolkits.",
    overview:
      "Memorable campaigns cut through the endless noise of everyday communication with bold concepting and immaculate execution. We conceive key visual systems that translate effortlessly across city-scale billboards, transit media, social platforms, and tactile event collateral.",
    approach:
      "Every campaign starts with a core narrative hook that crystallizes the brand proposition into an undeniable emotional trigger. We then deploy cross-media collateral designed to maintain conceptual unity while optimizing for each medium's unique constraints.",
    deliverables: [
      "Campaign Key Visuals (KV)",
      "Launch Narrative & Copy Direction",
      "Print Collateral & Editorial Lookbooks",
      "Multi-Format Digital Social Toolkits",
      "Point-of-Sale (POSM) Retail Displays",
      "Event Brand Assets & Stage Backdrops",
    ],
    capabilities: [
      {
        title: "Key Visual Architecture",
        desc: "Creating flexible master campaign graphics that flex from 9:16 vertical mobile screens to 30-meter roadside banners.",
      },
      {
        title: "Art Direction",
        desc: "Overseeing studio photography, styling, illustration, and typographic hierarchy for campaign cohesion.",
      },
      {
        title: "Retail Merchandising (POSM)",
        desc: "Engineering physical store displays, table-talkers, and wobblers that trigger final purchasing decisions.",
      },
    ],
    image: "/img/remote/promotion.jpg",
    relatedProjectSlugs: ["festival-mbois-8", "garageplug"],
  },
  {
    slug: "space",
    number: "04",
    name: "SPACE",
    tagline: "Wayfinding & Environmental Design",
    heroHeadline: "Transforming inert architecture into intuitive, human-centered spatial experiences.",
    description: "Architectural wayfinding, public creative hub signage, directional systems, and spatial branding.",
    overview:
      "Physical environments should intuitively welcome, guide, and inspire. From landmark public creative centers like Malang Creative Center (MCC) to modern corporate headquarters, our environmental graphics give buildings an intuitive visual pulse.",
    approach:
      "We survey architectural floorplans, sightlines, pedestrian traffic flows, and illumination conditions. Wayfinding must function effortlessly at a glance while reinforcing the architectural character and institutional pride of the premises.",
    deliverables: [
      "Master Wayfinding Strategy",
      "Architectural Signage Specifications",
      "Directional Totems & Pylons",
      "Environmental Graphic Murals",
      "Floor Directory & Room Identifiers",
      "Material, Illumination & Mount Specs",
    ],
    capabilities: [
      {
        title: "Spatial Circulation Studies",
        desc: "Mapping decision points and line-of-sight analysis to eliminate navigation confusion across complex multi-floor facilities.",
      },
      {
        title: "Architectural Integration",
        desc: "Designing signage mounts and hardware that harmonize with concrete, steel, glass, and timber structures.",
      },
      {
        title: "Universal Accessibility",
        desc: "Implementing high-contrast typography, international pictograms, and legible scale for all visitor demographics.",
      },
    ],
    image: "/img/remote/space.jpg",
    relatedProjectSlugs: ["malang-creative-center-wayfinding", "baiturrokhman"],
  },
  {
    slug: "digital",
    number: "05",
    name: "DIGITAL",
    tagline: "Web Design & Interactive Systems",
    heroHeadline: "Building fast, high-contrast digital experiences that captivate on every screen.",
    description: "Modern websites, web platforms, UI/UX systems, digital product design, and interactive experiences.",
    overview:
      "In the digital landscape, friction is fatal. We craft bespoke web experiences that marry bold editorial art direction with lightning-quick performance, accessible interactions, and fluid responsive layouts.",
    approach:
      "We design digital interfaces using typography-driven layout systems, modular design tokens, and smooth micro-interactions. Our code is lean, semantic, and optimized for instant load times and search visibility.",
    deliverables: [
      "Custom Editorial Websites",
      "Brand Web Platforms & Portals",
      "UI/UX Design Systems & Components",
      "Responsive Interactive Prototypes",
      "Search Engine Optimization (SEO)",
      "High-Performance Frontend Engineering",
    ],
    capabilities: [
      {
        title: "Modern Component Architecture",
        desc: "Building clean, maintainable, TypeScript-powered Next.js applications tailored to enterprise scale.",
      },
      {
        title: "Interaction & Motion Design",
        desc: "Implementing subtle micro-animations, cursor interactions, and page transitions that elevate user engagement.",
      },
      {
        title: "Performance & Responsiveness",
        desc: "Zero layout shift, optimized image assets, and flawless cross-device fluidity from handheld to 4K displays.",
      },
    ],
    image: "/img/remote/digital.jpg",
    relatedProjectSlugs: ["utero-digital-system", "garageplug"],
  },
  {
    slug: "indoor",
    number: "06",
    name: "INDOOR",
    tagline: "Commercial Signs & Environmental Graphics",
    heroHeadline: "Curating commercial interiors that communicate prestige and workplace culture.",
    description: "Indoor signage, corporate office wall graphics, environmental typography, and interior visual identity.",
    overview:
      "An interior space is a daily canvas for team culture and client impressions. We develop indoor signage systems, reception feature walls, meeting room narratives, and commercial retail graphics that bring corporate DNA into physical space.",
    approach:
      "We collaborate closely with interior designers and architects to select tactile materials—brushed brass, matte acrylic, powder-coated steel, and back-lit lettering—that match interior finish schedules flawlessly.",
    deliverables: [
      "Corporate Reception Identity Walls",
      "Meeting Room Thematic Graphics",
      "Architectural Lettering & Neon Accents",
      "Safety & Code Compliance Signs",
      "Modular Tenant Directory Boards",
      "Acoustic Wall Art & Environmental Prints",
    ],
    capabilities: [
      {
        title: "Material Craft & Lighting",
        desc: "Combining halo-lit LEDs, laser-cut acrylic, and brushed aluminum for premium tactile contrast.",
      },
      {
        title: "Modular Update Systems",
        desc: "Engineering easily swappable tenant names and office designations without damaging wall finishes.",
      },
      {
        title: "Workplace Cultural Graphics",
        desc: "Turning corporate values and milestones into striking typography murals across team collaborative zones.",
      },
    ],
    image: "/img/remote/indoor.jpg",
    relatedProjectSlugs: ["baiturrokhman", "malang-creative-center-wayfinding"],
  },
  {
    slug: "outdoor",
    number: "07",
    name: "OUTDOOR",
    tagline: "Large-Scale Public Communication",
    heroHeadline: "Dominating urban cityscapes with structural dignity and maximum readability.",
    description: "City billboards, building banners, architectural pylons, transit advertising, and urban installations.",
    overview:
      "Outdoor media operates at monumental scale. Viewed at 60 km/h from distances of 100 meters, outdoor advertising requires razor-sharp contrast, instantly legible typography, and structural stability in all weather conditions.",
    approach:
      "Our 25+ years in advertising production provides unmatched mastery over steel fabrication, wind-load calculations, high-durability vinyl substrates, weatherproof UV inks, and calibrated night illumination.",
    deliverables: [
      "Highway Billboards & City Gantry Signs",
      "Monolithic Architectural Pylons",
      "Building Facade Wraps & Giant Banners",
      "Illuminated 3D Rooftop Lettering",
      "Structural Engineering Drawings",
      "Permit & Municipal Code Coordination",
    ],
    capabilities: [
      {
        title: "Highway & Urban Sightlines",
        desc: "Positioning typography and color contrast for optimal readability at vehicular speeds and long viewing angles.",
      },
      {
        title: "Structural Fabrication",
        desc: "Engineering welded steel frames, foundation footings, and weather-sealed internal lighting boxes.",
      },
      {
        title: "High-Durability Production",
        desc: "Utilizing industrial-grade vinyls, fade-resistant UV pigmentation, and heavy-duty tensioning systems.",
      },
    ],
    image: "/img/remote/outdoor.jpg",
    relatedProjectSlugs: ["garageplug", "festival-mbois-8"],
  },
];

export function getServiceBySlug(slug: string): ServiceItem | undefined {
  return servicesData.find((s) => s.slug === slug);
}

export function getAllServiceSlugs(): string[] {
  return servicesData.map((s) => s.slug);
}
