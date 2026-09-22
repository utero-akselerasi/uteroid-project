// ─────────────────────────────────────────────────────────────────────
// UTERO.ID — Project Data
// ─────────────────────────────────────────────────────────────────────
//
// HOW TO ADD A REAL PROJECT:
//   1. Add a new object to the `projects` array below.
//   2. Drop the cover image + gallery images into /public/projects/[slug]/
//   3. Update coverImage and galleryImages paths.
//   4. Set featured: true for the first ~4 most recent showcase works.
//
// All UI components (archive grid, homepage selection, detail page)
// read from this single array — no other changes needed.
// ─────────────────────────────────────────────────────────────────────

import type { Project, Discipline, Industry, WorkFilter } from "./types";
import { filterToDisciplines } from "./types";

export const projects: Project[] = [
  // ── 01 — GaragePlug Indonesia ─────────────────────────────────────
  {
    slug: "garageplug",
    title: "GaragePlug Indonesia",
    client: "PT. Era Automotive Revolution",
    year: "2024",
    category: "Brand Identity & Design System",
    industry: "services",
    disciplines: ["identity", "digital", "print", "indoor", "outdoor"],
    shortDescription:
      "Platform cloud terintegrasi untuk bengkel mobil dan detailing center, dilengkapi sistem pedoman identitas brand (GSM) komprehensif dari logo hingga armada transportasi.",
    description:
      "GaragePlug adalah perangkat lunak berbasis cloud easy-to-use yang menyediakan platform digital end-to-end untuk bengkel mobil dan detailing center. Sebagai platform premium cloud untuk industri pelayanan otomotif yang dipercaya lebih dari 5.000 pengguna di seluruh dunia, GaragePlug berekspansi ke Indonesia di bawah naungan PT. Era Automotive Revolution. Utero merancang sistem standarisasi identitas visual (GSM) menyeluruh mencakup logogram generator tenaga, konfigurasi logo horizontal & vertikal, sistem warna hijau tua (#003D2E) dan supergraphic, sarana korporasi, seragam teknisi, merchandise, sarana penanda (totem & neonbox), media promosi, hingga livery armada transportasi.",
    excerpt:
      "Platform cloud terintegrasi untuk bengkel mobil dan detailing center, dilengkapi sistem pedoman identitas brand (GSM) komprehensif dari logo hingga armada transportasi.",
    coverImage: "/projects/garageplug/cover.webp",
    heroImage: "/projects/garageplug/cover.webp",
    hoverImage: "/projects/garageplug/07-page-26.webp",
    galleryImages: [
      "/projects/garageplug/01-page-08.webp",
      "/projects/garageplug/02-page-10.webp",
      "/projects/garageplug/03-page-12.webp",
      "/projects/garageplug/04-page-15.webp",
      "/projects/garageplug/05-page-20.webp",
      "/projects/garageplug/06-page-22.webp",
      "/projects/garageplug/07-page-26.webp",
      "/projects/garageplug/08-page-27.webp",
      "/projects/garageplug/09-page-29.webp",
      "/projects/garageplug/10-page-30.webp",
      "/projects/garageplug/11-page-31.webp",
      "/projects/garageplug/12-page-32.webp",
      "/projects/garageplug/13-page-33.webp",
      "/projects/garageplug/14-page-41.webp",
      "/projects/garageplug/15-page-45.webp",
      "/projects/garageplug/16-page-52.webp",
      "/projects/garageplug/17-page-55.webp",
      "/projects/garageplug/18-page-58.webp",
      "/projects/garageplug/19-page-60.webp",
      "/projects/garageplug/20-page-64.webp",
      "/projects/garageplug/21-page-66.webp",
      "/projects/garageplug/22-page-70.webp",
      "/projects/garageplug/23-page-72.webp",
      "/projects/garageplug/24-page-74.webp",
    ],
    featured: true,
    priority: 100,
    tags: ["automotive", "saas", "identity", "gsm", "fleet"],
    details: {
      scope: [
        "Brand Identity & Positioning",
        "Graphic Standard Manual (GSM)",
        "Corporate Stationery System",
        "Signage & Environmental (Totem, Pylon)",
        "Fleet Livery & Vehicle Wrap",
        "Apparel & Uniform System",
        "Marketing & Promotional Collateral",
      ],
      challenge:
        "Membangun kredibilitas brand software otomotif global di pasar Indonesia dengan identitas visual yang solid, terstandarisasi, dan mudah diaplikasikan pada ragam media mulai dari antarmuka digital hingga penanda fisik bengkel berskala besar.",
      solution:
        "Merancang sistem identitas visual berbasis simbol generator daya bertenaga dengan palet warna hijau botol (#003D2E) yang mencerminkan ketangguhan dan presisi teknologi. Pedoman GSM mencakup aturan ketat tipografi, supergrafik sudut tajam, panduan seragam, hingga standarisasi branding armada bergerak.",
      deliverables: [
        "Buku Pedoman Standar Grafis (GSM) 76 Halaman",
        "Sistem Logo & Supergrafik",
        "Desain Signage Eksterior & Interior Bengkel",
        "Desain Livery Armada Mobil Operasional",
        "Seragam Teknisi & Staf Kantor",
      ],
    },
  },

  // ── 02 — Malang Creative Center (MCC) ─────────────────────────────
  {
    slug: "mcc",
    title: "Malang Creative Center",
    client: "Pemerintah Kota Malang / Diskopindag",
    year: "2023",
    category: "Public Sector & Wayfinding System",
    industry: "government",
    disciplines: ["identity", "signage", "indoor", "outdoor"],
    shortDescription:
      "Pusat inkubasi dan kolaborasi 17 subsektor ekonomi kreatif di Malang Raya, dilengkapi standarisasi identitas visual ruang dan wayfinding multi-lantai.",
    description:
      "Malang Creative Center (MCC) adalah gedung representasi 17 subsektor ekonomi kreatif terbesar di Jawa Timur, diinisiasi oleh Pemerintah Kota Malang. Gedung 8 lantai ini menjadi wadah kolaborasi, inkubasi, dan pameran karya insan kreatif lokal. Utero menyusun pedoman visual menyeluruh yang menerjemahkan semangat integrasi dan inovasi Malang ke dalam sistem grafis arsitektural: dari signatur tipografi fasad, sistem wayfinding direktori tiap lantai, penanda zona kreatif (broadcast room, auditorium, co-working, culinary lab), piktogram kustom, hingga materi promosi peresmian.",
    excerpt:
      "Pusat inkubasi dan kolaborasi 17 subsektor ekonomi kreatif di Malang Raya, dilengkapi standarisasi identitas visual ruang dan wayfinding multi-lantai.",
    coverImage: "/projects/mcc/cover.webp",
    heroImage: "/projects/mcc/cover.webp",
    hoverImage: "/projects/mcc/03-page-04.webp",
    galleryImages: [
      "/projects/mcc/01-page-02.webp",
      "/projects/mcc/02-page-03.webp",
      "/projects/mcc/03-page-04.webp",
      "/projects/mcc/04-page-05.webp",
      "/projects/mcc/05-page-06.webp",
      "/projects/mcc/06-page-07.webp",
      "/projects/mcc/07-page-08.webp",
      "/projects/mcc/08-page-09.webp",
      "/projects/mcc/09-page-10.webp",
      "/projects/mcc/10-page-11.webp",
      "/projects/mcc/11-page-12.webp",
      "/projects/mcc/12-page-13.webp",
      "/projects/mcc/13-page-14.webp",
      "/projects/mcc/14-page-15.webp",
      "/projects/mcc/15-page-16.webp",
      "/projects/mcc/16-page-17.webp",
      "/projects/mcc/17-page-18.webp",
      "/projects/mcc/18-page-19.webp",
      "/projects/mcc/19-page-20.webp",
      "/projects/mcc/20-page-21.webp",
    ],
    featured: true,
    priority: 99,
    tags: ["creative-hub", "government", "wayfinding", "signage", "public-space"],
    details: {
      scope: [
        "Sistem Identitas Spasial & Lingkungan",
        "Wayfinding & Direktori Multi-Lantai",
        "Piktogram & Ikonografi Kustom",
        "Signage Fasad & Penanda Ruang",
        "Panduan Standar Grafis Gedung",
      ],
      challenge:
        "Menghubungkan ruang 8 lantai yang menaungi 17 subsektor ekonomi kreatif berbeda dengan alur navigasi yang intuitif, ramah publik, sekaligus mengekspresikan dinamika kota Malang yang muda dan progresif.",
      solution:
        "Merancang sistem penanda visual bernuansa biru korporasi cerdas (#0A1F65) dipadu oranye aksen, dilengkapi piktogram modular yang mudah dipahami lintas usia. Setiap zona fungsional diberi kode grafis konsisten dari lantai basement hingga rooftop.",
      deliverables: [
        "Pedoman Standar Identitas Visual Gedung MCC",
        "Sistem Penanda Arah (Wayfinding) 8 Lantai",
        "Paket Ikonografi & Piktogram Ruang Kreatif",
        "Instalasi Fasad & Penanda Masuk Utama",
      ],
    },
  },

  // ── 03 — Stamford Tyres Indonesia ─────────────────────────────────
  {
    slug: "stamford",
    title: "Stamford Tyres Indonesia",
    client: "PT. Stamford Tyres Distributor Indonesia",
    year: "2023",
    category: "Automotive Distributor Identity",
    industry: "corporate",
    disciplines: ["identity", "print", "outdoor"],
    shortDescription:
      "Distributor ban dan velg premium internasional asal Singapura, dengan standarisasi visual jaringan ritel dan materi promosi nasional di Indonesia.",
    description:
      "Stamford Tyres adalah salah satu distributor ban dan velg independen terbesar di Asia Pasifik yang tercatat di Bursa Efek Singapura sejak 1930-an. Melalui PT. Stamford Tyres Distributor Indonesia, perusahaan memperluas jaringan retail dan distribusi ban komersial serta passenger. Utero merumuskan pedoman standarisasi identitas grafis (GSM) untuk memastikan konsistensi citra brand global di Indonesia: mencakup standarisasi logo Stamford merah (#CB1E22), supergrafik strip dinamis, pedoman visual bengkel rekanan (shopfront & canopy), stasioneri resmi, hingga media promosi outdoor dan pameran Gaikindo.",
    excerpt:
      "Distributor ban dan velg premium internasional asal Singapura, dengan standarisasi visual jaringan ritel dan materi promosi nasional di Indonesia.",
    coverImage: "/projects/stamford/cover.webp",
    heroImage: "/projects/stamford/cover.webp",
    hoverImage: "/projects/stamford/07-page-08.webp",
    galleryImages: [
      "/projects/stamford/01-page-02.webp",
      "/projects/stamford/02-page-03.webp",
      "/projects/stamford/03-page-04.webp",
      "/projects/stamford/04-page-05.webp",
      "/projects/stamford/05-page-06.webp",
      "/projects/stamford/06-page-07.webp",
      "/projects/stamford/07-page-08.webp",
      "/projects/stamford/08-page-09.webp",
      "/projects/stamford/09-page-10.webp",
      "/projects/stamford/10-page-11.webp",
      "/projects/stamford/11-page-12.webp",
      "/projects/stamford/12-page-13.webp",
      "/projects/stamford/13-page-14.webp",
      "/projects/stamford/14-page-15.webp",
      "/projects/stamford/15-page-16.webp",
      "/projects/stamford/16-page-17.webp",
      "/projects/stamford/17-page-18.webp",
      "/projects/stamford/18-page-19.webp",
      "/projects/stamford/19-page-20.webp",
      "/projects/stamford/20-page-21.webp",
    ],
    featured: true,
    priority: 98,
    tags: ["automotive", "corporate", "singapore", "tires", "retail"],
    details: {
      scope: [
        "Adaptasi Brand Global & GSM Lokal",
        "Standarisasi Fascia & Shopfront Ritel",
        "Sistem Supergrafik Strip Otomotif",
        "Stasioneri & Dokumen Bisnis",
        "Media Promosi B2B & Pameran",
      ],
      challenge:
        "Menjaga integritas dan reputasi brand prinsipal Stamford Tyres Singapura dalam penerapan di ratusan toko ban rekanan di seluruh kota Indonesia tanpa kehilangan karakter premiumnya.",
      solution:
        "Menyusun buku panduan implementasi ritel dengan ketentuan ukuran presisi, rasio warna merah-putih-hitam, panduan iluminasi neonbox, serta layout display velg dan ban yang teratur dan higienis.",
      deliverables: [
        "Buku Panduan Standar Grafis (GSM) Ritel Indonesia",
        "Sistem Fasad Toko & Signage Bengkel Rekanan",
        "Katalog Produk & Media Promosi Penjualan",
        "Panduan Aplikasi Branding Armada Truk Logistik",
      ],
    },
  },

  // ── 04 — Chatten Cafe ─────────────────────────────────────────────
  {
    slug: "chatten",
    title: "Chatten Cafe",
    client: "Chatten Coffee & Eatery",
    year: "2023",
    category: "Hospitality & Packaging Experience",
    industry: "fnb",
    disciplines: ["identity", "packaging", "indoor"],
    shortDescription:
      "Identitas visual retro pop dan pedoman packaging gerai kopi dan sajian float modern.",
    description:
      "Chatten Cafe adalah destinasi kuliner kopi dan float di Malang yang menggabungkan estetika retro pop 80-an dengan kenyamanan nongkrong kontemporer. Utero membangun identitas brand menyeluruh: dari maskot beruang retro yang ikonik, logotype kustom bergaya bubble script, palet warna pastel hangat (kuning mustard, toffee brown, cream), desain kemasan take-away cup dan pastry box, signage neon interior, hingga seragam barista dan konten media sosial.",
    excerpt:
      "Identitas visual retro pop dan pedoman packaging gerai kopi dan sajian float modern.",
    coverImage: "/projects/chatten/cover.webp",
    heroImage: "/projects/chatten/cover.webp",
    hoverImage: "/projects/chatten/14-page-15.webp",
    galleryImages: [
      "/projects/chatten/01-page-02.webp",
      "/projects/chatten/02-page-03.webp",
      "/projects/chatten/03-page-04.webp",
      "/projects/chatten/04-page-05.webp",
      "/projects/chatten/05-page-06.webp",
      "/projects/chatten/06-page-07.webp",
      "/projects/chatten/07-page-08.webp",
      "/projects/chatten/08-page-09.webp",
      "/projects/chatten/09-page-10.webp",
      "/projects/chatten/10-page-11.webp",
      "/projects/chatten/11-page-12.webp",
      "/projects/chatten/12-page-13.webp",
      "/projects/chatten/13-page-14.webp",
      "/projects/chatten/14-page-15.webp",
      "/projects/chatten/15-page-16.webp",
      "/projects/chatten/16-page-17.webp",
      "/projects/chatten/17-page-18.webp",
      "/projects/chatten/18-page-19.webp",
      "/projects/chatten/19-page-20.webp",
      "/projects/chatten/20-page-21.webp",
    ],
    featured: true,
    priority: 97,
    tags: ["fnb", "coffee", "retro", "packaging"],
    details: {
      scope: [
        "Konsep & Strategi Brand",
        "Identitas Visual & Maskot",
        "Sistem Tipografi Retro",
        "Kemasan Produk (Packaging)",
        "Elemen Interior Cafe",
        "Media Promosi Digital",
      ],
      challenge:
        "Menciptakan identitas merek yang hangat dan memorable untuk cafe kopi dan float, menonjol di tengah persaingan ketat industri F&B dengan karakter visual retro pop yang autentik.",
      solution:
        "Membangun ekosistem visual berbasis maskot karakter retro yang kuat, dipadu sistem tipografi vintage dan palet warna hangat, diterapkan konsisten di seluruh kemasan, interior, dan komunikasi brand.",
      deliverables: [
        "Logo & Brand Identity",
        "Maskot Brand",
        "Packaging System (Cup, Box, Bag)",
        "Interior Graphic Elements",
        "Social Media Kit & Template",
      ],
    },
  },

  // ── 05 — Bank Sidoarjo ────────────────────────────────────────────────────
  {
    slug: "bank-sidoarjo",
    title: "Bank Sidoarjo",
    client: "BPR Delta Artha (Bank Sidoarjo)",
    year: "2022",
    category: "Banking Brand Identity & Spatial",
    industry: "corporate",
    disciplines: ["identity", "print", "outdoor"],
    shortDescription:
      "Pedoman identitas visual Bank Sidoarjo — standarisasi brand perbankan daerah komprehensif.",
    description:
      "Pedoman identitas visual Bank Sidoarjo yang komprehensif mencakup standarisasi logo, sistem warna korporasi, tipografi, sarana komunikasi, dan aplikasi periklanan.",
    excerpt: "Pedoman identitas visual Bank Sidoarjo — standarisasi brand perbankan daerah komprehensif.",
    coverImage: "/projects/bank-sidoarjo/cover.webp",
    heroImage: "/projects/bank-sidoarjo/cover.webp",
    hoverImage: "/projects/bank-sidoarjo/12.webp",
    galleryImages: [
      "/projects/bank-sidoarjo/01.webp",
      "/projects/bank-sidoarjo/02.webp",
      "/projects/bank-sidoarjo/03.webp",
      "/projects/bank-sidoarjo/04.webp",
      "/projects/bank-sidoarjo/05.webp",
      "/projects/bank-sidoarjo/06.webp",
      "/projects/bank-sidoarjo/07.webp",
      "/projects/bank-sidoarjo/08.webp",
      "/projects/bank-sidoarjo/09.webp",
      "/projects/bank-sidoarjo/10.webp",
      "/projects/bank-sidoarjo/11.webp",
      "/projects/bank-sidoarjo/12.webp",
      "/projects/bank-sidoarjo/13.webp",
      "/projects/bank-sidoarjo/14.webp",
    ],
    featured: false,
    priority: 90,
    tags: ["banking", "identity", "corporate", "gsm"],
  },

  // ── 06 — Mie Gacoan ───────────────────────────────────────────────────────
  {
    slug: "mie-gacoan",
    title: "Mie Gacoan",
    client: "PT. Pesta Pora Abadi",
    year: "2021",
    category: "Culinary Megabrand Identity System",
    industry: "fnb",
    disciplines: ["identity", "packaging", "outdoor"],
    shortDescription:
      "Graphic Standard Manual jaringan kuliner nomor 1 di Indonesia Mie Gacoan.",
    description:
      "Standarisasi identitas visual brand Mie Gacoan yang mencakup konfigurasi logo, pedoman warna pink-kuning-biru ceria, signage outlet, packaging ramah take-away, seragam tim, dan materi promosi.",
    excerpt: "Graphic Standard Manual jaringan kuliner nomor 1 di Indonesia Mie Gacoan.",
    coverImage: "/projects/mie-gacoan/cover.webp",
    heroImage: "/projects/mie-gacoan/cover.webp",
    hoverImage: "/projects/mie-gacoan/15.webp",
    galleryImages: [
      "/projects/mie-gacoan/01.webp",
      "/projects/mie-gacoan/02.webp",
      "/projects/mie-gacoan/03.webp",
      "/projects/mie-gacoan/04.webp",
      "/projects/mie-gacoan/05.webp",
      "/projects/mie-gacoan/06.webp",
      "/projects/mie-gacoan/07.webp",
      "/projects/mie-gacoan/08.webp",
      "/projects/mie-gacoan/09.webp",
      "/projects/mie-gacoan/10.webp",
      "/projects/mie-gacoan/11.webp",
      "/projects/mie-gacoan/12.webp",
      "/projects/mie-gacoan/13.webp",
      "/projects/mie-gacoan/14.webp",
      "/projects/mie-gacoan/15.webp",
    ],
    featured: false,
    priority: 89,
    tags: ["fnb", "mie-gacoan", "culinary", "brand-identity"],
  },

  // ── 07 — 75 Tahun Republik Indonesia ──────────────────────────────────────
  {
    slug: "logo-75th-indonesia",
    title: "75 Tahun Republik Indonesia",
    client: "Pemerintah RI / Panitia Nasional",
    year: "2020",
    category: "National Anniversary Identity & Campaign",
    industry: "government",
    disciplines: ["identity", "campaign", "outdoor"],
    shortDescription:
      "Sistem identitas visual dan pedoman aplikasi logo peringatan 75 Tahun Kemerdekaan RI.",
    description:
      "Pedoman Graphic Standard Manual logo 75 Tahun Indonesia Merdeka — sistem identitas visual perayaan nasional, aturan konfigurasi, palet merah putih, supergrafis, umbul-umbul, dan media publikasi luar ruang.",
    excerpt: "Sistem identitas visual dan pedoman aplikasi logo peringatan 75 Tahun Kemerdekaan RI.",
    coverImage: "/projects/logo-75th-indonesia/cover.webp",
    heroImage: "/projects/logo-75th-indonesia/cover.webp",
    hoverImage: "/projects/logo-75th-indonesia/11.webp",
    galleryImages: [
      "/projects/logo-75th-indonesia/01.webp",
      "/projects/logo-75th-indonesia/02.webp",
      "/projects/logo-75th-indonesia/03.webp",
      "/projects/logo-75th-indonesia/04.webp",
      "/projects/logo-75th-indonesia/05.webp",
      "/projects/logo-75th-indonesia/06.webp",
      "/projects/logo-75th-indonesia/07.webp",
      "/projects/logo-75th-indonesia/08.webp",
      "/projects/logo-75th-indonesia/09.webp",
      "/projects/logo-75th-indonesia/10.webp",
      "/projects/logo-75th-indonesia/11.webp",
      "/projects/logo-75th-indonesia/12.webp",
      "/projects/logo-75th-indonesia/13.webp",
      "/projects/logo-75th-indonesia/14.webp",
      "/projects/logo-75th-indonesia/15.webp",
    ],
    featured: false,
    priority: 88,
    tags: ["national", "government", "identity", "campaign"],
  },

  // ── 08 — Ayam Goreng Nelongso ─────────────────────────────────────────────
  {
    slug: "ayam-goreng-nelongso",
    title: "Ayam Goreng Nelongso",
    client: "PT. Nelongso Sukses Mandiri",
    year: "2021",
    category: "F&B Franchise Identity System",
    industry: "fnb",
    disciplines: ["identity", "packaging", "outdoor"],
    shortDescription:
      "Sistem identitas visual komprehensif waralaba kuliner nasional Ayam Goreng Nelongso.",
    description:
      "Graphic Standard Manual Ayam Goreng Nelongso — merancang sistem standarisasi logo, maskot, signage outlet, packaging, dan materi promosi untuk ekspansi franchise nasional.",
    excerpt: "Sistem identitas visual komprehensif waralaba kuliner nasional Ayam Goreng Nelongso.",
    coverImage: "/projects/ayam-goreng-nelongso/cover.webp",
    heroImage: "/projects/ayam-goreng-nelongso/cover.webp",
    hoverImage: "/projects/ayam-goreng-nelongso/06.webp",
    galleryImages: [
      "/projects/ayam-goreng-nelongso/01.webp",
      "/projects/ayam-goreng-nelongso/02.webp",
      "/projects/ayam-goreng-nelongso/03.webp",
      "/projects/ayam-goreng-nelongso/04.webp",
      "/projects/ayam-goreng-nelongso/05.webp",
      "/projects/ayam-goreng-nelongso/06.webp",
      "/projects/ayam-goreng-nelongso/07.webp",
      "/projects/ayam-goreng-nelongso/08.webp",
      "/projects/ayam-goreng-nelongso/09.webp",
      "/projects/ayam-goreng-nelongso/10.webp",
      "/projects/ayam-goreng-nelongso/11.webp",
      "/projects/ayam-goreng-nelongso/12.webp",
      "/projects/ayam-goreng-nelongso/13.webp",
      "/projects/ayam-goreng-nelongso/14.webp",
    ],
    featured: false,
    priority: 87,
    tags: ["fnb", "culinary", "identity", "franchise"],
  },

  // ── 09 — KONAS 2021 ───────────────────────────────────────────────────────
  {
    slug: "konas-2021",
    title: "KONAS 2021",
    client: "Panitia KONAS 2021",
    year: "2021",
    category: "Event Identity & Environmental System",
    industry: "event",
    disciplines: ["identity", "print", "indoor", "outdoor"],
    shortDescription:
      "Identitas visual Konferensi Nasional (KONAS) 2021 — sistem grafis komprehensif perhelatan akbar.",
    description:
      "GSM KONAS 2021 merancang seluruh ekosistem visual konferensi nasional, dari logo konvensi, backdrop panggung, signage venue, merchandise, hingga materi publikasi.",
    excerpt: "Identitas visual Konferensi Nasional (KONAS) 2021 — sistem grafis komprehensif perhelatan akbar.",
    coverImage: "/projects/konas-2021/cover.webp",
    heroImage: "/projects/konas-2021/cover.webp",
    hoverImage: "/projects/konas-2021/15.webp",
    galleryImages: [
      "/projects/konas-2021/01.webp",
      "/projects/konas-2021/02.webp",
      "/projects/konas-2021/03.webp",
      "/projects/konas-2021/04.webp",
      "/projects/konas-2021/05.webp",
      "/projects/konas-2021/06.webp",
      "/projects/konas-2021/07.webp",
      "/projects/konas-2021/08.webp",
      "/projects/konas-2021/09.webp",
      "/projects/konas-2021/10.webp",
      "/projects/konas-2021/11.webp",
      "/projects/konas-2021/12.webp",
      "/projects/konas-2021/13.webp",
      "/projects/konas-2021/14.webp",
      "/projects/konas-2021/15.webp",
    ],
    featured: false,
    priority: 86,
    tags: ["event", "conference", "identity", "branding"],
  },

  // ── 10 — SFI Suzuki Finance ───────────────────────────────────────────────
  {
    slug: "sfi",
    title: "SFI Suzuki Finance",
    client: "PT. Suzuki Finance Indonesia",
    year: "2022",
    category: "Corporate Brand Identity & System",
    industry: "corporate",
    disciplines: ["identity", "print"],
    shortDescription:
      "Pedoman identitas brand SFI — sistem visual korporasi pembiayaan nasional.",
    description:
      "Pedoman identitas brand SFI yang mencakup sistem visual korporasi komprehensif dari standarisasi logo hingga aplikasi media komunikasi.",
    excerpt: "Pedoman identitas brand SFI — sistem visual korporasi pembiayaan nasional.",
    coverImage: "/projects/sfi/cover.webp",
    heroImage: "/projects/sfi/cover.webp",
    hoverImage: "/projects/sfi/13.webp",
    galleryImages: [
      "/projects/sfi/01.webp",
      "/projects/sfi/02.webp",
      "/projects/sfi/03.webp",
      "/projects/sfi/04.webp",
      "/projects/sfi/05.webp",
      "/projects/sfi/06.webp",
      "/projects/sfi/07.webp",
      "/projects/sfi/08.webp",
      "/projects/sfi/09.webp",
      "/projects/sfi/10.webp",
      "/projects/sfi/11.webp",
      "/projects/sfi/12.webp",
      "/projects/sfi/13.webp",
      "/projects/sfi/14.webp",
      "/projects/sfi/15.webp",
    ],
    featured: false,
    priority: 85,
    tags: ["identity", "corporate", "gsm"],
  },

  // ── 11 — Wajan Giok ───────────────────────────────────────────────────────
  {
    slug: "wajan-giok",
    title: "Wajan Giok",
    client: "Wajan Giok",
    year: "2023",
    category: "F&B Brand Identity & Visual Guideline",
    industry: "fnb",
    disciplines: ["identity", "packaging", "print"],
    shortDescription:
      "Pedoman identitas brand kuliner Wajan Giok — sistem visual F&B yang kuat.",
    description:
      "Pedoman identitas visual brand kuliner Wajan Giok, mencakup standarisasi logo, sistem warna, tipografi, kemasan, dan aplikasi media promosi.",
    excerpt: "Pedoman identitas brand kuliner Wajan Giok — sistem visual F&B yang kuat.",
    coverImage: "/projects/wajan-giok/cover.webp",
    heroImage: "/projects/wajan-giok/cover.webp",
    hoverImage: "/projects/wajan-giok/13.webp",
    galleryImages: [
      "/projects/wajan-giok/01.webp",
      "/projects/wajan-giok/02.webp",
      "/projects/wajan-giok/03.webp",
      "/projects/wajan-giok/04.webp",
      "/projects/wajan-giok/05.webp",
      "/projects/wajan-giok/06.webp",
      "/projects/wajan-giok/07.webp",
      "/projects/wajan-giok/08.webp",
      "/projects/wajan-giok/09.webp",
      "/projects/wajan-giok/10.webp",
      "/projects/wajan-giok/11.webp",
      "/projects/wajan-giok/12.webp",
      "/projects/wajan-giok/13.webp",
      "/projects/wajan-giok/14.webp",
      "/projects/wajan-giok/15.webp",
    ],
    featured: false,
    priority: 84,
    tags: ["fnb", "identity", "packaging", "gsm"],
  },

  // ── 12 — BPR Tulungagung ──────────────────────────────────────────────────
  {
    slug: "bpr-tulungagung",
    title: "BPR Tulungagung",
    client: "BPR Tulungagung",
    year: "2021",
    category: "Brand Identity & Visual Guideline",
    industry: "corporate",
    disciplines: ["identity", "print"],
    shortDescription:
      "Pedoman identitas visual Bank Perkreditan Rakyat Tulungagung.",
    description:
      "Pedoman identitas visual Bank Perkreditan Rakyat (BPR) Tulungagung — mencakup standarisasi logo, warna, tipografi, dan aplikasi media komunikasi resmi.",
    excerpt: "Pedoman identitas visual Bank Perkreditan Rakyat Tulungagung.",
    coverImage: "/projects/bpr-tulungagung/cover.webp",
    heroImage: "/projects/bpr-tulungagung/cover.webp",
    hoverImage: "/projects/bpr-tulungagung/02.webp",
    galleryImages: [
      "/projects/bpr-tulungagung/01.webp",
      "/projects/bpr-tulungagung/02.webp",
      "/projects/bpr-tulungagung/03.webp",
      "/projects/bpr-tulungagung/04.webp",
      "/projects/bpr-tulungagung/05.webp",
      "/projects/bpr-tulungagung/06.webp",
      "/projects/bpr-tulungagung/07.webp",
      "/projects/bpr-tulungagung/08.webp",
      "/projects/bpr-tulungagung/09.webp",
      "/projects/bpr-tulungagung/10.webp",
      "/projects/bpr-tulungagung/11.webp",
      "/projects/bpr-tulungagung/12.webp",
      "/projects/bpr-tulungagung/13.webp",
    ],
    featured: false,
    priority: 83,
    tags: ["banking", "identity", "gsm"],
  },

  // ── 13 — BPR Artha Kanjuruhan ─────────────────────────────────────────────
  {
    slug: "bpr-artha-kanjuruhan",
    title: "BPR Artha Kanjuruhan",
    client: "BPR Artha Kanjuruhan Pemkab Malang",
    year: "2022",
    category: "Banking Identity & Financial Signage",
    industry: "corporate",
    disciplines: ["identity", "print", "outdoor"],
    shortDescription:
      "Pedoman identitas visual Bank Perkreditan Rakyat Artha Kanjuruhan.",
    description:
      "Standarisasi identitas visual perbankan daerah BPR Artha Kanjuruhan mencakup logo, pedoman warna korporasi, aplikasi stasioneri perbankan, dan signage kantor cabang.",
    excerpt: "Pedoman identitas visual Bank Perkreditan Rakyat Artha Kanjuruhan.",
    coverImage: "/projects/bpr-artha-kanjuruhan/cover.webp",
    heroImage: "/projects/bpr-artha-kanjuruhan/cover.webp",
    hoverImage: "/projects/bpr-artha-kanjuruhan/02.webp",
    galleryImages: [
      "/projects/bpr-artha-kanjuruhan/01.webp",
      "/projects/bpr-artha-kanjuruhan/02.webp",
      "/projects/bpr-artha-kanjuruhan/03.webp",
      "/projects/bpr-artha-kanjuruhan/04.webp",
      "/projects/bpr-artha-kanjuruhan/05.webp",
      "/projects/bpr-artha-kanjuruhan/06.webp",
      "/projects/bpr-artha-kanjuruhan/07.webp",
      "/projects/bpr-artha-kanjuruhan/08.webp",
      "/projects/bpr-artha-kanjuruhan/09.webp",
      "/projects/bpr-artha-kanjuruhan/10.webp",
      "/projects/bpr-artha-kanjuruhan/11.webp",
      "/projects/bpr-artha-kanjuruhan/12.webp",
      "/projects/bpr-artha-kanjuruhan/13.webp",
      "/projects/bpr-artha-kanjuruhan/14.webp",
      "/projects/bpr-artha-kanjuruhan/15.webp",
    ],
    featured: false,
    priority: 82,
    tags: ["banking", "corporate", "identity", "gsm"],
  },

  // ── 14 — Baiturrohman ─────────────────────────────────────────────────────
  {
    slug: "baiturrohman",
    title: "Baiturrohman",
    client: "Yayasan Baiturrohman",
    year: "2021",
    category: "Institutional Visual Guideline",
    industry: "government",
    disciplines: ["identity", "print"],
    shortDescription:
      "Pedoman identitas visual institusi Baiturrohman.",
    description:
      "Pedoman identitas visual institusi Baiturrohman — standarisasi logo, warna, tipografi, dan panduan penggunaan identitas resmi.",
    excerpt: "Pedoman identitas visual institusi Baiturrohman.",
    coverImage: "/projects/baiturrohman/cover.webp",
    heroImage: "/projects/baiturrohman/cover.webp",
    hoverImage: "/projects/baiturrohman/15.webp",
    galleryImages: [
      "/projects/baiturrohman/01.webp",
      "/projects/baiturrohman/02.webp",
      "/projects/baiturrohman/03.webp",
      "/projects/baiturrohman/04.webp",
      "/projects/baiturrohman/05.webp",
      "/projects/baiturrohman/06.webp",
      "/projects/baiturrohman/07.webp",
      "/projects/baiturrohman/08.webp",
      "/projects/baiturrohman/09.webp",
      "/projects/baiturrohman/10.webp",
      "/projects/baiturrohman/11.webp",
      "/projects/baiturrohman/12.webp",
      "/projects/baiturrohman/13.webp",
      "/projects/baiturrohman/14.webp",
      "/projects/baiturrohman/15.webp",
    ],
    featured: false,
    priority: 81,
    tags: ["institutional", "identity", "visual-guideline"],
  },

  // ── 15 — JMT Logistics ────────────────────────────────────────────────────
  {
    slug: "jmt",
    title: "JMT Logistics",
    client: "PT. Jatim Mustika Transport",
    year: "2022",
    category: "Logistics Brand Identity & Fleet Livery",
    industry: "services",
    disciplines: ["identity", "outdoor", "print"],
    shortDescription:
      "Visual guideline korporasi transportasi dan logistik PT. Jatim Mustika Transport.",
    description:
      "Pedoman visual komprehensif JMT mencakup logo korporat, sistem stasioneri bisnis, seragam staf operasional, dan desain livery armada truk kontainer pengiriman.",
    excerpt: "Visual guideline korporasi transportasi dan logistik PT. Jatim Mustika Transport.",
    coverImage: "/projects/jmt/cover.webp",
    heroImage: "/projects/jmt/cover.webp",
    hoverImage: "/projects/jmt/03.webp",
    galleryImages: [
      "/projects/jmt/01.webp",
      "/projects/jmt/02.webp",
      "/projects/jmt/03.webp",
      "/projects/jmt/04.webp",
      "/projects/jmt/05.webp",
      "/projects/jmt/06.webp",
      "/projects/jmt/07.webp",
      "/projects/jmt/08.webp",
      "/projects/jmt/09.webp",
      "/projects/jmt/10.webp",
      "/projects/jmt/11.webp",
      "/projects/jmt/12.webp",
      "/projects/jmt/13.webp",
      "/projects/jmt/14.webp",
      "/projects/jmt/15.webp",
    ],
    featured: false,
    priority: 75,
    tags: ["logistics", "fleet", "transport", "identity"],
  },

  // ── 16 — Lacamino Footwear ────────────────────────────────────────────────
  {
    slug: "lacamino",
    title: "Lacamino Footwear",
    client: "Lacamino Shoes & Leather",
    year: "2023",
    category: "Lifestyle Fashion Identity & Packaging",
    industry: "retail",
    disciplines: ["identity", "packaging", "digital"],
    shortDescription:
      "Visual guideline brand sepatu kulit dan apparel Lacamino.",
    description:
      "Pedoman visual identitas brand sepatu Lacamino — logo monogram artisanal, sistem packaging kotak sepatu premium, hangtag produk, dan materi lookbook digital.",
    excerpt: "Visual guideline brand sepatu kulit dan apparel Lacamino.",
    coverImage: "/projects/lacamino/cover.webp",
    heroImage: "/projects/lacamino/cover.webp",
    hoverImage: "/projects/lacamino/15.webp",
    galleryImages: [
      "/projects/lacamino/01.webp",
      "/projects/lacamino/02.webp",
      "/projects/lacamino/03.webp",
      "/projects/lacamino/04.webp",
      "/projects/lacamino/05.webp",
      "/projects/lacamino/06.webp",
      "/projects/lacamino/07.webp",
      "/projects/lacamino/08.webp",
      "/projects/lacamino/09.webp",
      "/projects/lacamino/10.webp",
      "/projects/lacamino/11.webp",
      "/projects/lacamino/12.webp",
      "/projects/lacamino/13.webp",
      "/projects/lacamino/14.webp",
      "/projects/lacamino/15.webp",
    ],
    featured: false,
    priority: 74,
    tags: ["fashion", "footwear", "retail", "identity"],
  },

  // ── 17 — Techlink Solusindo ───────────────────────────────────────────────
  {
    slug: "techlink",
    title: "Techlink Solusindo",
    client: "PT. Techlink Solusindo",
    year: "2023",
    category: "Tech Infrastructure Identity & Corporate Kit",
    industry: "services",
    disciplines: ["identity", "digital", "print"],
    shortDescription:
      "Visual guideline korporasi solusi teknologi jaringan Techlink.",
    description:
      "Pedoman identitas visual PT. Techlink Solusindo — logo modern berorientasi masa depan, company profile korporat, kartu nama eksekutif, dan panduan presentasi klien.",
    excerpt: "Visual guideline korporasi solusi teknologi jaringan Techlink.",
    coverImage: "/projects/techlink/cover.webp",
    heroImage: "/projects/techlink/cover.webp",
    hoverImage: "/projects/techlink/07.webp",
    galleryImages: [
      "/projects/techlink/01.webp",
      "/projects/techlink/02.webp",
      "/projects/techlink/03.webp",
      "/projects/techlink/04.webp",
      "/projects/techlink/05.webp",
      "/projects/techlink/06.webp",
      "/projects/techlink/07.webp",
      "/projects/techlink/08.webp",
      "/projects/techlink/09.webp",
      "/projects/techlink/10.webp",
      "/projects/techlink/11.webp",
      "/projects/techlink/12.webp",
      "/projects/techlink/13.webp",
      "/projects/techlink/14.webp",
    ],
    featured: false,
    priority: 73,
    tags: ["tech", "corporate", "identity", "digital"],
  },

  // ── 18 — Proxon Lubricants ────────────────────────────────────────────────
  {
    slug: "proxon",
    title: "Proxon Lubricants",
    client: "PT. Proxon Daya Pratama",
    year: "2023",
    category: "Industrial Brand Identity & Product Labeling",
    industry: "products",
    disciplines: ["identity", "packaging", "outdoor"],
    shortDescription:
      "Visual guideline brand pelumas industri dan otomotif Proxon.",
    description:
      "Pedoman identitas visual pelumas Proxon — standarisasi logo berkekuatan tinggi, desain kemasan drum dan botol oli, serta materi spanduk bengkel rekanan.",
    excerpt: "Visual guideline brand pelumas industri dan otomotif Proxon.",
    coverImage: "/projects/proxon/cover.webp",
    heroImage: "/projects/proxon/cover.webp",
    hoverImage: "/projects/proxon/07.webp",
    galleryImages: [
      "/projects/proxon/01.webp",
      "/projects/proxon/02.webp",
      "/projects/proxon/03.webp",
      "/projects/proxon/04.webp",
      "/projects/proxon/05.webp",
      "/projects/proxon/06.webp",
      "/projects/proxon/07.webp",
      "/projects/proxon/08.webp",
      "/projects/proxon/09.webp",
      "/projects/proxon/10.webp",
      "/projects/proxon/11.webp",
      "/projects/proxon/12.webp",
      "/projects/proxon/13.webp",
      "/projects/proxon/14.webp",
    ],
    featured: false,
    priority: 72,
    tags: ["automotive", "industrial", "packaging", "identity"],
  },

  // ── 19 — Kiyona Beauty ────────────────────────────────────────────────────
  {
    slug: "kiyona",
    title: "Kiyona Beauty",
    client: "Kiyona Skincare Indonesia",
    year: "2023",
    category: "Beauty & Skincare Brand Identity",
    industry: "retail",
    disciplines: ["identity", "packaging"],
    shortDescription:
      "Mini GSM identitas visual brand kecantikan dan skincare Kiyona.",
    description:
      "Pedoman identitas visual elegan dan bersih untuk brand skincare Kiyona — desain logo lembut, palet warna pastel mewah, dan panduan kemasan botol kosmetik.",
    excerpt: "Mini GSM identitas visual brand kecantikan dan skincare Kiyona.",
    coverImage: "/projects/kiyona/cover.webp",
    heroImage: "/projects/kiyona/cover.webp",
    hoverImage: "/projects/kiyona/10.webp",
    galleryImages: [
      "/projects/kiyona/01.webp",
      "/projects/kiyona/02.webp",
      "/projects/kiyona/03.webp",
      "/projects/kiyona/04.webp",
      "/projects/kiyona/05.webp",
      "/projects/kiyona/06.webp",
      "/projects/kiyona/07.webp",
      "/projects/kiyona/08.webp",
      "/projects/kiyona/09.webp",
      "/projects/kiyona/10.webp",
      "/projects/kiyona/11.webp",
      "/projects/kiyona/12.webp",
      "/projects/kiyona/13.webp",
      "/projects/kiyona/14.webp",
      "/projects/kiyona/15.webp",
    ],
    featured: false,
    priority: 71,
    tags: ["beauty", "cosmetics", "skincare", "identity"],
  },

  // ── 20 — Universitas Widyagama ────────────────────────────────────────────
  {
    slug: "uwg",
    title: "Universitas Widyagama",
    client: "Universitas Widyagama Malang",
    year: "2021",
    category: "Higher Education Identity & Campus System",
    industry: "education",
    disciplines: ["identity", "print", "outdoor"],
    shortDescription:
      "Graphic Standard Manual identitas visual Universitas Widyagama (UWG) Malang.",
    description:
      "Sistem standarisasi identitas visual institusi perguruan tinggi UWG Malang, meliputi tata kelola logo universitas dan fakultas, seragam almamater, umbul-umbul kampus, dan media promosi penerimaan mahasiswa.",
    excerpt: "Graphic Standard Manual identitas visual Universitas Widyagama (UWG) Malang.",
    coverImage: "/projects/uwg/cover.webp",
    heroImage: "/projects/uwg/cover.webp",
    hoverImage: "/projects/uwg/02.webp",
    galleryImages: [
      "/projects/uwg/01.webp",
      "/projects/uwg/02.webp",
      "/projects/uwg/03.webp",
      "/projects/uwg/04.webp",
      "/projects/uwg/05.webp",
      "/projects/uwg/06.webp",
      "/projects/uwg/07.webp",
      "/projects/uwg/08.webp",
      "/projects/uwg/09.webp",
      "/projects/uwg/10.webp",
      "/projects/uwg/11.webp",
      "/projects/uwg/12.webp",
      "/projects/uwg/13.webp",
    ],
    featured: false,
    priority: 70,
    tags: ["education", "campus", "university", "identity"],
  },

  // ── 21 — Kopi Rohani ──────────────────────────────────────────────────────
  {
    slug: "rohani",
    title: "Kopi Rohani",
    client: "Rohani Coffee & Roastery",
    year: "2022",
    category: "Heritage Coffee Identity & Packaging",
    industry: "fnb",
    disciplines: ["identity", "packaging", "print"],
    shortDescription:
      "Identitas visual dan kemasan produk kopi heritage Rohani.",
    description:
      "Pedoman identitas visual Kopi Rohani — menggabungkan warisan tradisional dengan sentuhan desain modern pada kemasan kopi, label, dan materi branding gerai.",
    excerpt: "Identitas visual dan kemasan produk kopi heritage Rohani.",
    coverImage: "/projects/rohani/cover.webp",
    heroImage: "/projects/rohani/cover.webp",
    hoverImage: "/projects/rohani/05.webp",
    galleryImages: [
      "/projects/rohani/01.webp",
      "/projects/rohani/02.webp",
      "/projects/rohani/03.webp",
      "/projects/rohani/04.webp",
      "/projects/rohani/05.webp",
      "/projects/rohani/06.webp",
      "/projects/rohani/07.webp",
      "/projects/rohani/08.webp",
      "/projects/rohani/09.webp",
      "/projects/rohani/10.webp",
      "/projects/rohani/11.webp",
      "/projects/rohani/12.webp",
      "/projects/rohani/13.webp",
    ],
    featured: false,
    priority: 69,
    tags: ["fnb", "coffee", "packaging", "identity"],
  },

  // ── 22 — PSHT 1922 Satu Abad ──────────────────────────────────────────────
  {
    slug: "gsm-1922",
    title: "PSHT 1922 Satu Abad",
    client: "Persaudaraan Setia Hati Terate",
    year: "2022",
    category: "Heritage Anniversary Identity System",
    industry: "arts",
    disciplines: ["identity", "print", "campaign"],
    shortDescription:
      "Graphic Standard Manual identitas visual peringatan satu abad PSHT 1922.",
    description:
      "Sistem pedoman visual peringatan 100 tahun (1922–2022) PSHT — mencakup standarisasi lambang kehormatan, tipografi resmi, palet warna, dan aplikasi pada media panji serta publikasi akbar.",
    excerpt: "Graphic Standard Manual identitas visual peringatan satu abad PSHT 1922.",
    coverImage: "/projects/gsm-1922/cover.webp",
    heroImage: "/projects/gsm-1922/cover.webp",
    hoverImage: "/projects/gsm-1922/13.webp",
    galleryImages: [
      "/projects/gsm-1922/01.webp",
      "/projects/gsm-1922/02.webp",
      "/projects/gsm-1922/03.webp",
      "/projects/gsm-1922/04.webp",
      "/projects/gsm-1922/05.webp",
      "/projects/gsm-1922/06.webp",
      "/projects/gsm-1922/07.webp",
      "/projects/gsm-1922/08.webp",
      "/projects/gsm-1922/09.webp",
      "/projects/gsm-1922/10.webp",
      "/projects/gsm-1922/11.webp",
      "/projects/gsm-1922/12.webp",
      "/projects/gsm-1922/13.webp",
    ],
    featured: false,
    priority: 68,
    tags: ["heritage", "culture", "identity", "gsm"],
  },

  // ── 23 — Momsarasa ────────────────────────────────────────────────────────
  {
    slug: "momsarasa",
    title: "Momsarasa",
    client: "Momsarasa Culinary Seasoning",
    year: "2022",
    category: "Culinary Seasoning & Packaging System",
    industry: "fnb",
    disciplines: ["identity", "packaging"],
    shortDescription:
      "Graphic Standard Manual kemasan dan identitas produk bumbu dapur Momsarasa.",
    description:
      "Standarisasi identitas brand Momsarasa mencakup desain label kemasan pouch bumbu dapur, palet warna menggugah selera, dan materi display supermarket.",
    excerpt: "Graphic Standard Manual kemasan dan identitas produk bumbu dapur Momsarasa.",
    coverImage: "/projects/momsarasa/cover.webp",
    heroImage: "/projects/momsarasa/cover.webp",
    hoverImage: "/projects/momsarasa/02.webp",
    galleryImages: [
      "/projects/momsarasa/01.webp",
      "/projects/momsarasa/02.webp",
      "/projects/momsarasa/03.webp",
      "/projects/momsarasa/04.webp",
      "/projects/momsarasa/05.webp",
      "/projects/momsarasa/06.webp",
      "/projects/momsarasa/07.webp",
      "/projects/momsarasa/08.webp",
      "/projects/momsarasa/09.webp",
      "/projects/momsarasa/10.webp",
      "/projects/momsarasa/11.webp",
      "/projects/momsarasa/12.webp",
      "/projects/momsarasa/13.webp",
    ],
    featured: false,
    priority: 67,
    tags: ["fnb", "culinary", "packaging", "identity"],
  },

  // ── 24 — Yin Yam ──────────────────────────────────────────────────────────
  {
    slug: "yin-yam",
    title: "Yin Yam",
    client: "Yin Yam Street Bites",
    year: "2022",
    category: "Street Food Identity & Packaging Mini GSM",
    industry: "fnb",
    disciplines: ["identity", "packaging"],
    shortDescription:
      "Mini graphic standard manual brand street food Yin Yam.",
    description:
      "Mini GSM brand jajanan Yin Yam mencakup karakter logo jenaka, kemasan paper bag ramah lingkungan, stiker segel makanan, dan panduan materi promosi gerobak.",
    excerpt: "Mini graphic standard manual brand street food Yin Yam.",
    coverImage: "/projects/yin-yam/cover.webp",
    heroImage: "/projects/yin-yam/cover.webp",
    hoverImage: "/projects/yin-yam/07.webp",
    galleryImages: [
      "/projects/yin-yam/01.webp",
      "/projects/yin-yam/02.webp",
      "/projects/yin-yam/03.webp",
      "/projects/yin-yam/04.webp",
      "/projects/yin-yam/05.webp",
      "/projects/yin-yam/06.webp",
      "/projects/yin-yam/07.webp",
      "/projects/yin-yam/08.webp",
      "/projects/yin-yam/09.webp",
      "/projects/yin-yam/10.webp",
      "/projects/yin-yam/11.webp",
      "/projects/yin-yam/12.webp",
      "/projects/yin-yam/13.webp",
    ],
    featured: false,
    priority: 66,
    tags: ["fnb", "street-food", "packaging", "mini-gsm"],
  },

  // ── 25 — COS PLENG ────────────────────────────────────────────────────────
  {
    slug: "cos-pleng",
    title: "COS PLENG",
    client: "COS PLENG Beverage",
    year: "2022",
    category: "Beverage Brand Identity & Mini GSM",
    industry: "fnb",
    disciplines: ["identity", "packaging"],
    shortDescription:
      "Pedoman identitas brand minuman COS PLENG — karakter bold & energik.",
    description:
      "Mini Graphic Standard Manual COS PLENG mencakup panduan logo, palet warna, tipografi, dan kemasan produk minuman.",
    excerpt: "Pedoman identitas brand minuman COS PLENG — karakter bold & energik.",
    coverImage: "/projects/cos-pleng/cover.webp",
    heroImage: "/projects/cos-pleng/cover.webp",
    hoverImage: "/projects/cos-pleng/01.webp",
    galleryImages: [
      "/projects/cos-pleng/01.webp",
      "/projects/cos-pleng/02.webp",
      "/projects/cos-pleng/03.webp",
      "/projects/cos-pleng/04.webp",
      "/projects/cos-pleng/05.webp",
      "/projects/cos-pleng/06.webp",
      "/projects/cos-pleng/07.webp",
      "/projects/cos-pleng/08.webp",
      "/projects/cos-pleng/09.webp",
      "/projects/cos-pleng/10.webp",
      "/projects/cos-pleng/11.webp",
      "/projects/cos-pleng/12.webp",
    ],
    featured: false,
    priority: 65,
    tags: ["fnb", "beverage", "identity", "packaging"],
  },

  // ── 26 — Boop Pet Care ────────────────────────────────────────────────────
  {
    slug: "boop",
    title: "Boop Pet Care",
    client: "Boop",
    year: "2023",
    category: "Retail Identity & Mini GSM",
    industry: "retail",
    disciplines: ["identity", "print"],
    shortDescription:
      "Mini GSM identitas brand Boop — panduan visual ringkas dan aplikatif.",
    description:
      "Mini GSM untuk brand Boop, memuat pedoman logo, warna brand, dan aplikasi identitas visual dasar.",
    excerpt: "Mini GSM identitas brand Boop — panduan visual ringkas dan aplikatif.",
    coverImage: "/projects/boop/cover.webp",
    heroImage: "/projects/boop/cover.webp",
    hoverImage: "/projects/boop/02.webp",
    galleryImages: [
      "/projects/boop/01.webp",
      "/projects/boop/02.webp",
      "/projects/boop/03.webp",
      "/projects/boop/04.webp",
      "/projects/boop/05.webp",
      "/projects/boop/06.webp",
      "/projects/boop/07.webp",
      "/projects/boop/08.webp",
      "/projects/boop/09.webp",
      "/projects/boop/10.webp",
      "/projects/boop/11.webp",
    ],
    featured: false,
    priority: 64,
    tags: ["retail", "identity", "mini-gsm"],
  },

  // ── 27 — Maitri Wellness ──────────────────────────────────────────────────
  {
    slug: "maitri",
    title: "Maitri Wellness",
    client: "Maitri Natural Herbal",
    year: "2022",
    category: "Wellness & Health Brand Identity",
    industry: "products",
    disciplines: ["identity", "packaging", "print"],
    shortDescription:
      "Pedoman identitas visual brand kesehatan holistik Maitri.",
    description:
      "Visual guideline produk kesehatan alami Maitri — standarisasi logo, kemasan botol herbal, palet warna organik, dan materi informasi khasiat produk.",
    excerpt: "Pedoman identitas visual brand kesehatan holistik Maitri.",
    coverImage: "/projects/maitri/cover.webp",
    heroImage: "/projects/maitri/cover.webp",
    hoverImage: "/projects/maitri/05.webp",
    galleryImages: [
      "/projects/maitri/01.webp",
      "/projects/maitri/02.webp",
      "/projects/maitri/03.webp",
      "/projects/maitri/04.webp",
      "/projects/maitri/05.webp",
      "/projects/maitri/06.webp",
      "/projects/maitri/07.webp",
      "/projects/maitri/08.webp",
      "/projects/maitri/09.webp",
      "/projects/maitri/10.webp",
      "/projects/maitri/11.webp",
    ],
    featured: false,
    priority: 63,
    tags: ["wellness", "health", "packaging", "identity"],
  },

  // ── 28 — Satu Titik Coffee ────────────────────────────────────────────────
  {
    slug: "satu-titik",
    title: "Satu Titik Coffee",
    client: "Satu Titik Coffee & Eatery",
    year: "2022",
    category: "Lifestyle Hospitality Brand Identity",
    industry: "fnb",
    disciplines: ["identity", "indoor", "outdoor"],
    shortDescription:
      "Mini GSM identitas visual Satu Titik Coffee & Space.",
    description:
      "Pedoman visual ringkas Satu Titik Coffee — merancang logo minimalis, elemen visual ruang cafe, packaging take-away cup, dan signage penanda gerai.",
    excerpt: "Mini GSM identitas visual Satu Titik Coffee & Space.",
    coverImage: "/projects/satu-titik/cover.webp",
    heroImage: "/projects/satu-titik/cover.webp",
    hoverImage: "/projects/satu-titik/04.webp",
    galleryImages: [
      "/projects/satu-titik/01.webp",
      "/projects/satu-titik/02.webp",
      "/projects/satu-titik/03.webp",
      "/projects/satu-titik/04.webp",
      "/projects/satu-titik/05.webp",
      "/projects/satu-titik/06.webp",
      "/projects/satu-titik/07.webp",
      "/projects/satu-titik/08.webp",
      "/projects/satu-titik/09.webp",
      "/projects/satu-titik/10.webp",
      "/projects/satu-titik/11.webp",
    ],
    featured: false,
    priority: 62,
    tags: ["fnb", "coffee", "hospitality", "identity"],
  },

  // ── 29 — Amarta Wisesa ────────────────────────────────────────────────────
  {
    slug: "amarta-wisesa",
    title: "Amarta Wisesa",
    client: "PT. Amarta Wisesa",
    year: "2021",
    category: "Corporate Brand Identity & System",
    industry: "corporate",
    disciplines: ["identity", "print"],
    shortDescription:
      "Graphic Standard Manual identitas korporasi Amarta Wisesa.",
    description:
      "Pedoman identitas visual korporasi Amarta Wisesa, standarisasi konfigurasi logo, warna brand, dan aplikasi stasioneri korporat.",
    excerpt: "Graphic Standard Manual identitas korporasi Amarta Wisesa.",
    coverImage: "/projects/amarta-wisesa/cover.webp",
    heroImage: "/projects/amarta-wisesa/cover.webp",
    hoverImage: "/projects/amarta-wisesa/10.webp",
    galleryImages: [
      "/projects/amarta-wisesa/01.webp",
      "/projects/amarta-wisesa/02.webp",
      "/projects/amarta-wisesa/03.webp",
      "/projects/amarta-wisesa/04.webp",
      "/projects/amarta-wisesa/05.webp",
      "/projects/amarta-wisesa/06.webp",
      "/projects/amarta-wisesa/07.webp",
      "/projects/amarta-wisesa/08.webp",
      "/projects/amarta-wisesa/09.webp",
      "/projects/amarta-wisesa/10.webp",
    ],
    featured: false,
    priority: 50,
    tags: ["corporate", "identity", "gsm"],
  },

  // ── 30 — PLUT KUMKM ───────────────────────────────────────────────────────
  {
    slug: "plut-kumkm",
    title: "PLUT KUMKM",
    client: "Kementerian Koperasi & UKM / PLUT Jatim",
    year: "2021",
    category: "Public Sector Identity & Facility Signage",
    industry: "government",
    disciplines: ["identity", "print", "outdoor"],
    shortDescription:
      "Visual guideline Pusat Layanan Usaha Terpadu Koperasi dan UKM.",
    description:
      "Standarisasi visual fasilitas publik PLUT KUMKM untuk mendukung pemberdayaan wirausaha daerah — sistem signage gedung, media panduan, dan sarana pameran UKM.",
    excerpt: "Visual guideline Pusat Layanan Usaha Terpadu Koperasi dan UKM.",
    coverImage: "/projects/plut-kumkm/cover.webp",
    heroImage: "/projects/plut-kumkm/cover.webp",
    hoverImage: "/projects/plut-kumkm/04.webp",
    galleryImages: [
      "/projects/plut-kumkm/01.webp",
      "/projects/plut-kumkm/02.webp",
      "/projects/plut-kumkm/03.webp",
      "/projects/plut-kumkm/04.webp",
      "/projects/plut-kumkm/05.webp",
      "/projects/plut-kumkm/06.webp",
      "/projects/plut-kumkm/07.webp",
      "/projects/plut-kumkm/08.webp",
      "/projects/plut-kumkm/09.webp",
      "/projects/plut-kumkm/10.webp",
    ],
    featured: false,
    priority: 49,
    tags: ["government", "sme", "public-service", "identity"],
  },

  // ── 31 — Dailbana ─────────────────────────────────────────────────────────
  {
    slug: "dailbana",
    title: "Dailbana",
    client: "Dailbana Snack",
    year: "2022",
    category: "FMCG Brand Identity & Packaging",
    industry: "fnb",
    disciplines: ["identity", "packaging"],
    shortDescription:
      "Graphic Standard Manual identitas brand dan kemasan camilan Dailbana.",
    description:
      "Pedoman visual identitas brand Dailbana — standarisasi logo, kemasan snack modern, palet warna ceria, dan identitas visual produk.",
    excerpt: "Graphic Standard Manual identitas brand dan kemasan camilan Dailbana.",
    coverImage: "/projects/dailbana/cover.webp",
    heroImage: "/projects/dailbana/cover.webp",
    hoverImage: "/projects/dailbana/07.webp",
    galleryImages: [
      "/projects/dailbana/01.webp",
      "/projects/dailbana/02.webp",
      "/projects/dailbana/03.webp",
      "/projects/dailbana/04.webp",
      "/projects/dailbana/05.webp",
      "/projects/dailbana/06.webp",
      "/projects/dailbana/07.webp",
    ],
    featured: false,
    priority: 40,
    tags: ["fnb", "snack", "packaging", "identity"],
  },

  // ── 32 — Wismari ──────────────────────────────────────────────────────────
  {
    slug: "wismari",
    title: "Wismari",
    client: "Wismari Living & Property",
    year: "2019",
    category: "Property Brand Identity & Guideline",
    industry: "property",
    disciplines: ["identity", "print"],
    shortDescription:
      "Pedoman identitas visual hunian dan properti Wismari.",
    description:
      "Visual guideline brand properti Wismari — standarisasi logo arsitektural, brosur hunian eksklusif, dan penanda identitas kawasan.",
    excerpt: "Pedoman identitas visual hunian dan properti Wismari.",
    coverImage: "/projects/wismari/cover.webp",
    heroImage: "/projects/wismari/cover.webp",
    hoverImage: "/projects/wismari/05.webp",
    galleryImages: [
      "/projects/wismari/01.webp",
      "/projects/wismari/02.webp",
      "/projects/wismari/03.webp",
      "/projects/wismari/04.webp",
      "/projects/wismari/05.webp",
      "/projects/wismari/06.webp",
    ],
    featured: false,
    priority: 30,
    tags: ["property", "real-estate", "identity"],
  },
];


// ─────────────────────────────────────────────────────────────────────
// Query helpers
// ─────────────────────────────────────────────────────────────────────

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getFeaturedProjects(count = 4): Project[] {
  const featured = projects.filter((p) => p.featured);
  return featured.slice(0, count);
}

export function getProjectsByFilters(params: {
  filter?: string;        // WorkFilter value
  discipline?: string;    // Backwards-compat: direct Discipline key
  industry?: string;
}): Project[] {
  let filtered = [...projects];

  // Primary: WorkFilter-based filtering (new filter bar)
  if (params.filter && params.filter !== "all") {
    const disciplines = filterToDisciplines[params.filter as WorkFilter];
    if (disciplines) {
      filtered = filtered.filter((p) =>
        p.disciplines.some((d) => disciplines.includes(d))
      );
    }
  }

  // Backwards-compat: direct discipline param (old URL format)
  if (!params.filter && params.discipline && params.discipline !== "all") {
    filtered = filtered.filter((p) =>
      p.disciplines.includes(params.discipline as Discipline)
    );
  }

  if (params.industry && params.industry !== "all") {
    filtered = filtered.filter(
      (p) => p.industry === (params.industry as Industry)
    );
  }

  // Smart sort: always maintain priority order (highest first)
  filtered.sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));

  return filtered;
}

export function getAdjacentProjects(slug: string): {
  prev: Project | null;
  next: Project | null;
} {
  const index = projects.findIndex((p) => p.slug === slug);
  return {
    prev: index > 0 ? projects[index - 1] : null,
    next: index < projects.length - 1 ? projects[index + 1] : null,
  };
}

export function getAllSlugs(): string[] {
  return projects.map((p) => p.slug);
}

/** Returns a count of projects for each WorkFilter */
export function getFilterCounts(): Record<string, number> {
  const counts: Record<string, number> = { all: projects.length };

  const filters: Array<WorkFilter> = [
    "brand", "product", "promotion", "space", "digital", "indoor", "outdoor",
  ];

  for (const filter of filters) {
    const disciplines = filterToDisciplines[filter];
    if (disciplines) {
      counts[filter] = projects.filter((p) =>
        p.disciplines.some((d) => disciplines.includes(d))
      ).length;
    }
  }

  return counts;
}
