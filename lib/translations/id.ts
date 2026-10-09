export const id = {
  // Navigation
  nav: {
    work: "KARYA",
    services: "LAYANAN",
    studio: "STUDIO",
    insights: "WAWASAN",
    contact: "KONTAK",
    menu: "MENU",
    close: "TUTUP",
  },
  navSubtitles: {
    work: "Studi Kasus Pilihan & Arsip",
    studio: "Filosofi, 25+ Tahun & Budaya",
    services: "Brand, Ruang, Digital & Kapabilitas",
    insights: "Publikasi, Media & Catatan Kasus",
    contact: "Saluran Langsung & Markas Studio",
  },
  // Hero Section
  hero: {
    tagline: "UTERO.ID — PERUSAHAAN BRAND & DESAIN",
    headline1: "SELESAIKAN MASALAH",
    headline2: "MELALUI",
    headline3: "DESAIN",
    headline4: "SOLUSI.",
    description: "Perusahaan branding dan desain komprehensif yang membantu organisasi membangun kehadiran yang khas, otoritas pasar, dan nilai budaya yang abadi sejak 1998.",
    capabilities: ["IDENTITAS", "CETAK", "LAINNYA", "DIGITAL", "LINGKUNGAN"],
    exploreWork: "JELAJAHI KARYA KAMI",
    studioTag: "BAGIAN DARI UTERO INDONESIA — BERDIRI SEJAK 1998",
  },
  // Services Section
  services: {
    sectionLabel: "04 / KAPABILITAS KREATIF",
    heading: "APA YANG BISA KAMI DESAIN UNTUK ANDA?",
    description: "Enam disiplin desain terintegrasi yang disesuaikan dengan kebutuhan strategis Anda — mulai dari identitas brand dasar hingga kemasan fisik, platform digital, dan pengalaman spasial lingkungan.",
    categoryLabel: "KATEGORI",
    coreDeliverables: "HASIL UTAMA:",
    viewDetails: "LIHAT DETAIL & ARSIP",
  },
  // Work Page
  work: {
    archive: "Arsip",
    filter: "Filter",
    byDiscipline: "Berdasarkan Disiplin",
    byIndustry: "Berdasarkan Industri",
    allIndustries: "Semua Industri",
    allWork: "SEMUA KARYA",
    project: "PROYEK",
    projects: "PROYEK",
    clearAll: "Hapus Semua ×",
    viewProject: "Lihat Proyek →",
    subtitle:
      "Identitas, ruang, produk, kampanye, dan pengalaman pilihan yang diciptakan oleh Utero.",
    noProjects: "Tidak ada proyek yang cocok dengan filter saat ini.",
    clearFilters: "Hapus Filter →",
  },
  // Halaman utama
  home: {
    aboutLabel: "01 / TENTANG UTERO",
    aboutHeading: "Perusahaan desain yang dibangun di atas eksekusi, bukan hiasan.",
    aboutBody:
      "Berdiri di Malang pada tahun 1998, Utero bekerja sebagai satu studio terintegrasi yang mencakup identitas, kemasan, promosi, digital, dan desain spasial. Kami menangani seluruh rantai kerja — strategi, prototipe, rekayasa, hingga fabrikasi — karena konsep yang berhenti di render tidak bernilai apa pun.",
    aboutCta: "Jelajahi Cerita Studio",
    archiveLabel: "Arsip Studio • Katalog Editorial",
    archiveVolume: "Vol. 1998–2026",
    recentWorksLabel: "03 / KARYA TERBARU",
    recentWorksHeading: "Karya Pilihan",
    recentWorksCta: "Lihat Semua Karya",
    worksHeading: "KARYA",
    featuredCaseStudy: "Studi Kasus Unggulan",
    manifestoLabel: "Filosofi & Eksekusi",
    manifestoHeading: "Ide tanpa realisasi sama dengan sampah.",
    manifestoBody:
      "Strategi tanpa manifestasi fisik hanyalah teoritis. Selama perjalanan seperempat abad kami, Utero telah membangun reputasinya dengan menolak desain yang murni kosmetik demi eksekusi yang ketat dari awal hingga akhir. Kami mengkonseptualisasi, membuat prototipe, merancang teknik, dan memfabrikasi.",
    statsTitle: "Praktik dalam Angka",
    statsProjects: "Proyek",
    statsClients: "Klien",
    statsDisciplines: "Disiplin",
    statsYears: "Tahun",
    ctaHeading: "Siap menyelesaikan tantangan brand atau spasial Anda?",
    ctaButton: "Mulai Proyek",
  },
  // Lingkup media (grid kapabilitas halaman utama)
  mediaScope: {
    digital: "Platform digital, media sosial, web, dan desain aplikasi.",
    print: "Cetak, kemasan, collateral, dan material brand fisik.",
    interior: "Lingkungan interior, ruang ritel, dan desain pameran.",
    outdoor: "Billboard, environmental graphics, dan display format besar.",
  },
  // Chrome halaman daftar /services
  servicesPage: {
    label: "03 / YANG KAMI DESAIN",
    heading: "Disiplin",
    description:
      "Enam praktik terintegrasi yang berjalan di bawah satu filosofi. Pilih disiplin untuk melihat cakupannya, atau buka ringkasan lengkapnya.",
    viewDetails: "Lihat Detail & Arsip",
    viewAria: (name: string) => `Lihat layanan ${name}`,
  },
  // Chrome halaman detail /services/[slug]
  servicesDetail: {
    backToServices: "Kembali ke Layanan",
    overview: "Ikhtisar Disiplin",
    approach: "Pendekatan Strategis",
    capabilities: "Kapabilitas Utama",
    deliverables: "Ruang Lingkup Hasil Kerja",
    relatedWork: "Karya Pilihan pada Disiplin Ini",
    relatedWorkEmpty: "Belum ada proyek arsip yang terkait dengan disiplin ini.",
  },
  // Chrome /insights (isi artikel tetap dalam bahasa Inggris — materieditorial)
  insights: {
    label: "04 / WAWASAN",
    pageHeading: "Wawasan",
    featured: "Publikasi Unggulan",
    readEssay: "Baca Esai",
    morePerspectives: "Perspektif Lainnya",
    viewAll: "Lihat Semua Artikel",
    readArticle: "Baca Artikel",
    backToInsights: "Kembali ke Wawasan",
    minRead: (n: number) => `${n} menit baca`,
    minReadShort: (n: number) => `${n} mnt baca`,
  },
  // Chrome detail proyek (konten proyek sendiri tetap dalam bahasa Inggris)
  projectChrome: {
    client: "Klien",
    year: "Tahun",
    industry: "Industri",
    disciplines: "Disiplin",
    highlights: "Sorotan",
    closeLightbox: "Tutup lightbox",
    previousImage: "Gambar sebelumnya",
    nextImage: "Gambar berikutnya",
    videoPresentation: "Presentasi video",
    closeVideo: "Tutup video",
    loadingDeck: "Memuat deck presentasi...",
    previousSlide: "Slide sebelumnya",
    nextSlide: "Slide berikutnya",
    toggleThumbnails: "Beralih thumbnail",
    thumbnails: "Thumbnail",
    deckAria: (label: string) => `Deck ${label}`,
  },
  // Chrome header / menu overlay
  header: {
    toggleLanguage: "Ganti bahasa",
    primaryNav: "Navigasi utama",
    toggleContact: "Beralih kanal kontak",
    openMenu: "Buka menu studio",
    closeMenu: "Tutup menu studio",
    mainNav: "Navigasi studio utama",
    cityLabel: "Malang, Indonesia",
    placeholderName: "mis. Alex Morgan",
    placeholderCompany: "mis. Studio Vertex",
    placeholderEmail: "alex@perusahaan.com",
    placeholderBrief:
      "Jelaskan singkat tujuan, audiens target, jadwal, atau tantangan utama Anda...",
  },
  // Chrome bersama contact launcher / footer
  contactChrome: {
    channelsAria: "Kanal Kontak Langsung",
    instagram: "Instagram",
    facebook: "Facebook",
    youtube: "YouTube",
  },
  // Copy disiplin — mencerminkan lib/services.ts bidang demi bidang.
  disciplines: {
    brand: {
      name: "BRAND",
      tagline: "Identitas Strategis & Sistem Visual",
      heroHeadline:
        "Merancang identitas yang abadi, memantulkan otoritas, dan membangun kepercayaan.",
      description:
        "Desain identitas visual, arsitektur brand, panduan tipografi, penamaan, dan manual brand.",
      overview:
        "Brand lebih dari sekadar logo; ia adalah bahasa visual dan emosional sebuah organisasi di dunia. Kami membangun sistem identitas menyeluruh, dari strategi dasar hingga eksekusi yang paling detail — memastikan setiap titik sentuh menyampaikan presisi, tujuan, dan keberadaan yang tak keliru.",
      approach:
        "Kami memulai dengan interogasi diagnostik terhadap posisi pasar, psikologi audiens, dan celah putih kompetitif. Dari sana kami membangun arsitektur visual yang kohesif: hierarki tipografi, palet warna yang terkalibrasi, ikonografi kustom, dan standar penerapan ketat yang perluas dengan mudah di ranah fisik maupun digital.",
      deliverables: [
        "Sistem Identitas Visual",
        "Arsitektur & Posisi Brand",
        "Sistem Logo & Logotipe",
        "Panduan Brand Komprehensif",
        "Standar Tipografi & Set Kustom",
        "Stasioner & Collateral Korporat",
      ],
      capabilities: [
        {
          title: "Arsitektur Brand",
          desc: "Menyusun sub-brand multi-tier, lini produk, dan hubungan induk korporat demi kejelasan pasar yang mutlak.",
        },
        {
          title: "Sistem Bahasa Visual",
          desc: "Mengembangkan aturan warna yang harmonis, skala tipografi, tata letak spasial, dan motif visual.",
        },
        {
          title: "Panduan & Brand Book",
          desc: "Dokumentasi teknis lengkap yang merinci zona aman, spesifikasi digital, dan standar fabrikasi.",
        },
      ],
      imageAlt: "Desain identitas brand dan sistem visual karya Utero Studio",
      inquiryLabel: "Identitas Brand",
    },
    product: {
      name: "PRODUK",
      tagline: "Kemasan & Bentuk Struktural",
      heroHeadline:
        "Merancang kemasan fisik yang terasa nyata dan meninggalkan kesan pertama yang tak terlupakan.",
      description:
        "Kemasan produk fisik, wadah struktural, desain label, dan merchandise khusus.",
      overview:
        "Kemasan adalah jabat tangan fisik antara brand Anda dan konsumen. Sebelum sebuah produk dikonsumsi atau digunakan, tangan sudah merasakan bentuk, bobot, dan jenis kertasnya. Kami merancang kemasan yang memadukan kekuatan di rak dengan kegunaan ergonomis dan kelayakan produksi.",
      approach:
        "Studio kami menganggap kemasan sebagai arsitektur brand tiga dimensi. Kami memeriksa ketahanan substrat, finishing cetak (foil stamping, spot UV, blind deboss), pencahayaan rak, penempatan informasi nutritional dan barcode sesuai regulasi, serta ritual unboxing untuk meningkatkan kegembiraan konsumen.",
      deliverables: [
        "Kemasan Primer & Sekunder",
        "Die-line Struktural Kustom",
        "Sistem Label & Artwork Botol",
        "Desain Pengalaman Unboxing",
        "Shipper Ritel & Display Box",
        "Pre-press Teknis Berkas Produksi",
      ],
      capabilities: [
        {
          title: "Rekayasa Struktural",
          desc: "Menciptakan bentuk fisik, tutup, dan geometri lipat khusus yang sesuai efisiensi material.",
        },
        {
          title: "Kalibrasi Pre-Press",
          desc: "Koordinasi langsung dengan percetakan, pencocokan pantone, dan verifikasi proof untuk memastikan nol variasi produksi.",
        },
        {
          title: "Material & Keberlanjutan",
          desc: "Menentukan kertas berkelanjutan, tinta kedelai, dan finishing dapat didaur ulang yang mendukung kelestarian lingkungan.",
        },
      ],
      imageAlt: "Desain kemasan produk dan wadah struktural karya Utero Studio",
      inquiryLabel: "Produk & Kemasan",
    },
    promotion: {
      name: "PROMOSI",
      tagline: "Kampanye Kreatif Berdampak Tinggi",
      heroHeadline:
        "Menciptakan narasi promosi yang disruptif dan menghasilkan momentum yang terukur.",
      description:
        "Kampanye peluncuran, pengembangan key visual, collateral cetak, aset media sosial, dan perangkat pemasaran.",
      overview:
        "Kampanye yang berkesan menembus kebisingan komunikasi sehari-hari dengan konsep yang lebih berani dan eksekusi yang sempurna. Kami merancang sistem key visual yang menerjemahkan ide secara mulus ke billboard skala kota, media transportasi, platform sosial, dan collateral acara yang bisa disentuh.",
      approach:
        "Setiap kampanye dimulai dengan inti naratif yang menjernihkan proposisi brand menjadi pemicu emosional yang tak terbantahkan. Selanjutnya kami kerjakan collateral lintas media yang dirancang untuk menjaga kesatuan konseptual sekaligus tetap optimal pada batasan khas setiap media.",
      deliverables: [
        "Key Visual Kampanye (KV)",
        "Narasi Peluncuran & Arah Copy",
        "Collateral Cetak & Lookbook Editorial",
        "Toolkit Sosial Digital Multi-format",
        "Display Ritel Point-of-Sale (POSM)",
        "Aset Brand Acara & Backdrop Panggung",
      ],
      capabilities: [
        {
          title: "Arsitektur Key Visual",
          desc: "Menciptakan grafis master kampanye yang fleksibel, dari layar vertikal 9:16 di ponsel hingga spanduk roadside 30 meter.",
        },
        {
          title: "Art Direction",
          desc: "Mengawasi fotografi studio, styling, ilustrasi, dan hierarki tipografi demi kohesi kampanye.",
        },
        {
          title: "Retail Merchandising (POSM)",
          desc: "Merancang display toko fisik, table-talker, dan wobbler yang memicu keputusan pembelian akhir.",
        },
      ],
      imageAlt: "Key visual kampanye promosi dan collateral cetak karya Utero Studio",
      inquiryLabel: "Promosi & Kampanye",
    },
    digital: {
      name: "DIGITAL",
      tagline: "Desain Web & Sistem Interaktif",
      heroHeadline:
        "Membangun pengalaman digital yang cepat, berkontras tinggi, dan memikat di setiap layar.",
      description:
        "Situs web modern, platform web, sistem UI/UX, desain produk digital, dan pengalaman interaktif.",
      overview:
        "Di lanskap digital, gesekan adalah ancaman fatal. Kami membuat pengalaman web khusus yang memadukan art direction editorial yang berani dengan performa sangat cepat, interaksi yang aksesibel, dan tata letak responsif yang lancar.",
      approach:
        "Kami merancang antarmuka digital menggunakan sistem tata letak berbasis tipografi, token desain modular, dan micro-interaksi yang halus. Kode kami ramping, semantik, dan dioptimalkan untuk waktu muat instan serta visibilitas mesin pencari.",
      deliverables: [
        "Situs Web Editorial Kustom",
        "Platform & Portal Web Brand",
        "Sistem Desain UI/UX & Komponen",
        "Prototipe Interaktif Responsif",
        "Search Engine Optimization (SEO)",
        "Rekayasa Frontend Berperforma Tinggi",
      ],
      capabilities: [
        {
          title: "Arsitektur Komponen Modern",
          desc: "Membangun aplikasi Next.js berbasis TypeScript yang bersih, mudah dirawat, dan disesuaikan untuk skala enterprise.",
        },
        {
          title: "Desain Interaksi & Motion",
          desc: "Menerapkan micro-animasi halus, interaksi kursor, dan transisi halaman yang meningkatkan keterlibatan pengguna.",
        },
        {
          title: "Performa & Responsivitas",
          desc: "Tanpa layout shift, aset gambar teroptimalkan, dan kelancaran lintas perangkat dari genggam hingga layar 4K.",
        },
      ],
      imageAlt: "Desain platform web digital dan antarmuka pengguna karya Utero Studio",
      inquiryLabel: "Digital & Web",
    },
    environmental: {
      name: "LINGKUNGAN",
      tagline: "Wayfinding & Desain Lingkungan",
      heroHeadline:
        "Mengubah arsitektur yang diam menjadi pengalaman spasial yang intuitif dan berpusat pada manusia.",
      description:
        "Wayfinding arsitektural, signage pusat kreatif publik, sistem petunjuk arah, branding spasial, signage indoor, graphic dinding kantor korporat, tipografi lingkungan, dan identitas visual interior.",
      overview:
        "Lingkungan fisik seharusnya menyambut, membimbing, dan mengilhami secara intuitif. Dari pusat kreatif publik landmark seperti Malang Creative Center (MCC) hingga kantor pusat korporat modern, environmental graphics kami memberi denyut visual yang intuitif pada bangunan. Ruang interior menjadi kanvas harian untuk budaya tim dan kesan klien. Kami mengembangkan sistem signage indoor, dinding fitur resepspsi, narasi ruang rapat, dan graphic ritel komersial yang menghadirkan DNA korporat ke dalam ruang fisik.",
      approach:
        "Kami survei denah arsitektur, sightline, arus lalu lintas pejalan kaki, dan kondisi pencahayaan. Wayfinding harus berfungsi mudah dalam sekali pandang sekaligus memperkuat karakter arsitektur dan kebanggaan institusional. Kami bekerja sama erat dengan desainer interior dan arsitek untuk memilih material taktil — kuningan brushed, akrilik matte, baja powder-coated, dan huruf back-lit — yang cocok sempurna dengan jadwal finishing interior.",
      deliverables: [
        "Strategi Wayfinding Utama",
        "Spesifikasi Signage Arsitektural",
        "Totem & Pylon Penunjuk Arah",
        "Mural Environmental Graphic",
        "Direktori Lantai & Penanda Ruang",
        "Spesifikasi Material, Pencahayaan & Pemasangan",
        "Dinding Identitas Resepspsi Korporat",
        "Graphic Tematis Ruang Rapat",
        "Huruf Arsitektural & Aksen Neon",
        "Tanda Keamanan & Kepatuhan Kode",
        "Papan Direktori Tenant Modular",
        "Seni Dinding Akustik & Cetak Lingkungan",
      ],
      capabilities: [
        {
          title: "Studi Sirkulasi Spasial",
          desc: "Memetakan titik keputusan dan analisis garis pandang untuk menghilangkan kebingungan navigasi di fasilitas berlantai kompleks.",
        },
        {
          title: "Integrasi Arsitektural",
          desc: "Merancang dudukan signage dan perangkat keras yang selaras dengan struktur beton, baja, kaca, dan kayu.",
        },
        {
          title: "Aksesibilitas Universal",
          desc: "Menerapkan tipografi kontras tinggi, piktogram internasional, dan skala yang terbaca untuk semua demografi pengunjung.",
        },
        {
          title: "Kerajinan Material & Pencahayaan",
          desc: "Menggabungkan LED halo-light, akrilik dipotong laser, dan aluminium brushed untuk kontras taktil premium.",
        },
        {
          title: "Sistem Pembaruan Modular",
          desc: "Merancang nama tenant dan penamaan kantor yang mudah diganti tanpa merusak finishing dinding.",
        },
        {
          title: "Graphic Budaya Tempat Kerja",
          desc: "Mengubah nilai dan pencapaian korporat menjadi mural tipografi yang mencolok di zona kolaborasi tim.",
        },
      ],
      imageAlt: "Wayfinding lingkungan dan signage arsitektural karya Utero Studio",
      inquiryLabel: "Lingkungan & Wayfinding",
    },
    outdoor: {
      name: "LUAR RUANGAN",
      tagline: "Komunikasi Publik Skala Besar",
      heroHeadline:
        "Mendominasi siluet kota dengan martabat struktural dan keterbacaan maksimal.",
      description:
        "Billboard kota, spanduk gedung, pylon arsitektural, iklan transportasi, dan instalasi perkotaan.",
      overview:
        "Media luar ruangan beroperasi pada skala monumental. Dilihat dari jarak 100 meter pada kecepatan 60 km/jam, iklan luar ruangan menuntut kontras setajam silet, tipografi yang langsung terbaca, dan kestabilan struktural dalam segala kondisi cuaca.",
      approach:
        "Pengalaman 25+ tahun kami dalam produksi iklan memberi penguasaan tak tertandingi atas fabrikasi baja, perhitungan beban angin, substrat vinyl tahan lama, tinta UV tahan cuaca, dan pencahayaan malam yang terkalibrasi.",
      deliverables: [
        "Billboard Jalan Tol & Gantry Sign Kota",
        "Pylon Arsitektural Monolitik",
        "Facade Wrap Gedung & Spanduk Raksasa",
        "Huruf Atap 3D Terbangi",
        "Gambar Rekayasa Struktural",
        "Koordinasi Perizinan & Kode Daerah",
      ],
      capabilities: [
        {
          title: "Sightline Jalan Tol & Urban",
          desc: "Menempatkan tipografi dan kontras warna untuk keterbacaan optimal pada kecepatan kendaraan dan sudut pandang jauh.",
        },
        {
          title: "Fabrikasi Struktural",
          desc: "Merancang rangka baja las, pondasi, dan kotak lampu internal yang tersegel cuaca.",
        },
        {
          title: "Produksi Tahan Lama",
          desc: "Menggunakan vinyl kelas industri, pigmentasi UV tahan pudar, dan sistem tegangan berkuat.",
        },
      ],
      imageAlt:
        "Iklan billboard luar ruangan skala besar dan pylon arsitektural karya Utero Studio",
      inquiryLabel: "Luar Ruangan Skala Besar",
    },
  },
  // Project Detail
  projectDetail: {
    allWork: "← Semua Karya",
    startProject: "Mulai Proyek →",
    overview: "Ikhtisar",
    challenge: "Tantangan",
    approach: "Pendekatan",
    scope: "Ruang Lingkup",
    deliverables: "Hasil Kerja",
    fullPresentation: "Presentasi Lengkap",
    videoComingSoon: "Video akan segera hadir",
    previous: "← Sebelumnya",
    next: "Selanjutnya →",
  },
  // Contact Page
  contact: {
    sectionLabel: "05 / MULAI PERCAKAPAN",
    heading: "Kontak",
    description: "Memiliki brand, produk, platform digital, atau ruang arsitektur yang membutuhkan tujuan? Kami berkolaborasi dengan pemimpin berani di seluruh Indonesia.",
    malang: "Malang",
    timezone: "UTC+7 · WIB",
    directWhatsApp: "Saluran WhatsApp Langsung",
    clientRelations: "Hubungan Klien",
    studioManagement: "Manajemen Studio",
    emailCommunication: "Komunikasi Email",
    malangHQ: "Markas Malang",
    operatingHours: "Jam Operasional Studio",
    projectBrief: "Brief Proyek",
    tellUsVision: "Ceritakan Visi Anda",
    interestedDisciplines: "Disiplin yang Diminati",
    name: "Nama *",
    company: "Perusahaan",
    email: "Email *",
    phone: "Telepon",
    brief: "Brief Proyek *",
    submit: "KIRIM BRIEF PROYEK",
    inquiryReceived: "Brief Diterima",
    thankYou: "Terima kasih telah menghubungi Utero Indonesia. Direktur strategi klien kami akan meninjau brief Anda dan terhubung dalam 1 hari kerja.",
    submitAnother: "Kirim Brief Lain",
    errorRequired: "Harap isi semua kolom yang wajib (*)",
    errorTryAgain: "Terjadi kesalahan. Silakan coba lagi.",
    openMaps: "Buka di Google Maps →",
  },
  // Studio Page
  studio: {
    sectionLabel: "02 / TENTANG UTERO INDONESIA",
    heading: "Studio",
    description: "Studio konsultan brand multidisiplin dan desain spasial yang didirikan di Malang pada tahun 1998. Kami menjembatani kecerdasan strategis dengan fabrikasi industri.",
    established: "Berdiri Sejak",
    metrics: {
      years: "Tahun Praktik",
      yearsSub: "Operasi berkelanjutan sejak 1998",
      disciplines: "Disiplin Terintegrasi",
      disciplinesSub: "Brand, Produk, Promosi, Digital, Lingkungan & Luar Ruangan",
      projects: "Proyek Selesai",
      projectsSub: "Korporat, Publik & Komersial",
      hq: "Markas Studio",
      hqSub: "Jawa Timur, Indonesia",
    },
    executionPhilosophy: "Filosofi Eksekusi",
    philosophyQuote: '"Ide tanpa realisasi sama dengan sampah."',
    philosophyText: "Strategi tanpa manifestasi fisik hanyalah teoritis. Selama perjalanan seperempat abad kami, Utero telah membangun reputasinya dengan menolak desain yang murni kosmetik demi eksekusi yang ketat dari awal hingga akhir. Kami mengkonseptualisasikan, membuat prototipe, merancang teknik, dan memfabrikasi.",
    integratedDisciplines: "Disiplin Terintegrasi",
    disciplinesText1: "Berbeda dengan agensi boutique khusus yang memisahkan digital dari fisik, Utero menampung desainer identitas, pengrajin kemasan industri, arsitek wayfinding spasial, dan insinyur struktur tanda di bawah satu filosofi terpadu.",
    disciplinesText2: "Baik mengembangkan wayfinding publik master untuk Malang Creative Center (MCC) atau menskalakan barang kemasan konsumen untuk distribusi nasional, tim kami memberikan kontinuitas brand yang mulus di semua dimensi sensorik.",
    culture: "Budaya & Infrastruktur Studio",
    clientSectors: "Sektor Klien yang Dilayani",
    collaborate: "Berkolaborasi dengan Utero",
    readyToSolve: "Siap menyelesaikan tantangan brand atau spasial Anda?",
    connectStudio: "Hubungkan dengan Studio Kami →",
  },
  // Footer
  footer: {
    tagline: "DESIGN AS A SOLUTION.",
    description: "Konsultan brand dan agensi desain kreatif Indonesia terkemuka. Mengubah visi menjadi kenyataan dengan keahlian strategis sejak 1998.",
    navigation: "NAVIGASI",
    whatsappInquiries: "INQUIRI VIA WHATSAPP",
    emailSocial: "EMAIL & SOSIAL",
    copyright: "© 1998 — [YEAR] UTERO.ID. Hak cipta dilindungi.",
    location: "MALANG, INDONESIA — STUDIO DESAIN KREATIF",
  },
  // Industry Labels (filter taxonomy - translated to Indonesian)
  industries: {
    corporate: "Korporat",
    fnb: "Makanan & Minuman",
    government: "Pemerintah",
    education: "Pendidikan",
    arts: "Seni & Budaya",
    services: "Jasa",
    retail: "Ritel",
    property: "Properti",
    event: "Acara",
  },
};
