// ─────────────────────────────────────────────────────────────────────
// UTERO.ID — Project Data
// ─────────────────────────────────────────────────────────────────────
//
// HOW TO ADD A REAL PROJECT:
//   1. Add a new object to the `projects` array below.
//   2. Drop the cover image + gallery images into /public/projects/[slug]/
//   3. Update coverImage and galleryImages paths.
//   4. Set featured: true for the first ~4 most recent showcase works.
//   5. Optional video:
//      - YouTube: video: { type: "youtube", src: "https://www.youtube-nocookie.com/embed/VIDEO_ID" } (or full URL / ID)
//      - Local file: video: { type: "file", src: "/projects/[slug]/video.mp4" }
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
      "GaragePlug adalah platform cloud terintegrasi untuk manajemen bengkel mobil dan detailing center modern yang dipercaya lebih dari 5.000 pengguna global. Di Indonesia, Utero merancang sistem standarisasi identitas visual (GSM) komprehensif 76 halaman mencakup logogram generator daya, supergrafik turunan geometris, palet warna hijau tua (#003D2E) melambangkan pertumbuhan bisnis, panduan fotografi monokrom terfokus, sarana korporasi, seragam teknisi, signage totem pylon, hingga livery armada operasional.",
    excerpt:
      "Platform cloud terintegrasi untuk bengkel mobil dan detailing center, dilengkapi sistem pedoman identitas brand (GSM) komprehensif dari logo hingga armada transportasi.",
    coverImage: "/projects/garageplug/cover.webp",
    heroImage: "/projects/garageplug/cover.webp",
    hoverImage: "/projects/garageplug/07-page-26.webp",
    galleryImages: [
      "/projects/garageplug/02-page-10.webp",
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
    // Video field (optional):
    // YouTube example: video: { type: "youtube", src: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ" }
    // Local file example: video: { type: "file", src: "/projects/garageplug/video.mp4" }
    video: undefined,
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
        "Merancang sistem identitas visual berbasis simbol generator daya bertenaga dengan palet warna hijau tua (#003D2E) yang mencerminkan pertumbuhan bisnis dan presisi teknologi. Pedoman GSM mencakup aturan variasi logo vertikal/horizontal, supergrafik dinamis, panduan fotografi monokrom fokus obyek, seragam teknisi, dan standarisasi livery armada bergerak.",
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
    video: undefined,
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

  // ── 03 — Stamford Indonesia FC ────────────────────────────────────
  {
    slug: "stamford",
    title: "Stamford Indonesia FC",
    client: "Stamford Indonesia FC",
    year: "2023",
    category: "Football Academy Brand Identity & GSM",
    industry: "education",
    disciplines: ["identity", "print", "indoor", "outdoor"],
    shortDescription:
      "Pusat Pelatihan Sepakbola Terpadu (SIFC) untuk usia 6–19 tahun — re-branding berbasis panji Majapahit, komodo, dan semboyan \"Beyond Dreams\".",
    description:
      "STAMFORD INDONESIA FC (SIFC) adalah Pusat Pelatihan Sepakbola Terpadu yang menyajikan perpaduan antara pendidikan sepakbola standar internasional, pengembangan kepribadian, dan pendidikan formal untuk usia 6-19 tahun. Utero merancang re-branding menyeluruh yang mengadopsi panji 'Sang Saka Getih-Getah Samudra' Kerajaan Majapahit, simbol mata pedang terhunus kebawah lambang kebijaksanaan, motif bola Piala Dunia 1938 Hindia Belanda, dan hewan endemik Komodo sebagai representasi ketangguhan dan karakter mulia.",
    excerpt:
      "Pusat Pelatihan Sepakbola Terpadu (SIFC) untuk usia 6–19 tahun — re-branding berbasis panji Majapahit, komodo, dan semboyan \"Beyond Dreams\".",
    coverImage: "/projects/stamford/cover.webp",
    heroImage: "/projects/stamford/cover.webp",
    hoverImage: "/projects/stamford/07-page-08.webp",
    galleryImages: [
      "/projects/stamford/01-page-02.webp",
      "/projects/stamford/03-page-04.webp",
      "/projects/stamford/05-page-06.webp",
      "/projects/stamford/06-page-07.webp",
      "/projects/stamford/09-page-10.webp",
      "/projects/stamford/10-page-11.webp",
      "/projects/stamford/14-page-15.webp",
      "/projects/stamford/15-page-16.webp",
      "/projects/stamford/19-page-20.webp",
    ],
    video: undefined,
    featured: true,
    priority: 98,
    tags: ["sports", "academy", "football", "identity", "gsm"],
    details: {
      scope: [
        "Re-Branding & Positioning",
        "Sistem Logo & Elemen (Perisai, Komodo, Panji Majapahit)",
        "Graphic Standard Manual (GSM)",
        "Apparel & Jersey System",
        "Stationery & Merchandise",
        "Signage & Advertising Media",
        "Vehicle Livery",
      ],
      challenge:
        "Melakukan re-branding STAMFORD INDONESIA FC sebagai bentuk komitmen manajemen untuk meningkatkan standar pelayanan kepada calon siswa/siswi sekaligus publikasi kepada masyarakat luas, menanamkan nilai disiplin, etika, dan kebanggaan nasional kepada generasi muda usia 6–19 tahun.",
      solution:
        "Mengembangkan sistem identitas visual berlapis makna historis Nusantara: perisai lambang perjuangan, panji 'Sang Saka Getih-Getah Samudra' Kerajaan Majapahit, tiga bintang harmoni jiwa-raga-etika, mata pedang kebijaksanaan, mahkota kejayaan, dan komodo sebagai maskot, dengan palet merah (passion), putih (harmony), hitam (power), dan emas (success). Identitas diaplikasikan pada jersey tanding dan training kit, stasioneri, signage, media iklan, merchandise, hingga livery armada.",
      deliverables: [
        "Buku Pedoman Standar Grafis (GSM)",
        "Sistem Logo, Elemen & Maskot Komodo",
        "Jersey & Kit Apparel Lengkap",
        "Set Stationery & Merchandise",
        "Sistem Signage & Media Iklan",
        "Panduan Livery Kendaraan",
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
    video: undefined,
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
      "Visual Identity Guideline Bank Sidoarjo (BPR Delta Artha Perseroda) — sistem standarisasi identitas visual perbankan daerah yang modern, terpercaya, dan inklusif. Logo berbentuk lingkaran dinamis dengan perpaduan warna biru korporat dan kuning keemasan kemakmuran, dirancang untuk memperkuat ekuitas brand dan memastikan konsistensi komunikasi di seluruh kantor cabang, sarana ATM, dan media layanan nasabah.",
    excerpt: "Pedoman identitas visual Bank Sidoarjo — standarisasi brand perbankan daerah komprehensif.",
    coverImage: "/projects/bank-sidoarjo/cover.webp",
    heroImage: "/projects/bank-sidoarjo/cover.webp",
    hoverImage: "/projects/bank-sidoarjo/12.webp",
    galleryImages: [
      "/projects/bank-sidoarjo/04.webp",
      "/projects/bank-sidoarjo/08.webp",
      "/projects/bank-sidoarjo/09.webp",
      "/projects/bank-sidoarjo/10.webp",
      "/projects/bank-sidoarjo/11.webp",
      "/projects/bank-sidoarjo/12.webp",
      "/projects/bank-sidoarjo/13.webp",
      "/projects/bank-sidoarjo/14.webp",
    ],
    video: undefined,
    featured: false,
    priority: 90,
    tags: ["banking", "identity", "corporate", "gsm"],
    details: {
      scope: [
        "Brand Identity & Positioning",
        "Visual Standard Manual",
        "Corporate & Marketing Assets",
        "Packaging & Environmental Design",
      ],
      challenge:
        "Mentransformasi citra bank perkreditan rakyat daerah menjadi entitas keuangan modern yang profesional, kompetitif, dan mudah diakses oleh seluruh lapisan masyarakat dan pelaku UMKM.",
      solution:
        "Merancang pedoman identitas visual terpadu mencakup standarisasi logo lingkaran dinamis, palet warna kepercayaan finansial, sistem tipografi resmi, aplikasi buku tabungan, kartu ATM, signage kantor cabang, dan seragam layanan nasabah.",
      deliverables: [
        "Buku Pedoman Standar Identitas Visual",
        "Sistem Logo & Palet Warna Resmi",
        "Aplikasi Desain Kemasan & Promosi",
        "Standarisasi Material & Penerapan Media",
      ],
    }
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
      "Graphic Standard Manual Mie Gacoan — pedoman identitas visual jaringan restoran mie pedas nomor satu di Indonesia. Bentuk dasar lingkaran melambangkan filosofi kemajuan berkesinambungan yang dipadukan karakter logogram mie dinamis dan logotype tegas. Menggunakan kombinasi warna cyan ceria (#00B2D8) dan magenta berani (#EC008C) untuk menghadirkan atmosfer kuliner yang energetik, menyenangkan, dan relevan dengan generasi muda.",
    excerpt: "Graphic Standard Manual jaringan kuliner nomor 1 di Indonesia Mie Gacoan.",
    coverImage: "/projects/mie-gacoan/cover.webp",
    heroImage: "/projects/mie-gacoan/cover.webp",
    hoverImage: "/projects/mie-gacoan/15.webp",
    galleryImages: [
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
    video: undefined,
    featured: false,
    priority: 89,
    tags: ["fnb", "mie-gacoan", "culinary", "brand-identity"],
    details: {
      scope: [
        "Brand Identity & Positioning",
        "Visual Standard Manual",
        "Corporate & Marketing Assets",
        "Packaging & Environmental Design",
      ],
      challenge:
        "Menjaga konsistensi identitas visual brand kuliner yang berekspansi secara masif di ratusan gerai seluruh Indonesia dengan ribuan aset promosi cetak, digital, dan kemasan.",
      solution:
        "Merumuskan panduan GSM ketat untuk rasio logo, zona aman, kombinasi logogram dan logotype, standarisasi warna CMYK/RGB/HEX, desain kemasan takeaway box, kantong ramah lingkungan, seragam kru resto, dan fasad outlet.",
      deliverables: [
        "Buku Pedoman Standar Identitas Visual",
        "Sistem Logo & Palet Warna Resmi",
        "Aplikasi Desain Kemasan & Promosi",
        "Standarisasi Material & Penerapan Media",
      ],
    }
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
      "Pedoman Identitas Visual Resmi Peringatan 75 Tahun Kemerdekaan Republik Indonesia (Indonesia Maju) — karya kolaborasi Satu Collective bersama Utero. Menghadirkan konfigurasi angka 75 yang dinamis dan progresif sebagai simbol pemerataan ekonomi, pembangunan maritim, dan akselerasi SDM unggul di seluruh penjuru tanah air.",
    excerpt: "Sistem identitas visual dan pedoman aplikasi logo peringatan 75 Tahun Kemerdekaan RI.",
    coverImage: "/projects/logo-75th-indonesia/cover.webp",
    heroImage: "/projects/logo-75th-indonesia/cover.webp",
    hoverImage: "/projects/logo-75th-indonesia/11.webp",
    galleryImages: [
      "/projects/logo-75th-indonesia/01.webp",
      "/projects/logo-75th-indonesia/02.webp",
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
    video: undefined,
    featured: false,
    priority: 88,
    tags: ["national", "government", "identity", "campaign"],
    details: {
      scope: [
        "Brand Identity & Positioning",
        "Visual Standard Manual",
        "Corporate & Marketing Assets",
        "Packaging & Environmental Design",
      ],
      challenge:
        "Merancang identitas perayaan kemerdekaan nasional yang inklusif, membangkitkan optimisme kebangsaan di tengah tantangan global, dan mudah diaplikasikan secara serentak oleh seluruh kementerian, BUMN, pemda, dan masyarakat luas.",
      solution:
        "Menciptakan sistem supergrafik fleksibel yang terinspirasi dari gugusan pulau dan gelombang maritim Indonesia, dilengkapi pedoman aplikasi warna monokrom dan full-color pada baliho, media digital, busana kenegaraan, dan umbul-umbul ruang publik.",
      deliverables: [
        "Buku Pedoman Standar Identitas Visual",
        "Sistem Logo & Palet Warna Resmi",
        "Aplikasi Desain Kemasan & Promosi",
        "Standarisasi Material & Penerapan Media",
      ],
    }
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
      "/projects/ayam-goreng-nelongso/02.webp",
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
    video: undefined,
    featured: false,
    priority: 87,
    tags: ["fnb", "culinary", "identity", "franchise"],
    details: {
      scope: [
        "Pedoman Identitas Visual (GSM)",
        "Sistem Logo & Standarisasi",
        "Image Style & Panduan Fotografi",
        "Seragam & Merchandise (Shirt, T-Shirt, Lengan Panjang)",
        "Signage Neonbox",
        "Vehicle Livery Mini-Van",
      ],
      challenge:
        "Menyusun pedoman identitas visual yang menjaga konsistensi brand Ayam Goreng Nelongso di tengah ekspansi franchise dengan variasi produk yang luas dan banyaknya media aplikasi.",
      solution:
        "Merancang sistem standarisasi logo dan konsep image style dengan pencahayaan terang dan soft light untuk menampilkan suasana yang nyaman, dilengkapi panduan aplikasi pada name tag, seragam shirt dan t-shirt, neonbox, hingga livery mini-van.",
      deliverables: [
        "Buku Pedoman Identitas Visual",
        "Sistem Logo & Supergrafik",
        "Panduan Image Style & Fotografi",
        "Seragam Karyawan & Merchandise",
        "Desain Signage Neonbox",
        "Livery Mini-Van",
      ],
    }
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
      "Graphic Standard Manual KONAS PGHNAI 2021 — Kongres Nasional Perhimpunan Gastroenterologi, Hepatologi dan Nutrisi Anak Indonesia. Logo menggabungkan simbol organ pencernaan anak, stilasi bunga mekar sebagai lambang tumbuh kembang sehat, dan gelombang digital medis yang mencerminkan pertukaran riset ilmiah dokter spesialis anak di era modern.",
    excerpt: "Identitas visual Konferensi Nasional (KONAS) 2021 — sistem grafis komprehensif perhelatan akbar.",
    coverImage: "/projects/konas-2021/cover.webp",
    heroImage: "/projects/konas-2021/cover.webp",
    hoverImage: "/projects/konas-2021/15.webp",
    galleryImages: [
      "/projects/konas-2021/01.webp",
      "/projects/konas-2021/02.webp",
      "/projects/konas-2021/07.webp",
      "/projects/konas-2021/09.webp",
      "/projects/konas-2021/10.webp",
      "/projects/konas-2021/11.webp",
      "/projects/konas-2021/12.webp",
      "/projects/konas-2021/15.webp",
    ],
    video: undefined,
    featured: false,
    priority: 86,
    tags: ["event", "conference", "identity", "branding"],
    details: {
      scope: [
        "Brand Identity & Positioning",
        "Visual Standard Manual",
        "Corporate & Marketing Assets",
        "Packaging & Environmental Design",
      ],
      challenge:
        "Menciptakan identitas visual konferensi medis tingkat nasional yang ilmiah, hangat, dan berpusat pada kesehatan anak, serta siap diaplikasikan pada platform virtual event dan materi simposium fisik.",
      solution:
        "Mengembangkan logo terintegrasi dengan palet warna kesehatan terpercaya, modul buku program digital, sertifikat ber-SKP, backdrop panggung virtual, dan cinderamata pembicara internasional.",
      deliverables: [
        "Buku Pedoman Standar Identitas Visual",
        "Sistem Logo & Palet Warna Resmi",
        "Aplikasi Desain Kemasan & Promosi",
        "Standarisasi Material & Penerapan Media",
      ],
    }
  },

  // ── 10 — Startup For Industry (SFI) ─────────────────────────────────────
  {
    slug: "sfi",
    title: "Startup For Industry (SFI)",
    client: "Kementerian Perindustrian Republik Indonesia",
    year: "2024",
    category: "Government Program Brand Identity",
    industry: "government",
    disciplines: ["identity", "print", "digital"],
    shortDescription:
      "Sistem identitas visual program Startup For Industry — \"An Ecosystem Of Technology Solution\" dari Kementerian Perindustrian RI.",
    description:
      "Visual Guideline Startup For Industry — program akselerasi transformasi teknologi bagi pelaku industri Indonesia dari Kementerian Perindustrian Republik Indonesia bertajuk \"An Ecosystem Of Technology Solution\". Logo menggabungkan elemen heksagonal yang saling terhubung, terinspirasi dari pola jaringan (network) pada logo referensi SFI yang melambangkan kolaborasi dan sinergi — inti semangat startup di Indonesia — dengan bentuk konektivitas antar elemen yang menyerupai rantai industri yang kuat. Palet warna gradasi kuning, hijau, dan merah mewakili energi, pertumbuhan, dan optimisme, didukung tipografi Chambers Sans Pro (judul) dan Inter (isi).",
    excerpt:
      "Sistem identitas visual program Startup For Industry — \"An Ecosystem Of Technology Solution\" dari Kementerian Perindustrian RI.",
    coverImage: "/projects/sfi/cover.png",
    heroImage: "/projects/sfi/cover.png",
    hoverImage: "/projects/sfi/13.webp",
    galleryImages: [
      "/projects/sfi/03.webp",
      "/projects/sfi/04.webp",
      "/projects/sfi/05.webp",
      "/projects/sfi/06.webp",
      "/projects/sfi/09.webp",
      "/projects/sfi/10.webp",
      "/projects/sfi/11.webp",
      "/projects/sfi/13.webp",
      "/projects/sfi/14.webp",
      "/projects/sfi/15.webp",
    ],
    video: undefined,
    featured: false,
    priority: 85,
    tags: ["identity", "corporate", "government", "gsm"],
    details: {
      scope: [
        "Brand Identity & Positioning",
        "Logo Sistem (Logogram, Logotype, Tagline)",
        "Palet Warna & Tipografi (Chambers Sans Pro, Inter)",
        "Pattern & Aplikasi Supergrafik",
        "Media Ads & Stationery",
        "Signage & Wayfinding",
        "Apparel (Dress Shirt, Caps)",
      ],
      challenge:
        "Membangun identitas visual program pemerintah yang futuristik, kredibel, dan berdaya tarik tinggi bagi para founder startup teknologi terdepan dan pelaku industri manufaktur skala besar.",
      solution:
        "Merancang struktur logo heksagonal yang saling terhubung sebagai representasi ekosistem kolaborasi dan sinergi rantai industri, dengan gradasi warna kuning, hijau, dan merah untuk energi, pertumbuhan, dan optimisme, dilengkapi clear space, sizing, common mistake, pattern dari negatif space logogram, serta aplikasi pada media ads, business card, dress shirt, signage, wayfinding, dan caps.",
      deliverables: [
        "Buku Panduan Visual Guideline",
        "Sistem Logo & Elemen Pattern",
        "Palet Warna & Sistem Tipografi",
        "Media Ads & Stationery",
        "Signage, Wayfinding & Apparel",
      ],
    }
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
      "Brand Guideline Wajan Giok — identitas visual restoran Chinese food halal bernuansa modern otentik. Visualisasi logotype mengadopsi gaya kaligrafi aksara Tionghoa (Han) yang dipadukan dengan simbol naga kayu pembawa kemakmuran, menghadirkan kehangatan sajian oriental sehari-hari yang berkelas dan ramah keluarga.",
    excerpt: "Pedoman identitas brand kuliner Wajan Giok — sistem visual F&B yang kuat.",
    coverImage: "/projects/wajan-giok/cover.webp",
    heroImage: "/projects/wajan-giok/cover.webp",
    hoverImage: "/projects/wajan-giok/13.webp",
    galleryImages: [
      "/projects/wajan-giok/02.webp",
      "/projects/wajan-giok/05.webp",
      "/projects/wajan-giok/06.webp",
      "/projects/wajan-giok/07.webp",
      "/projects/wajan-giok/09.webp",
      "/projects/wajan-giok/10.webp",
      "/projects/wajan-giok/11.webp",
      "/projects/wajan-giok/12.webp",
      "/projects/wajan-giok/13.webp",
      "/projects/wajan-giok/14.webp",
      "/projects/wajan-giok/15.webp",
    ],
    video: undefined,
    featured: false,
    priority: 84,
    tags: ["fnb", "identity", "packaging", "gsm"],
    details: {
      scope: [
        "Brand Identity & Positioning",
        "Visual Standard Manual",
        "Corporate & Marketing Assets",
        "Packaging & Environmental Design",
      ],
      challenge:
        "Memperkenalkan konsep restoran masakan Cina otentik yang halal dan ramah keluarga dengan identitas oriental yang elegan tanpa kesan kaku atau kuno.",
      solution:
        "Menghadirkan paduan logotype kaligrafi Han kontemporer dengan motif naga pembawa berkah, diaplikasikan pada buku menu jilid kulit, mangkok keramik custom, sumpit, signage neonbox oriental, dan celemek koki.",
      deliverables: [
        "Buku Pedoman Standar Identitas Visual",
        "Sistem Logo & Palet Warna Resmi",
        "Aplikasi Desain Kemasan & Promosi",
        "Standarisasi Material & Penerapan Media",
      ],
    }
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
      "/projects/bpr-tulungagung/04.webp",
      "/projects/bpr-tulungagung/05.webp",
      "/projects/bpr-tulungagung/09.webp",
      "/projects/bpr-tulungagung/10.webp",
      "/projects/bpr-tulungagung/11.webp",
      "/projects/bpr-tulungagung/13.webp",
    ],
    video: undefined,
    featured: false,
    priority: 83,
    tags: ["banking", "identity", "gsm"],
    details: {
      scope: [
        "Brand Identity & Positioning",
        "Sistem Logo — Konsep Give and Care",
        "Palet Warna & Tipografi Resmi (Gotham)",
        "Seragam Karyawan (Kemeja, Berjilbab)",
        "Merchandise (Jam Dinding, Tote Bag, Tumbler)",
        "Social Media Design System",
        "Livery Mobil Dinas",
      ],
      challenge:
        "Membangun citra BPR daerah yang modern, terpercaya, dan humanis — logo terinspirasi konsep Give and Care yang direpresentasikan dalam bentuk imajinatif pemberian dan kepedulian kepada nasabah.",
      solution:
        "Menyusun pedoman identitas brand lengkap dengan palet biru (#154197), teal (#24BAAB), dan charcoal (#30343D), tipografi Gotham, serta standarisasi aplikasi pada seragam, merchandise, media sosial, dan mobil dinas.",
      deliverables: [
        "Buku Pedoman Identitas Brand (GSM)",
        "Sistem Logo & Representasi Elemen",
        "Standarisasi Seragam & Merchandise",
        "Template Media Sosial",
        "Desain Livery Mobil Dinas",
      ],
    }
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
      "/projects/bpr-artha-kanjuruhan/10.webp",
      "/projects/bpr-artha-kanjuruhan/11.webp",
      "/projects/bpr-artha-kanjuruhan/14.webp",
    ],
    video: undefined,
    featured: false,
    priority: 82,
    tags: ["banking", "corporate", "identity", "gsm"],
    details: {
      scope: [
        "Brand Identity & Positioning",
        "Sistem Logo — Tumbuh Berkembang & Setia Bersama Pengusaha Kecil",
        "Palet Warna (Mirage, Alizarin Crimson) & Tipografi Gotham",
        "Seragam Karyawan",
        "Signage Acrylic & Jam Dinding",
        "Merchandise (Kanvas Cloth, Tumbler)",
        "Livery & Media Dinas",
      ],
      challenge:
        "Menghadirkan identitas visual bank perkreditan rakyat daerah yang kokoh dan akrab bagi pengusaha kecil, berangkat dari komitmen \"Tumbuh Berkembang dan Setia Bersama Pengusaha Kecil\".",
      solution:
        "Merancang pedoman brand yang menstandarkan logo, palet warna Mirage (#1E2A3A) dan Alizarin Crimson (#E7292C), tipografi Gotham, serta aplikasi pada seragam, signage acrylic, jam dinding, merchandise, dan media dinas.",
      deliverables: [
        "Buku Pedoman Identitas Brand (GSM)",
        "Sistem Logo & Elemen Visual",
        "Standarisasi Seragam & Signage",
        "Merchandise & Souvenir",
        "Aplikasi Media Cetak & Digital",
      ],
    }
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
      "Pedoman Identitas Visual Baiturrokhman Tour & Travel — biro perjalanan ibadah Umroh dan Haji Khusus. Logo dirancang dengan penuh kehati-hatian untuk mencerminkan esensi ibadah: mengintegrasikan siluet kubah masjid suci, garis lengkung orbit thawaf Ka'bah, dan sayap kemudahan pelayanan dalam palet warna hijau zamrud dan emas kemuliaan.",
    excerpt: "Pedoman identitas visual institusi Baiturrohman.",
    coverImage: "/projects/baiturrohman/cover.webp",
    heroImage: "/projects/baiturrohman/cover.webp",
    hoverImage: "/projects/baiturrohman/15.webp",
    galleryImages: [
      "/projects/baiturrohman/14.webp",
      "/projects/baiturrohman/15.webp",
    ],
    video: undefined,
    featured: false,
    priority: 81,
    tags: ["institutional", "identity", "visual-guideline"],
    details: {
      scope: [
        "Brand Identity & Positioning",
        "Visual Standard Manual",
        "Corporate & Marketing Assets",
        "Packaging & Environmental Design",
      ],
      challenge:
        "Membangun kepercayaan dan rasa tenang bagi calon jamaah ibadah tanah suci melalui identitas visual biro travel yang bernuansa islami, profesional, dan berkelas.",
      solution:
        "Merancang sistem identitas terpadu berornamen islami kontemporer yang diaplikasikan pada koper jamaah, tas serbaguna, paspor wallet, kain seragam batik ihram, banner manasik, dan papan nama kantor operasional.",
      deliverables: [
        "Buku Pedoman Standar Identitas Visual",
        "Sistem Logo & Palet Warna Resmi",
        "Aplikasi Desain Kemasan & Promosi",
        "Standarisasi Material & Penerapan Media",
      ],
    }
  },

  // ── 15 — JMT — Juaranya Makan Terenak ─────────────────────────────────
  {
    slug: "jmt",
    title: "JMT — Juaranya Makan Terenak",
    client: "JMT",
    year: "2026",
    category: "Food Brand Identity & Mascot System",
    industry: "fnb",
    disciplines: ["identity", "packaging", "print"],
    shortDescription:
      "Identitas food brand dengan maskot kura-kura John — delightful, kekinian, terinspirasi slang Korea \"jon-mat-taeng\".",
    description:
      "Visual Guideline JMT — brand makanan dengan nama yang memiliki dua makna kuat: \"Juaranya Makan Terenak\" sebagai positioning rasa terbaik dan unggul, serta terinspirasi slang Korea \"jon-mat-taeng\" (enak banget / super lezat) yang memberi nuansa modern, kekinian, dan relevan dengan tren anak muda. Kura-kura dipilih sebagai maskot karena citra positifnya — ketenangan dan kenyamanan — merepresentasikan JMT sebagai tempat santai tanpa terburu-buru, sekaligus harapan bisnis yang fokus pada fondasi kuat dan loyalitas pelanggan agar berumur panjang. Maskot John dihadirkan sebagai pribadi yang kehadirannya selalu dinantikan, didukung palet biru (#0136fe) dan hijau (#b9f602), tipografi Grandstander yang playful, serta pattern motif cangkang kura-kura.",
    excerpt:
      "Identitas food brand dengan maskot kura-kura John — delightful, kekinian, terinspirasi slang Korea \"jon-mat-taeng\".",
    coverImage: "/projects/jmt/cover.webp",
    heroImage: "/projects/jmt/cover.webp",
    hoverImage: "/projects/jmt/03.webp",
    galleryImages: [
      "/projects/jmt/02.webp",
      "/projects/jmt/03.webp",
      "/projects/jmt/04.webp",
      "/projects/jmt/06.webp",
      "/projects/jmt/07.webp",
      "/projects/jmt/09.webp",
      "/projects/jmt/11.webp",
      "/projects/jmt/14.webp",
      "/projects/jmt/15.webp",
    ],
    video: undefined,
    featured: false,
    priority: 75,
    tags: ["fnb", "food", "mascot", "identity"],
    details: {
      scope: [
        "Brand Identity & Story Logoing",
        "Maskot System (John)",
        "Palet Warna & Tipografi (Grandstander)",
        "Pattern Motif Cangkang Kura-Kura",
        "Design Application (Menu, Packaging, Merchandise)",
      ],
      challenge:
        "Membangun identitas food brand yang diingat dan disukai anak muda, dengan makna nama yang kuat serta maskot berkarakter yang merepresentasikan ketenangan, kenyamanan, dan bisnis yang berumur panjang.",
      solution:
        "Mengembangkan sistem maskot kura-kura John yang cheerful dan memorable, dipadukan palet biru-hijau serta tipografi Grandstander yang menyenangkan, dengan pattern motif cangkang kura-kura yang diaplikasikan konsisten pada desain menu, kemasan, dan merchandise.",
      deliverables: [
        "Buku Panduan Visual Guideline",
        "Sistem Logo & Story Logoing",
        "Maskot John & Karakter",
        "Pattern & Supergrafik",
        "Aplikasi Desain (Menu, Kemasan, Merchandise)",
      ],
    }
  },

  // ── 16 — Lacamino Cigar ───────────────────────────────────────────────────
  {
    slug: "lacamino",
    title: "Lacamino Cigar",
    client: "Lacamino Cigar",
    year: "2025",
    category: "Premium Cigar Brand Identity & Packaging",
    industry: "products",
    disciplines: ["identity", "packaging", "print"],
    shortDescription:
      "Identitas visual cerutu premium yang terinspirasi rute ziarah El Camino de Santiago — kerang, ornament Victoria, dan warna violet-emas.",
    description:
      "Visual Guideline Lacamino — brand cerutu premium yang terinspirasi dari rute ziarah kuno Spanyol, El Camino de Santiago (The Way of St. James). Lacamino (bahasa Spanyol, \"Jalan\") mencerminkan perjalanan hidup manusia yang penuh lika-liku, tantangan, dan pembelajaran. Iconography kerang digunakan sebagai penanda sepanjang jalan menuju Santiago sekaligus simbol pelindung para peziarah, dipadu ornament bergaya Victoria dari Katedral Santiago de Compostela dalam palet ungu gelap (#2C0B60) dan emas kemuliaan.",
    excerpt:
      "Identitas visual cerutu premium yang terinspirasi rute ziarah El Camino de Santiago — kerang, ornament Victoria, dan warna violet-emas.",
    coverImage: "/projects/lacamino/cover.webp",
    heroImage: "/projects/lacamino/cover.webp",
    hoverImage: "/projects/lacamino/15.webp",
    galleryImages: [
      "/projects/lacamino/04.webp",
      "/projects/lacamino/08.webp",
      "/projects/lacamino/09.webp",
      "/projects/lacamino/10.webp",
      "/projects/lacamino/11.webp",
      "/projects/lacamino/12.webp",
      "/projects/lacamino/13.webp",
      "/projects/lacamino/14.webp",
      "/projects/lacamino/15.webp",
    ],
    video: undefined,
    featured: false,
    priority: 74,
    tags: ["cigar", "premium", "packaging", "identity"],
    details: {
      scope: [
        "Brand Identity & Cerita Logo",
        "Supergraphic / Power Graphic",
        "Palet Warna (Violet, Emas) & Tipografi Faculty Glyphic",
        "Cigar Label & Packaging (Box)",
        "Sign System & Bag",
        "Gas Lighter, Business Card & Letterhead",
        "Poster & Billboard",
      ],
      challenge:
        "Menghadirkan identitas brand cerutu artisanal yang memancarkan aura kemewahan klasik Eropa, ketenangan reflektif, dan cita rasa tembakau pilihan bagi penikmat cerutu berpengalaman.",
      solution:
        "Merancang identitas terinspirasi rute ziarah Camino de Santiago dengan iconography kerang sebagai penanda dan simbol pelindung, ornament Victoria dari Katedral Santiago de Compostela, tipografi Faculty Glyphic yang modern, serta aplikasi pada label dan kotak cerutu, sign system, bag, gas lighter, business card, poster, hingga billboard.",
      deliverables: [
        "Buku Panduan Visual Guideline",
        "Sistem Logo & Supergraphic",
        "Desain Label & Packaging Cerutu",
        "Sign System & Accessories (Lighter, Bag)",
        "Stationery, Poster & Billboard",
      ],
    }
  },

  // ── 17 — TechLink Summit 2024 ─────────────────────────────────────────────
  {
    slug: "techlink",
    title: "TechLink Summit 2024",
    client: "Kementerian Perindustrian Republik Indonesia",
    year: "2024",
    category: "Technology Event Identity",
    industry: "event",
    disciplines: ["identity", "digital", "print"],
    shortDescription:
      "Identitas visual TechLink Summit — gelaran event teknologi dan inovasi Kementerian Perindustrian RI.",
    description:
      "Visual Guideline TechLink — identitas visual TechLink Summit 2024, event teknologi dan inovasi dari Kementerian Perindustrian RI. Konsep logo modern dan profesional yang merepresentasikan event teknologi dengan keyword TECHNOLOGY, CREATE VALUE, COLLABORATION, MODERN, dan INNOVATION. Menggunakan tipografi geometris Exo Family, dengan aplikasi pada media ads horizontal dan vertikal, visual stage, t-shirt, icon app, canvas bag, dan sticker.",
    excerpt:
      "Identitas visual TechLink Summit — gelaran event teknologi dan inovasi Kementerian Perindustrian RI.",
    coverImage: "/projects/techlink/cover.webp",
    heroImage: "/projects/techlink/cover.webp",
    hoverImage: "/projects/techlink/07.webp",
    galleryImages: [
      "/projects/techlink/02.webp",
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
    video: undefined,
    featured: false,
    priority: 73,
    tags: ["tech", "event", "government", "innovation"],
    details: {
      scope: [
        "Brand Identity & Brand Story",
        "Logo Konfigurasi (Primary, Alternative, Iconic)",
        "Tipografi Exo Family",
        "Color Guide & Palet Resmi",
        "Media Ads (Horizontal & Vertikal)",
        "Visual Stage",
        "Merchandise (T-Shirt, Icon App, Canvas Bag, Sticker)",
      ],
      challenge:
        "Merancang identitas event teknologi yang modern, profesional, dan mudah diaplikasikan pada berbagai platform multimedia, signage panggung, dan media cetak expo.",
      solution:
        "Mengembangkan konsep logo bertema TECHNOLOGY, CREATE VALUE, COLLABORATION, MODERN, dan INNOVATION dengan tipografi Exo Family, dipadukan panduan warna yang konsisten serta aplikasi pada media ads, visual stage, t-shirt, icon app, canvas bag, dan sticker.",
      deliverables: [
        "Buku Panduan Visual Guideline",
        "Sistem Logo & Konfigurasi",
        "Sistem Tipografi & Color Guide",
        "Media Ads & Visual Stage",
        "Merchandise Event",
      ],
    }
  },

  // ── 18 — Proxon — PT. Proxima Omnia Strategy ─────────────────────────────
  {
    slug: "proxon",
    title: "PT. Proxima Omnia Strategy (Proxon)",
    client: "PT. Proxima Omnia Strategy",
    year: "2024",
    category: "Business Strategy Consultancy Identity",
    industry: "corporate",
    disciplines: ["identity", "print"],
    shortDescription:
      "Visual guideline PROXON — \"Synergize Business Strategies\" oleh PT. Proxima Omnia Strategy.",
    description:
      "Visual Guideline PROXON — PT. Proxima Omnia Strategy, konsultan strategi bisnis bertajuk \"Synergize Business Strategies\". Logo menggambarkan inisial huruf P dengan sudut yang mengarah ke kanan atas — mencerminkan percepatan bisnis dan progres baik bagi perusahaan maupun klien — serta satu garis yang terhubung melambangkan sinergi antar strategi. Menggunakan palet biru (#0424D9) dan merah (#F20505) dengan tipografi Inter yang modern dan terbaca jelas.",
    excerpt:
      "Visual guideline PROXON — \"Synergize Business Strategies\" oleh PT. Proxima Omnia Strategy.",
    coverImage: "/projects/proxon/cover.webp",
    heroImage: "/projects/proxon/cover.webp",
    hoverImage: "/projects/proxon/07.webp",
    galleryImages: [
      "/projects/proxon/02.webp",
      "/projects/proxon/03.webp",
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
    video: undefined,
    featured: false,
    priority: 72,
    tags: ["consulting", "corporate", "strategy", "identity"],
    details: {
      scope: [
        "Brand Identity & Brand Story",
        "Logo Komposisi (Main, Alternative, Iconic)",
        "Palet Warna (Biru, Merah) & Tipografi Inter",
        "Letterhead & Business Card",
        "Envelope, Stamp & Identity Card",
        "Shop Sign & Vertical Ads",
      ],
      challenge:
        "Membangun citra firma konsultansi manajemen yang kredibel, tajam, dan setara dengan standar konsultan global, sekaligus memudahkan customer mengingat brand PROXON.",
      solution:
        "Merumuskan identitas visual minimalis tegas berbasis inisial P dengan arah sudut ke kanan atas sebagai simbol percepatan bisnis dan satu garis terhubung sebagai sinergi strategi, dipadu palet biru-merah dan tipografi Inter, diaplikasikan pada kop surat, kartu nama, amplop, stempel, kartu identitas, shop sign, dan media ads vertikal.",
      deliverables: [
        "Buku Panduan Visual Guideline",
        "Sistem Logo & Komposisi",
        "Stationery Set (Letterhead, Business Card, Envelope, Stamp)",
        "Identity Card & Shop Sign",
        "Media Ads Vertikal",
      ],
    }
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
      "Mini GSM Kiyona — brand produk perawatan kulit dan kecantikan holistik. Nama KIYONA lahir dari gabungan kata 'Kiyo' (Murni) dan 'Na' (Indah/Lembut), berpijak pada keyakinan bahwa kecantikan sejati lahir dari pemurnian diri yang otentik. Mengadaptasi bentuk Bunga Lily lambang kemurnian dan kelahiran kembali, dengan tagline 'So light, It Becomes Your Skin' serta simpul ikatan komitmen brand bersama penggunanya.",
    excerpt: "Mini GSM identitas visual brand kecantikan dan skincare Kiyona.",
    coverImage: "/projects/kiyona/cover.webp",
    heroImage: "/projects/kiyona/cover.webp",
    hoverImage: "/projects/kiyona/10.webp",
    galleryImages: [
      "/projects/kiyona/02.webp",
      "/projects/kiyona/03.webp",
      "/projects/kiyona/04.webp",
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
    video: undefined,
    featured: false,
    priority: 71,
    tags: ["beauty", "cosmetics", "skincare", "identity"],
    details: {
      scope: [
        "Brand Identity & Positioning",
        "Visual Standard Manual",
        "Corporate & Marketing Assets",
        "Packaging & Environmental Design",
      ],
      challenge:
        "Menciptakan identitas brand kecantikan organik yang lembut, jujur, dan berdaya pikat premium di tengah ketatnya persaingan industri kosmetik lokal.",
      solution:
        "Merancang simbol bunga lily bersimpul halus dengan palet warna pastel menenangkan, diaplikasikan pada botol pipet serum, jar krim kaca buram, kemasan box kosmetik emboss, tas belanja ramah lingkungan, dan etalase konter kecantikan.",
      deliverables: [
        "Buku Pedoman Standar Identitas Visual",
        "Sistem Logo & Palet Warna Resmi",
        "Aplikasi Desain Kemasan & Promosi",
        "Standarisasi Material & Penerapan Media",
      ],
    }
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
      "Graphic Standard Manual Universitas Widyagama Malang (UWG) — standarisasi logo akronim perguruan tinggi swasta terkemuka di Malang. Mengusung simbol akronim geometris kubus pengetahuan yang mencerminkan kampus yang inovatif, berdaya saing global, dan berakar kuat pada nilai nasionalisme dan kewirausahaan.",
    excerpt: "Graphic Standard Manual identitas visual Universitas Widyagama (UWG) Malang.",
    coverImage: "/projects/uwg/cover.webp",
    heroImage: "/projects/uwg/cover.webp",
    hoverImage: "/projects/uwg/03.webp",
    galleryImages: [
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
    video: undefined,
    featured: false,
    priority: 70,
    tags: ["education", "campus", "university", "identity"],
    details: {
      scope: [
        "Brand Identity & Positioning",
        "Visual Standard Manual",
        "Corporate & Marketing Assets",
        "Packaging & Environmental Design",
      ],
      challenge:
        "Menyederhanakan dan memodernisasi identitas visual kampus agar lebih aplikatif pada media digital, signage arsitektur kampus, dan armada transportasi tanpa menghilangkan nilai historis universitas.",
      solution:
        "Merumuskan standarisasi logo akronim presisi monokrom dan warna resmi kampus, diaplikasikan pada branding bus operasional, bendera fakultas, map ijazah wisuda, kartu tanda mahasiswa (KTM), dan sistem penanda gedung perkuliahan.",
      deliverables: [
        "Buku Pedoman Standar Identitas Visual",
        "Sistem Logo & Palet Warna Resmi",
        "Aplikasi Desain Kemasan & Promosi",
        "Standarisasi Material & Penerapan Media",
      ],
    }
  },

  // ── 21 — Keripik Tempe Rohani Malang ──────────────────────────────────────
  {
    slug: "rohani",
    title: "Keripik Tempe Rohani Malang",
    client: "Keripik Tempe Rohani Malang",
    year: "2022",
    category: "Heritage F&B Brand Identity & GSM",
    industry: "fnb",
    disciplines: ["identity", "print", "outdoor"],
    shortDescription:
      "Standar Manual Grafis Keripik Tempe Rohani — oleh-oleh khas Malang dengan identitas oranye yang hangat dan ramah.",
    description:
      "Standar Manual Grafis — Keripik Tempe Rohani Malang, Indonesia. Identitas visual dibangun di atas konsep keramahan terhadap konsumen yang disimbolkan dengan warna oranye, serta ilustrasi persona ibu yang sedang memanen kedelai — hasil olahan kedelai (tempe) tercermin dari motif pakaian berkeledai dan penyajian keripik tempe dalam livery brand. Pedoman mencakup grid dan konfigurasi logo, aturan kontras latar belakang (standar putih, oranye solid, foto terang, dan latar gelap), adaptasi latar, seragam karyawan, topi, mobil perusahaan dan mobil box, penunjuk arah \"500 meter lagi\", serta penanda ruang produksi, pengemas, dan kasir.",
    excerpt:
      "Standar Manual Grafis Keripik Tempe Rohani — oleh-oleh khas Malang dengan identitas oranye yang hangat dan ramah.",
    coverImage: "/projects/rohani/cover.webp",
    heroImage: "/projects/rohani/cover.webp",
    hoverImage: "/projects/rohani/06.webp",
    galleryImages: [
      "/projects/rohani/06.webp",
      "/projects/rohani/10.webp",
      "/projects/rohani/13.webp",
    ],
    video: undefined,
    featured: false,
    priority: 69,
    tags: ["fnb", "tempeh", "malang", "identity", "gsm"],
    details: {
      scope: [
        "Grid & Konfigurasi Logo",
        "Panduan Warna & Kontras Latar",
        "Ilustrasi & Persona Brand (Ibu Memanen Kedelai)",
        "Seragam Karyawan & Topi",
        "Kendaraan Perusahaan (Mobil & Mobil Box)",
        "Penunjuk Arah & Penanda Ruang",
        "Avatar / Profile Image",
      ],
      challenge:
        "Menstandarkan identitas visual brand keripik tempe warisan khas Malang agar tampil rapi, konsisten, dan mudah dikenali pada seluruh media — dari seragam dan kendaraan operasional hingga penanda arah menuju lokasi.",
      solution:
        "Membangun identitas berbasis konsep keramahan dengan warna oranye hangat, didukung ilustrasi persona ibu memanen kedelai, grid dan konfigurasi logo yang presisi, aturan adaptasi latar, serta standarisasi seragam, topi, kendaraan perusahaan, penunjuk arah, dan penanda ruang produksi.",
      deliverables: [
        "Buku Standar Manual Grafis",
        "Sistem Grid & Konfigurasi Logo",
        "Panduan Warna & Adaptasi Latar",
        "Desain Seragam, Topi & Kendaraan",
        "Penunjuk Arah & Signage Ruang",
      ],
    }
  },

// ── 22 — Kopi 1922 ────────────────────────────────────────────────────────
  {
    slug: "gsm-1922",
    title: "Kopi 1922",
    client: "PT. Kuliner Dapur Bangsa",
    year: "2022",
    category: "Coffee Brand Identity & Packaging GSM",
    industry: "fnb",
    disciplines: ["identity", "packaging", "print"],
    shortDescription:
      "Graphic Standard Manual Kopi 1922 — \"Hundred Years of Experience\" dengan palet turquoise-emas yang historis.",
    description:
      "Graphic Standard Manual Kopi 1922 — \"Historically Proven Identity\". Brand kopi dengan tagline \"Hundred Years of Experience™\" dan moto \"We Do Coffee Right Since 1922\", dihadirkan lewat palet dark turquoise (#264653), gold (#D1A352), dan deep forest yang terasa klasik namun segar. Pedoman mencakup variasi logo, aturan penggunaan yang ketat (stretch, squash, rotate, drop shadow, dan outline logo tidak diperbolehkan), desain pouch 230 ml untuk brown sugar yang disajikan dingin dan fine Indonesian coffee, plastik cup (cold), apparel polo shirt dan apron, cap, serta coaster.",
    excerpt:
      "Graphic Standard Manual Kopi 1922 — \"Hundred Years of Experience\" dengan palet turquoise-emas yang historis.",
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
    video: undefined,
    featured: false,
    priority: 68,
    tags: ["fnb", "coffee", "packaging", "identity"],
    details: {
      scope: [
        "Brand Identity & Visual Concept",
        "Palet Warna (Dark Turquoise, Gold, Deep Forest)",
        "Variasi Logo & Aturan Penggunaan",
        "Packaging Pouch 230 ml (Brown Sugar, Fine Indonesian Coffee)",
        "Plastic Cup (Cold)",
        "Apparel (Polo Shirt, Apron)",
        "Merchandise (Cap, Coaster)",
      ],
      challenge:
        "Membangun identitas visual brand kopi yang terasa historis dan terpercaya — \"Hundred Years of Experience\" — sekaligus modern dan segar di mata konsumen kopi kekinian.",
      solution:
        "Menghadirkan palet warna dark turquoise, gold, dan deep forest yang elegan dengan aturan penggunaan logo yang ketat, dan menerapkannya pada pouch minuman 230 ml, plastic cup, apparel, hingga merchandise.",
      deliverables: [
        "Buku Graphic Standard Manual",
        "Sistem Logo & Color Palette",
        "Panduan Aturan Penggunaan Logo",
        "Desain Packaging Pouch & Plastic Cup",
        "Apparel & Merchandise",
      ],
    }
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
      "Graphic Standard Manual Momsarasa — produsen camilan olahan kentang premium khas dataran tinggi. Rebranding Momsarasa menghadirkan karakter visual yang ramah dan hangat dengan tipografi bernuansa nostalgia pedesaan, mencerminkan keaslian bahan baku kentang pilihan yang diolah renyah dengan bumbu rempah alami warisan keluarga.",
    excerpt: "Graphic Standard Manual kemasan dan identitas produk bumbu dapur Momsarasa.",
    coverImage: "/projects/momsarasa/cover.webp",
    heroImage: "/projects/momsarasa/cover.webp",
    hoverImage: "/projects/momsarasa/02.webp",
    galleryImages: [
      "/projects/momsarasa/01.webp",
      "/projects/momsarasa/03.webp",
      "/projects/momsarasa/04.webp",
      "/projects/momsarasa/05.webp",
      "/projects/momsarasa/06.webp",
      "/projects/momsarasa/07.webp",
      "/projects/momsarasa/08.webp",
      "/projects/momsarasa/10.webp",
      "/projects/momsarasa/11.webp",
      "/projects/momsarasa/12.webp",
      "/projects/momsarasa/13.webp",
    ],
    video: undefined,
    featured: false,
    priority: 67,
    tags: ["fnb", "culinary", "packaging", "identity"],
    details: {
      scope: [
        "Brand Identity & Positioning",
        "Visual Standard Manual",
        "Corporate & Marketing Assets",
        "Packaging & Environmental Design",
      ],
      challenge:
        "Meningkatkan daya saing produk camilan UMKM lokal agar dapat menembus rak supermarket modern dan pasar ekspor dengan kemasan menarik dan higienis.",
      solution:
        "Merancang sistem identitas visual lengkap: monogram logo kentang ramah, standarisasi kemasan zipper pouch, stiker segel toples, seragam karyawan toko, dan desain booth pameran kuliner.",
      deliverables: [
        "Buku Pedoman Standar Identitas Visual",
        "Sistem Logo & Palet Warna Resmi",
        "Aplikasi Desain Kemasan & Promosi",
        "Standarisasi Material & Penerapan Media",
      ],
    }
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
      "Mini Graphic Standard Manual Yin Yam — brand kuliner street food Chinese food otentik siap saji. Visualisasi logo mengadopsi filosofi Yin & Yang (keseimbangan dan saling melengkapi) yang dipadukan dengan ornamen simbol kemakmuran Tionghoa dan tipografi aksara oriental dalam palet warna biru navy (#023473) dan merah (#F10732).",
    excerpt: "Mini graphic standard manual brand street food Yin Yam.",
    coverImage: "/projects/yin-yam/cover.png",
    heroImage: "/projects/yin-yam/cover.png",
    hoverImage: "/projects/yin-yam/07.webp",
    galleryImages: [
      "/projects/yin-yam/02.webp",
      "/projects/yin-yam/04.webp",
      "/projects/yin-yam/07.webp",
      "/projects/yin-yam/08.webp",
      "/projects/yin-yam/09.webp",
      "/projects/yin-yam/10.webp",
      "/projects/yin-yam/11.webp",
      "/projects/yin-yam/12.webp",
      "/projects/yin-yam/13.webp",
    ],
    video: undefined,
    featured: false,
    priority: 66,
    tags: ["fnb", "street-food", "packaging", "mini-gsm"],
    details: {
      scope: [
        "Brand Identity & Positioning",
        "Visual Standard Manual",
        "Corporate & Marketing Assets",
        "Packaging & Environmental Design",
      ],
      challenge:
        "Menciptakan identitas visual gerai makanan cepat saji oriental yang bersih, lezat, dan berkarakter kuat untuk konsep gerai takeaway dan pesan-antar online.",
      solution:
        "Merancang logo segel oriental modern, kemasan paper box ramah minyak, tas jinjing takeaway, stiker segel makanan, poster promosi dinding bergaya artistik, dan panduan branding gerobak outlet.",
      deliverables: [
        "Buku Pedoman Standar Identitas Visual",
        "Sistem Logo & Palet Warna Resmi",
        "Aplikasi Desain Kemasan & Promosi",
        "Standarisasi Material & Penerapan Media",
      ],
    }
  },

// ── 25 — Cos Pleng ────────────────────────────────────────────────────────
  {
    slug: "cos-pleng",
    title: "Cos Pleng",
    client: "Cos Pleng — Chinese Food",
    year: "2023",
    category: "Chinese Food Brand Identity & Mini GSM",
    industry: "fnb",
    disciplines: ["identity", "packaging", "print"],
    shortDescription:
      "Mini GSM Cos Pleng — Chinese food rasa otentik, porsi jumbo, harga murah, mudah take-away.",
    description:
      "Mini Graphic Standard Manual Cos Pleng — Chinese food dengan target pasar keluarga: rasa otentik, porsi jumbo, harga murah, dan mudah di take-away dengan nuansa visual muda dan kekinian. Logomark dibangun dari inisial huruf C, kobaran api sebagai aspek krusial cita rasa Chinese food sekaligus semangat pantang menyerah, dan bentuk wajan besar yang identik dengan masakan China. Warna deep yellow melambangkan kemakmuran, merah semangat dan optimisme, serta abu-abu tua kepercayaan diri, pengalaman, dan kestabilan. Aplikasi mencakup neon sign, kemasan take-away, dan apron.",
    excerpt:
      "Mini GSM Cos Pleng — Chinese food rasa otentik, porsi jumbo, harga murah, mudah take-away.",
    coverImage: "/projects/cos-pleng/cover.webp",
    heroImage: "/projects/cos-pleng/cover.webp",
    hoverImage: "/projects/cos-pleng/10.webp",
    galleryImages: [
      "/projects/cos-pleng/09.webp",
      "/projects/cos-pleng/10.webp",
      "/projects/cos-pleng/11.webp",
      "/projects/cos-pleng/12.webp",
    ],
    video: undefined,
    featured: false,
    priority: 65,
    tags: ["fnb", "chinese-food", "takeaway", "identity", "packaging"],
    details: {
      scope: [
        "Konsep Brand & Pendekatan Visual",
        "Story of Logo (Alphabet C, Api, Wajan)",
        "Variasi Logo (Primary, Secondary, Positive, Diapositive)",
        "Palet Warna (Deep Yellow, Red, Grey)",
        "Neon Sign",
        "Kemasan Take-Away",
        "Apron",
      ],
      challenge:
        "Menciptakan identitas visual Chinese food yang muda, kekinian, dan mudah diingat oleh target pasar keluarga — dengan logomark yang mempertegas jenis usaha bahkan tanpa teks.",
      solution:
        "Merancang logomark wajan dengan kobaran api dan lingkaran kuning membentuk huruf C sebagai inisial nama brand, dengan strategi memorisasi yang terbukti efektif, serta aplikasi pada neon sign, kemasan take-away, dan apron.",
      deliverables: [
        "Buku Mini Graphic Standard Manual",
        "Sistem Logo & Story of Logo",
        "Palet Warna & Variasi Logo",
        "Desain Neon Sign",
        "Kemasan Take-Away & Apron",
      ],
    }
  },

// ── 26 — Boop Premium Pet Food ────────────────────────────────────────────
  {
    slug: "boop",
    title: "Boop Premium Pet Food",
    client: "Boop",
    year: "2023",
    category: "Pet Food Brand Identity & Mini GSM",
    industry: "fnb",
    disciplines: ["identity", "packaging", "print"],
    shortDescription:
      "Mini GSM Boop — identitas premium pet food berkarakter cute, premium & fun.",
    description:
      "Mini GSM Boop Premium Pet Food — tujuan desain: logo yang cute, premium, dan fun yang diimplementasikan ke dalam kemasan makanan hewan yang eye-catchy. Logogram dibangun dari garis lengkung dinamis yang tidak terputus dan bercabang — representasi harapan usaha yang terus tumbuh dan berkembang — dengan ilustrasi kepala anjing, kelinci, dan kucing tersenyum sebagai promise pet food yang disukai hewan peliharaan. Logotype custom sans-serif round corner yang lugas dan penuh energi, dipadu palet merah (#B2242D) dan kuning emas (#FDD841) yang menggambarkan warmth, love, dan joy.",
    excerpt:
      "Mini GSM Boop — identitas premium pet food berkarakter cute, premium & fun.",
    coverImage: "/projects/boop/cover.webp",
    heroImage: "/projects/boop/cover.webp",
    hoverImage: "/projects/boop/02.webp",
    galleryImages: [
      "/projects/boop/01.webp",
      "/projects/boop/02.webp",
      "/projects/boop/05.webp",
      "/projects/boop/06.webp",
      "/projects/boop/07.webp",
      "/projects/boop/08.webp",
      "/projects/boop/10.webp",
      "/projects/boop/11.webp",
    ],
    video: undefined,
    featured: false,
    priority: 64,
    tags: ["pet-food", "packaging", "identity", "mini-gsm"],
    details: {
      scope: [
        "Konsep Brand (Cute, Premium, Fun)",
        "Story of Logo & Approach",
        "Illustrasi Mascot (Anjing, Kelinci, Kucing)",
        "Palet Warna & Custom Logotype",
        "Pattern & Pola Berulang",
        "Media Application & Packaging",
      ],
      challenge:
        "Menciptakan identitas premium pet food yang cute, premium, dan fun agar menonjol di rak ritel dan disukai baik oleh hewan peliharaan maupun pemiliknya.",
      solution:
        "Membangun logogram garis lengkung dinamis yang melambangkan pertumbuhan usaha, ilustrasi hewan tersenyum sebagai promise rasa yang disukai hewan, custom typeface round corner yang lugas dan energik, serta pola berulang yang dapat diaplikasikan pada berbagai media dan kemasan.",
      deliverables: [
        "Buku Mini Graphic Standard Manual",
        "Sistem Logo & Story of Logo",
        "Illustrasi Mascot Karakter",
        "Palet Warna & Pattern",
        "Aplikasi Media & Packaging",
      ],
    }
  },

// ── 27 — Maitri Coffee & Social Hub ──────────────────────────────────────
  {
    slug: "maitri",
    title: "Maitri Coffee & Social Hub",
    client: "Maitri Coffee & Social Hub",
    year: "2025",
    category: "Coffee & Social Space Brand Identity",
    industry: "fnb",
    disciplines: ["identity", "print", "outdoor"],
    shortDescription:
      "Identitas visual Maitri Coffee & Social Hub dengan slogan \"Sekedar Bukan Teman\".",
    description:
      "Visual Guideline Maitri Coffee & Social Hub — identitas visual untuk coffee & social hub dengan slogan \"Sekedar Bukan Teman\". Logogram dan logotype dapat diaplikasikan secara terpisah, dibangun di atas palet fuchsia pink (#e5008d) yang berani dipadu hitam dan putih untuk kesan muda, hangat, dan energik. Aplikasi mencakup paper cup, plastic cup, t-shirt, poster, key chain, dan billboard.",
    excerpt:
      "Identitas visual Maitri Coffee & Social Hub dengan slogan \"Sekedar Bukan Teman\".",
    coverImage: "/projects/maitri/cover.webp",
    heroImage: "/projects/maitri/cover.webp",
    hoverImage: "/projects/maitri/05.webp",
    galleryImages: [
      "/projects/maitri/01.webp",
      "/projects/maitri/02.webp",
      "/projects/maitri/03.webp",
      "/projects/maitri/05.webp",
      "/projects/maitri/06.webp",
      "/projects/maitri/07.webp",
      "/projects/maitri/08.webp",
      "/projects/maitri/09.webp",
      "/projects/maitri/10.webp",
      "/projects/maitri/11.webp",
    ],
    video: undefined,
    featured: false,
    priority: 63,
    tags: ["fnb", "coffee", "social-hub", "identity"],
    details: {
      scope: [
        "Brand Identity & Jenis Logo",
        "Slogan System (\"Sekedar Bukan Teman\")",
        "Palet Warna (Fuchsia Pink, Hitam, Putih)",
        "Paper Cup & Plastic Cup",
        "T-Shirt & Poster",
        "Key Chain & Billboard",
      ],
      challenge:
        "Membangun identitas coffee & social hub yang hangat namun berkarakter tegas, muda, dan mudah dikenali di ruang sosial anak muda.",
      solution:
        "Merancang sistem logogram dan logotype yang dapat berdiri sendiri dengan palet fuchsia pink yang berani, slogan \"Sekedar Bukan Teman\" sebagai pembeda, serta aplikasi konsisten pada cup minuman, apparel, poster, key chain, dan billboard.",
      deliverables: [
        "Buku Visual Guideline",
        "Sistem Logo & Slogan",
        "Palet Warna Brand",
        "Desain Cup (Paper & Plastic)",
        "Apparel, Poster & Merchandise",
      ],
    }
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
      "Graphic Standard Manual Satu Titik Coffee and Creative Space — destinasi kafe dan ruang kreatif kolaboratif oleh PT PUS. Konsep logo menggabungkan inisial huruf 'S' yang mengadopsi bentuk uap dan leher teko seduh (kettle coffee) sebagai representasi proses seduhan kopi manual dan titik awal lahirnya ide-ide kreatif baru.",
    excerpt: "Mini GSM identitas visual Satu Titik Coffee & Space.",
    coverImage: "/projects/satu-titik/cover.webp",
    heroImage: "/projects/satu-titik/cover.webp",
    hoverImage: "/projects/satu-titik/04.webp",
    galleryImages: [
      "/projects/satu-titik/04.webp",
      "/projects/satu-titik/05.webp",
      "/projects/satu-titik/09.webp",
      "/projects/satu-titik/10.webp",
      "/projects/satu-titik/11.webp",
    ],
    video: undefined,
    featured: false,
    priority: 62,
    tags: ["fnb", "coffee", "hospitality", "identity"],
    details: {
      scope: [
        "Brand Identity & Positioning",
        "Visual Standard Manual",
        "Corporate & Marketing Assets",
        "Packaging & Environmental Design",
      ],
      challenge:
        "Membangun identitas ruang kafe yang tidak hanya menjual kopi berkualitas, tetapi juga berfungsi sebagai working space dan hub kreatif bagi pegiat industri kreatif dan komunitas lokal.",
      solution:
        "Mengembangkan logo berbasis teko seduh dan titik temu gagasan, diaplikasikan pada paper cup ramah lingkungan, kantong biji kopi craft, buku menu, apron barista, penanda nomor meja kayu, dan neon sign interior.",
      deliverables: [
        "Buku Pedoman Standar Identitas Visual",
        "Sistem Logo & Palet Warna Resmi",
        "Aplikasi Desain Kemasan & Promosi",
        "Standarisasi Material & Penerapan Media",
      ],
    }
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
      "Graphic Standard Manual CV Amarta Wisesa — perusahaan jasa konstruksi, renovasi, dan pengadaan infrastruktur sipil. Mengusung identitas visual kokoh dengan palet warna emas prestise (#D89640) dan hitam solid (#000000) yang melambangkan keandalan struktur, ketepatan waktu, dan integritas kemitraan proyek.",
    excerpt: "Graphic Standard Manual identitas korporasi Amarta Wisesa.",
    coverImage: "/projects/amarta-wisesa/cover.webp",
    heroImage: "/projects/amarta-wisesa/cover.webp",
    hoverImage: "/projects/amarta-wisesa/10.webp",
    galleryImages: [
      "/projects/amarta-wisesa/01.webp",
      "/projects/amarta-wisesa/05.webp",
      "/projects/amarta-wisesa/06.webp",
      "/projects/amarta-wisesa/07.webp",
      "/projects/amarta-wisesa/08.webp",
      "/projects/amarta-wisesa/09.webp",
      "/projects/amarta-wisesa/10.webp",
    ],
    video: undefined,
    featured: false,
    priority: 50,
    tags: ["corporate", "identity", "gsm"],
    details: {
      scope: [
        "Brand Identity & Positioning",
        "Visual Standard Manual",
        "Corporate & Marketing Assets",
        "Packaging & Environmental Design",
      ],
      challenge:
        "Menciptakan citra perusahaan konstruksi dan kontraktor yang solid, amanah, dan berstandar profesional tinggi untuk tender proyek swasta maupun pemerintah.",
      solution:
        "Merumuskan standarisasi logo geometris tegas, pedoman zona aman, kop surat perusahaan, kartu nama tim proyek, helm safety berstiker identitas, dan papan nama proyek lapangan.",
      deliverables: [
        "Buku Pedoman Standar Identitas Visual",
        "Sistem Logo & Palet Warna Resmi",
        "Aplikasi Desain Kemasan & Promosi",
        "Standarisasi Material & Penerapan Media",
      ],
    }
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
      "Visual Guideline PLUT-KUMKM — Pusat Layanan Usaha Terpadu Koperasi dan Usaha Mikro, Kecil, dan Menengah (Kementerian Koperasi dan UKM RI). Identitas visual dirancang terpadu untuk merepresentasikan 10 bidang layanan konsultasi bisnis, pendampingan perizinan, dan pemberdayaan wirausaha di seluruh sentra daerah Indonesia.",
    excerpt: "Visual guideline Pusat Layanan Usaha Terpadu Koperasi dan UKM.",
    coverImage: "/projects/plut-kumkm/cover.webp",
    heroImage: "/projects/plut-kumkm/cover.webp",
    hoverImage: "/projects/plut-kumkm/04.webp",
    galleryImages: [
      "/projects/plut-kumkm/01.webp",
      "/projects/plut-kumkm/04.webp",
      "/projects/plut-kumkm/05.webp",
      "/projects/plut-kumkm/06.webp",
      "/projects/plut-kumkm/07.webp",
      "/projects/plut-kumkm/08.webp",
      "/projects/plut-kumkm/09.webp",
      "/projects/plut-kumkm/10.webp",
    ],
    video: undefined,
    featured: false,
    priority: 49,
    tags: ["government", "sme", "public-service", "identity"],
    details: {
      scope: [
        "Brand Identity & Positioning",
        "Visual Standard Manual",
        "Corporate & Marketing Assets",
        "Packaging & Environmental Design",
      ],
      challenge:
        "Menyusun sistem identitas visual layanan publik kementerian yang ramah, informatif, dan mudah dipahami oleh pelaku usaha kecil dan mikro di berbagai penjuru daerah.",
      solution:
        "Menghadirkan ikonografi 10 bidang layanan PLUT, palet warna layanan pemerintah yang segar dan bersahabat, modul panduan konsultasi UMKM, banner sosialisasi, dan signage gedung pelayanan terpadu.",
      deliverables: [
        "Buku Pedoman Standar Identitas Visual",
        "Sistem Logo & Palet Warna Resmi",
        "Aplikasi Desain Kemasan & Promosi",
        "Standarisasi Material & Penerapan Media",
      ],
    }
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
      "Graphic Standard Manual PT Dailbana Prima Indonesia — perusahaan manufaktur benang bordir dan benang jahit tekstil berkualitas ekspor. Pedoman identitas visual GSM menetapkan sistem warna merah dinamis (#EC1C28) dan biru korporat (#1F4DA0) untuk memastikan konsistensi merek pada kemasan kelos benang, karton ekspor, dan materi pemasaran tekstil global.",
    excerpt: "Graphic Standard Manual identitas brand dan kemasan camilan Dailbana.",
    coverImage: "/projects/dailbana/cover.webp",
    heroImage: "/projects/dailbana/cover.webp",
    hoverImage: "/projects/dailbana/07.webp",
    galleryImages: [
      "/projects/dailbana/03.webp",
      "/projects/dailbana/04.webp",
      "/projects/dailbana/05.webp",
      "/projects/dailbana/06.webp",
      "/projects/dailbana/07.webp",
    ],
    video: undefined,
    featured: false,
    priority: 40,
    tags: ["fnb", "snack", "packaging", "identity"],
    details: {
      scope: [
        "Brand Identity & Positioning",
        "Visual Standard Manual",
        "Corporate & Marketing Assets",
        "Packaging & Environmental Design",
      ],
      challenge:
        "Menstandarisasi identitas visual pabrik tekstil multinasional agar memiliki tampilan kemasan produk yang presisi, mudah diidentifikasi di lini produksi garmen, dan konsisten di pasar internasional.",
      solution:
        "Merancang pedoman warna dan tipografi resmi, label stiker kelos benang, kardus kemasan berstandar ekspor, kartu nama manajemen, dan papan nama pabrik manufaktur.",
      deliverables: [
        "Buku Pedoman Standar Identitas Visual",
        "Sistem Logo & Palet Warna Resmi",
        "Aplikasi Desain Kemasan & Promosi",
        "Standarisasi Material & Penerapan Media",
      ],
    }
  },

// ── 32 — Wismari Sign System ──────────────────────────────────────────────
  {
    slug: "wismari",
    title: "Wismari Sign System",
    client: "Wismari — Idea And Concept Factory",
    year: "2019",
    category: "Facility Signage & Wayfinding System",
    industry: "property",
    disciplines: ["identity", "signage", "indoor", "outdoor"],
    shortDescription:
      "Sistem signage dan wayfinding gedung Idea And Concept Factory — pylon, direktori lantai, dan penanda ruang.",
    description:
      "Sistem penanda dan wayfinding untuk gedung \"Idea And Concept Factory\" karya Wismari. Pedoman mencakup pylon utama, direktori lantai dengan denah fasilitas (lobby, cafetaria, lift barang dan penumpang, ruang genset dan listrik pelanggan, gudang, toilet), penomoran ruang dan unit, penunjuk arah eksterior dan interior, hingga rambu EXIT dan area PARKIR.",
    excerpt:
      "Sistem signage dan wayfinding gedung Idea And Concept Factory — pylon, direktori lantai, dan penanda ruang.",
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
    video: undefined,
    featured: false,
    priority: 30,
    tags: ["wayfinding", "signage", "building", "identity"],
    details: {
      scope: [
        "Sistem Pylon & Penanda Eksterior",
        "Direktori Lantai & Denah Fasilitas",
        "Penomoran Ruang & Unit",
        "Penunjuk Arah (Interior & Eksterior)",
        "Rambu EXIT & Area PARKIR",
      ],
      challenge:
        "Menyusun alur navigasi yang intuitif bagi pengunjung gedung \"Idea And Concept Factory\" yang menaungi banyak fasilitas berbeda — dari lobby, cafetaria, area produksi dan gudang, hingga ruang utilitas.",
      solution:
        "Merancang sistem penanda terpadu mulai dari pylon utama, direktori lantai dengan denah fasilitas, penomoran ruang dan unit, penunjuk arah, hingga rambu keselamatan EXIT dan PARKIR agar identitas bangunan tetap terjaga di seluruh area.",
      deliverables: [
        "Buku Panduan Sign System",
        "Desain Pylon & Penanda Eksterior",
        "Direktori Lantai & Denah Fasilitas",
        "Sistem Penomoran Ruang",
        "Rambu Arah, EXIT & PARKIR",
      ],
    }
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
