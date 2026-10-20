export const en = {
  // Navigation
  nav: {
    work: "WORK",
    services: "SERVICES",
    studio: "STUDIO",
    insights: "INSIGHTS",
    contact: "CONTACT",
    menu: "MENU",
    close: "CLOSE",
  },
  navSubtitles: {
    work: "Selected Case Studies & Archive",
    studio: "Philosophy, 25+ Years & Culture",
    services: "Brand, Space, Digital & Capabilities",
    insights: "Publications, Media & Case Notes",
    contact: "Direct Channels & Studio Base",
  },
  // Hero Section
  hero: {
    tagline: "UTERO.ID — BRAND & DESIGN COMPANY",
    headline1: "SOLVE PROBLEM",
    headline2: "THROUGH",
    headline3: "DESIGN",
    headline4: "SOLUTION.",
    description: "A comprehensive branding and design company helping organizations build distinctive presence, market authority, and lasting cultural value since 1998.",
    capabilities: ["IDENTITY", "PRINTED", "MISC", "DIGITAL", "ENVIRONMENTAL"],
    exploreWork: "EXPLORE OUR WORK",
    studioTag: "PART OF UTERO INDONESIA — EST. 1998",
  },
  // Services Section
  services: {
    sectionLabel: "04 / CREATIVE CAPABILITIES",
    heading: "WHAT CAN WE DESIGN FOR YOU?",
    description: "Six integrated design disciplines tailored to your strategic needs — from foundational brand identity to physical packaging, digital platforms, and environmental spatial experiences.",
    categoryLabel: "CATEGORY",
    coreDeliverables: "CORE DELIVERABLES:",
    viewDetails: "VIEW DETAILS & ARCHIVE",
  },
  // Work Page
  work: {
    archive: "Archive",
    filter: "Filter",
    byDiscipline: "By Discipline",
    byIndustry: "By Industry",
    allIndustries: "All Industries",
    allWork: "ALL WORK",
    project: "PROJECT",
    projects: "PROJECTS",
    clearAll: "Clear All ×",
    viewProject: "View Project →",
    subtitle:
      "Selected identities, spaces, products, campaigns and experiences created by Utero.",
    noProjects: "No projects match the current filters.",
    clearFilters: "Clear Filters →",
  },
  // Home page sections
  home: {
    aboutLabel: "01 / ABOUT UTERO",
    aboutHeading: "A design company built on execution, not decoration.",
    aboutBody:
      "Founded in Malang in 1998, Utero works as a single integrated studio across identity, packaging, promotion, digital, and spatial design. We take on the full chain — strategy, prototyping, engineering, and fabrication — because a concept that stops at the render is worth nothing.",
    aboutCta: "Explore Studio Story",
    archiveLabel: "Studio Archive • Editorial Catalog",
    archiveVolume: "Vol. 1998–2026",
    recentWorksLabel: "03 / RECENT WORKS",
    recentWorksHeading: "Selected Work",
    recentWorksCta: "See All Works",
    worksHeading: "WORKS",
    featuredCaseStudy: "Featured Case Study",
    manifestoLabel: "Philosophy & Execution",
    manifestoHeading: "Ide Tanpa Realisasi Sama Dengan Sampah",
    manifestoBody:
      "Strategy without physical manifestation is merely theoretical. Over our quarter-century journey, Utero has earned its reputation by rejecting purely cosmetic design in favor of rigorous, end-to-end execution. We conceptualize, prototype, engineer, and fabricate.",
    statsTitle: "Practice in Numbers",
    statsProjects: "Projects",
    statsClients: "Clients",
    statsDisciplines: "Disciplines",
    statsYears: "Years",
    ctaHeading: "Ready to solve your brand or spatial challenge?",
    ctaButton: "Start a Project",
  },
  // Media scope (homepage capability grid)
  mediaScope: {
    digital: "Digital platforms, social media, web, and application design.",
    print: "Print, packaging, collateral, and physical brand materials.",
    interior: "Interior environments, retail spaces, and exhibition design.",
    outdoor: "Billboards, environmental graphics, and large-format displays.",
  },
  // /services list page chrome
  servicesPage: {
    label: "03 / CAPABILITIES & PRACTICE",
    heading: "Services",
    description:
      "Six integrated design disciplines engineered to resolve complex strategic challenges and command enduring enterprise equity.",
    disciplinesCount: "Disciplines",
    explore: "EXPLORE",
    category: "CATEGORY",
    coreDeliverables: "CORE DELIVERABLES:",
    viewDetails: "VIEW DETAILS & ARCHIVE",
    seePortfolio: "← See Portfolio Works",
    inquireCapability: "Inquire Capability →",
    viewAria: (name: string) => `View ${name} services`,
  },
  // /services/[slug] detail page chrome
  servicesDetail: {
    backToServices: "Back to Services",
    disciplinePrefix: "Discipline",
    overview: "Discipline Overview",
    approach: "Strategic Approach",
    capabilities: "Core Capabilities",
    deliverables: "Scope of Deliverables",
    relatedWork: "Selected Work in this Discipline",
    relatedWorkEmpty: "No archived projects are linked to this discipline yet.",
    allServices: "← All Services",
    inquireProject: (name: string) => `Inquire ${name} Project →`,
    viewCase: "VIEW CASE →",
  },
  // /insights chrome (article bodies stay untranslated — authored editorial)
  insights: {
    label: "04 / INSIGHTS",
    pageHeading: "Insights",
    featured: "Featured Publication",
    readEssay: "Read Essay",
    morePerspectives: "More Perspectives",
    viewAll: "View All Articles",
    readArticle: "Read Article",
    backToInsights: "Back to Insights",
    minRead: (n: number) => `${n} min read`,
    minReadShort: (n: number) => `${n} min read`,
  },
  // Project detail chrome (project content itself stays untranslated)
  projectChrome: {
    client: "Client",
    year: "Year",
    industry: "Industry",
    disciplines: "Disciplines",
    highlights: "Highlights",
    closeLightbox: "Close lightbox",
    previousImage: "Previous image",
    nextImage: "Next image",
    videoPresentation: "Video presentation",
    closeVideo: "Close video",
    loadingDeck: "Loading presentation deck...",
    previousSlide: "Previous slide",
    nextSlide: "Next slide",
    toggleThumbnails: "Toggle thumbnails",
    thumbnails: "Thumbnails",
    deckAria: (label: string) => `${label} Deck`,
  },
  // Header / menu overlay chrome
  header: {
    toggleLanguage: "Toggle language",
    primaryNav: "Top primary navigation",
    toggleContact: "Toggle contact channels",
    openMenu: "Open studio menu",
    closeMenu: "Close studio menu",
    mainNav: "Main studio navigation",
    cityLabel: "Malang, Indonesia",
    placeholderName: "e.g. Alex Morgan",
    placeholderCompany: "e.g. Studio Vertex",
    placeholderEmail: "alex@company.com",
    placeholderBrief:
      "Briefly describe your objectives, target audience, timeline, or key challenges...",
  },
  // Contact launcher / footer shared chrome
  contactChrome: {
    channelsAria: "Direct Contact Channels",
    instagram: "Instagram",
    facebook: "Facebook",
    youtube: "YouTube",
  },
  // Discipline copy — mirrors lib/services.ts field-for-field.
  // `name`, `tagline`, `description`, `overview`, `approach`, `deliverables`,
  // `capabilities`, `heroHeadline`, `imageAlt`, `inquiryLabel` all live here.
  disciplines: {
    brand: {
      name: "BRAND",
      tagline: "Strategic Identity & Visual Systems",
      heroHeadline:
        "Designing enduring identities that command authority and inspire trust.",
      description:
        "Visual identity design, brand architecture, typography guidelines, naming, and brand manuals.",
      overview:
        "A brand is more than a mark; it is an organization's visual and emotional shorthand in the world. We build comprehensive identity systems from foundational strategy to granular execution — ensuring every touchpoint communicates precision, purpose, and unmistakable presence.",
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
      imageAlt: "Brand identity design and visual system work by Utero Studio",
      inquiryLabel: "Brand Identity",
    },
    product: {
      name: "PRODUCT",
      tagline: "Packaging & Structural Forms",
      heroHeadline:
        "Crafting tactile physical containers that make an indelible first impression.",
      description:
        "Physical product packaging, structural containers, label design, and bespoke merchandise.",
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
      imageAlt: "Product packaging and structural container design by Utero Studio",
      inquiryLabel: "Product & Packaging",
    },
    promotion: {
      name: "PROMOTION",
      tagline: "High-Impact Creative Campaigns",
      heroHeadline:
        "Creating disruptive promotional narratives that generate measurable momentum.",
      description:
        "Launch campaigns, key visual development, print collateral, social assets, and marketing toolkits.",
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
      imageAlt: "Promotional campaign key visual and print collateral by Utero Studio",
      inquiryLabel: "Promotion & Campaigns",
    },
    digital: {
      name: "DIGITAL",
      tagline: "Web Design & Interactive Systems",
      heroHeadline:
        "Building fast, high-contrast digital experiences that captivate on every screen.",
      description:
        "Modern websites, web platforms, UI/UX systems, digital product design, and interactive experiences.",
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
      imageAlt: "Digital web platform and user interface design by Utero Studio",
      inquiryLabel: "Digital & Web",
    },
    environmental: {
      name: "ENVIRONMENTAL",
      tagline: "Wayfinding & Environmental Design",
      heroHeadline:
        "Transforming inert architecture into intuitive, human-centered spatial experiences.",
      description:
        "Architectural wayfinding, public creative hub signage, directional systems, spatial branding, indoor signage, corporate office wall graphics, environmental typography, and interior visual identity.",
      overview:
        "Physical environments should intuitively welcome, guide, and inspire. From landmark public creative centers like Malang Creative Center (MCC) to modern corporate headquarters, our environmental graphics give buildings an intuitive visual pulse. Interior spaces serve as daily canvases for team culture and client impressions. We develop indoor signage systems, reception feature walls, meeting room narratives, and commercial retail graphics that bring corporate DNA into physical space.",
      approach:
        "We survey architectural floorplans, sightlines, pedestrian traffic flows, and illumination conditions. Wayfinding must function effortlessly at a glance while reinforcing the architectural character and institutional pride of the premises. We collaborate closely with interior designers and architects to select tactile materials — brushed brass, matte acrylic, powder-coated steel, and back-lit lettering — that match interior finish schedules flawlessly.",
      deliverables: [
        "Master Wayfinding Strategy",
        "Architectural Signage Specifications",
        "Directional Totems & Pylons",
        "Environmental Graphic Murals",
        "Floor Directory & Room Identifiers",
        "Material, Illumination & Mount Specs",
        "Corporate Reception Identity Walls",
        "Meeting Room Thematic Graphics",
        "Architectural Lettering & Neon Accents",
        "Safety & Code Compliance Signs",
        "Modular Tenant Directory Boards",
        "Acoustic Wall Art & Environmental Prints",
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
      imageAlt: "Environmental wayfinding and architectural signage by Utero Studio",
      inquiryLabel: "Environmental & Wayfinding",
    },
    outdoor: {
      name: "OUTDOOR",
      tagline: "Large-Scale Public Communication",
      heroHeadline:
        "Dominating urban cityscapes with structural dignity and maximum readability.",
      description:
        "City billboards, building banners, architectural pylons, transit advertising, and urban installations.",
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
      imageAlt:
        "Large-scale outdoor billboard and architectural pylon advertising by Utero Studio",
      inquiryLabel: "Outdoor Large-Scale",
    },
  },
  // Project Detail
  projectDetail: {
    allWork: "← All Work",
    startProject: "Start a Project →",
    overview: "Overview",
    challenge: "Challenge",
    approach: "Approach",
    scope: "Scope",
    deliverables: "Deliverables",
    fullPresentation: "Full Presentation",
    videoComingSoon: "Video coming soon",
    previous: "← Previous",
    next: "Next →",
  },
  // Contact Page
  contact: {
    sectionLabel: "05 / START A CONVERSATION",
    heading: "Contact",
    description: "Have a brand, product, digital platform, or architectural space that needs purpose? We collaborate with bold leaders across Indonesia.",
    malang: "Malang",
    timezone: "UTC+7 · WIB",
    directWhatsApp: "Direct WhatsApp Channels",
    clientRelations: "Client Relations",
    studioManagement: "Studio Management",
    emailCommunication: "Email Communication",
    malangHQ: "Malang Headquarters",
    operatingHours: "Studio Operating Hours",
    projectBrief: "Project Brief Inquiry",
    tellUsVision: "Tell Us About Your Vision",
    interestedDisciplines: "Interested Disciplines",
    name: "Name *",
    company: "Company",
    email: "Email *",
    phone: "Phone",
    brief: "Project Brief *",
    submit: "SUBMIT PROJECT BRIEF",
    inquiryReceived: "Inquiry Received",
    thankYou: "Thank you for contacting Utero Indonesia. Our client strategy director will review your brief and connect within 1 business day.",
    submitAnother: "Submit Another Inquiry",
    errorRequired: "Please fill in all required fields (*)",
    errorTryAgain: "Something went wrong. Please try again.",
    openMaps: "Open in Google Maps →",
  },
  // Studio Page
  studio: {
    sectionLabel: "02 / ABOUT UTERO INDONESIA",
    heading: "Studio",
    description: "A multidisciplinary brand consultancy and spatial design studio founded in Malang in 1998. We bridge strategic intellect with industrial fabrication.",
    established: "Established",
    metrics: {
      years: "Years of Practice",
      yearsSub: "Continuous operation since 1998",
      disciplines: "Integrated Disciplines",
      disciplinesSub: "Brand, Product, Promotion, Digital, Environmental & Outdoor",
      projects: "Completed Projects",
      projectsSub: "Corporate, Public & Commercial",
      hq: "Studio Headquarters",
      hqSub: "East Java, Indonesia",
    },
    executionPhilosophy: "The Execution Philosophy",
    philosophyQuote: '"Ide tanpa realisasi sama dengan sampah."',
    philosophyText: "Strategy without physical manifestation is merely theoretical. Over our quarter-century journey, Utero has earned its reputation by rejecting purely cosmetic design in favor of rigorous, end-to-end execution. We conceptualize, prototype, engineer, and fabricate.",
    integratedDisciplines: "Integrated Disciplines",
    disciplinesText1: "Unlike specialized boutique agencies that isolate digital from physical, Utero houses identity designers, industrial packaging craftsmen, spatial wayfinding architects, and structural sign engineers under a single unified philosophy.",
    disciplinesText2: "Whether developing master public wayfinding for the Malang Creative Center (MCC) or scaling consumer packaged goods for national distribution, our teams deliver seamless brand continuity across all sensory dimensions.",
    culture: "Studio Culture & Infrastructure",
    clientSectors: "Client Sectors Served",
    collaborate: "Collaborate with Utero",
    readyToSolve: "Ready to solve your brand or spatial challenge?",
    connectStudio: "Connect with our Studio →",
  },
  // Footer
  footer: {
    tagline: "DESIGN AS A SOLUTION.",
    description: "A premier Indonesian brand consultant and creative design agency. Transforming vision into reality with strategic craft since 1998.",
    navigation: "NAVIGATION",
    whatsappInquiries: "WHATSAPP INQUIRIES",
    emailSocial: "EMAIL & SOCIAL",
    copyright: "© 1998 — [YEAR] UTERO.ID. All rights reserved.",
    location: "MALANG, INDONESIA — CREATIVE DESIGN STUDIO",
  },
  // 404 Not Found Page
  notFound: {
    label: "404 / NOT FOUND",
    headline: "PAGE NOT FOUND",
    description: "The page you are looking for doesn't exist, has been removed, or has moved to a new address.",
    backHome: "Back to Home",
    viewWork: "View Our Work",
  },
  // Industry Labels (filter taxonomy - kept as data labels, not translated)
  industries: {
    corporate: "Corporate",
    fnb: "F&B",
    government: "Government",
    education: "Education",
    arts: "Arts & Culture",
    services: "Services",
    retail: "Retail",
    property: "Property",
    event: "Event",
  },
};
