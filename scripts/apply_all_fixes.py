import os
import json
import re

# Let's define the comprehensive updated project data with text integrated from PDF slides
# and clean gallery images (pure text slides removed)

projects_updates = {
    "garageplug": {
        "description": "GaragePlug adalah platform cloud terintegrasi untuk manajemen bengkel mobil dan detailing center modern yang dipercaya lebih dari 5.000 pengguna global. Di Indonesia, Utero merancang sistem standarisasi identitas visual (GSM) komprehensif 76 halaman mencakup logogram generator daya, supergrafik turunan geometris, palet warna hijau tua (#003D2E) melambangkan pertumbuhan bisnis, panduan fotografi monokrom terfokus, sarana korporasi, seragam teknisi, signage totem pylon, hingga livery armada operasional.",
        "remove_gallery": [
            "/projects/garageplug/04-page-15.webp",
            "/projects/garageplug/05-page-20.webp",
            "/projects/garageplug/06-page-22.webp",
            "/projects/garageplug/07-page-26.webp",
            "/projects/garageplug/08-page-27.webp"
        ],
        "challenge": "Membangun kredibilitas brand software otomotif global di pasar Indonesia dengan identitas visual yang solid, terstandarisasi, dan mudah diaplikasikan pada ragam media mulai dari antarmuka digital hingga penanda fisik bengkel berskala besar.",
        "solution": "Merancang sistem identitas visual berbasis simbol generator daya bertenaga dengan palet warna hijau tua (#003D2E) yang mencerminkan pertumbuhan bisnis dan presisi teknologi. Pedoman GSM mencakup aturan variasi logo vertikal/horizontal, supergrafik dinamis, panduan fotografi monokrom fokus obyek, seragam teknisi, dan standarisasi livery armada bergerak."
    },
    "stamford": {
        "description": "STAMFORD INDONESIA FC (SIFC) adalah Pusat Pelatihan Sepakbola Terpadu yang menyajikan perpaduan antara pendidikan sepakbola standar internasional, pengembangan kepribadian, dan pendidikan formal untuk usia 6-19 tahun. Utero merancang re-branding menyeluruh yang mengadopsi panji 'Sang Saka Getih-Getah Samudra' Kerajaan Majapahit, simbol mata pedang terhunus kebawah lambang kebijaksanaan, motif bola Piala Dunia 1938 Hindia Belanda, dan hewan endemik Komodo sebagai representasi ketangguhan dan karakter mulia.",
        "remove_gallery": [
            "/projects/stamford/02-page-03.webp",
            "/projects/stamford/04-page-05.webp",
            "/projects/stamford/07-page-08.webp",
            "/projects/stamford/08-page-09.webp"
        ],
        "challenge": "Melakukan re-branding komprehensif institusi pelatihan sepakbola terpadu untuk meningkatkan standar layanan profesional, membangun reputasi internasional, dan menanamkan nilai disiplin, etika, dan kebanggaan nasional kepada generasi muda.",
        "solution": "Mengembangkan sistem identitas visual berlapis makna historis Nusantara: panji Majapahit penanda kemenangan, pedang kebijaksanaan, bola Piala Dunia 1938, dan komodo purba, diaplikasikan pada jersey tanding, training kit, perlengkapan lapangan, modul pelatihan, sertifikat, dan media publikasi."
    },
    "bank-sidoarjo": {
        "description": "Visual Identity Guideline Bank Sidoarjo (BPR Delta Artha Perseroda) — sistem standarisasi identitas visual perbankan daerah yang modern, terpercaya, dan inklusif. Logo berbentuk lingkaran dinamis dengan perpaduan warna biru korporat dan kuning keemasan kemakmuran, dirancang untuk memperkuat ekuitas brand dan memastikan konsistensi komunikasi di seluruh kantor cabang, sarana ATM, dan media layanan nasabah.",
        "remove_gallery": [
            "/projects/bank-sidoarjo/01.webp",
            "/projects/bank-sidoarjo/02.webp"
        ],
        "challenge": "Mentransformasi citra bank perkreditan rakyat daerah menjadi entitas keuangan modern yang profesional, kompetitif, dan mudah diakses oleh seluruh lapisan masyarakat dan pelaku UMKM.",
        "solution": "Merancang pedoman identitas visual terpadu mencakup standarisasi logo lingkaran dinamis, palet warna kepercayaan finansial, sistem tipografi resmi, aplikasi buku tabungan, kartu ATM, signage kantor cabang, dan seragam layanan nasabah."
    },
    "mie-gacoan": {
        "description": "Graphic Standard Manual Mie Gacoan — pedoman identitas visual jaringan restoran mie pedas nomor satu di Indonesia. Bentuk dasar lingkaran melambangkan filosofi kemajuan berkesinambungan yang dipadukan karakter logogram mie dinamis dan logotype tegas. Menggunakan kombinasi warna cyan ceria (#00B2D8) dan magenta berani (#EC008C) untuk menghadirkan atmosfer kuliner yang energetik, menyenangkan, dan relevan dengan generasi muda.",
        "remove_gallery": [
            "/projects/mie-gacoan/01.webp"
        ],
        "challenge": "Menjaga konsistensi identitas visual brand kuliner yang berekspansi secara masif di ratusan gerai seluruh Indonesia dengan ribuan aset promosi cetak, digital, dan kemasan.",
        "solution": "Merumuskan panduan GSM ketat untuk rasio logo, zona aman, kombinasi logogram dan logotype, standarisasi warna CMYK/RGB/HEX, desain kemasan takeaway box, kantong ramah lingkungan, seragam kru resto, dan fasad outlet."
    },
    "logo-75th-indonesia": {
        "description": "Pedoman Identitas Visual Resmi Peringatan 75 Tahun Kemerdekaan Republik Indonesia (Indonesia Maju) — karya kolaborasi Satu Collective bersama Utero. Menghadirkan konfigurasi angka 75 yang dinamis dan progresif sebagai simbol pemerataan ekonomi, pembangunan maritim, dan akselerasi SDM unggul di seluruh penjuru tanah air.",
        "remove_gallery": [
            "/projects/logo-75th-indonesia/04.webp"
        ],
        "challenge": "Merancang identitas perayaan kemerdekaan nasional yang inklusif, membangkitkan optimisme kebangsaan di tengah tantangan global, dan mudah diaplikasikan secara serentak oleh seluruh kementerian, BUMN, pemda, dan masyarakat luas.",
        "solution": "Menciptakan sistem supergrafik fleksibel yang terinspirasi dari gugusan pulau dan gelombang maritim Indonesia, dilengkapi pedoman aplikasi warna monokrom dan full-color pada baliho, media digital, busana kenegaraan, dan umbul-umbul ruang publik."
    },
    "konas-2021": {
        "description": "Graphic Standard Manual KONAS PGHNAI 2021 — Kongres Nasional Perhimpunan Gastroenterologi, Hepatologi dan Nutrisi Anak Indonesia. Logo menggabungkan simbol organ pencernaan anak, stilasi bunga mekar sebagai lambang tumbuh kembang sehat, dan gelombang digital medis yang mencerminkan pertukaran riset ilmiah dokter spesialis anak di era modern.",
        "remove_gallery": [
            "/projects/konas-2021/03.webp"
        ],
        "challenge": "Menciptakan identitas visual konferensi medis tingkat nasional yang ilmiah, hangat, dan berpusat pada kesehatan anak, serta siap diaplikasikan pada platform virtual event dan materi simposium fisik.",
        "solution": "Mengembangkan logo terintegrasi dengan palet warna kesehatan terpercaya, modul buku program digital, sertifikat ber-SKP, backdrop panggung virtual, dan cinderamata pembicara internasional."
    },
    "sfi": {
        "description": "Visual Guideline Startup For Industry (SFI) — program akselerasi Kementerian Perindustrian RI bertajuk 'An Ecosystem Of Technology Solution'. Logo menggabungkan elemen heksagonal saling mengunci yang melambangkan integrasi ekosistem teknologi solusi 4.0, inovasi industri terdesentralisasi, dan kolaborasi startup teknologi dengan industri manufaktur nasional.",
        "remove_gallery": [
            "/projects/sfi/01.webp",
            "/projects/sfi/02.webp"
        ],
        "challenge": "Membangun identitas visual program pemerintah yang futuristik, kredibel, dan berdaya tarik tinggi bagi para founder startup teknologi terdepan dan pelaku industri manufaktur skala besar.",
        "solution": "Merancang struktur logo heksagonal modular dengan palet warna biru teknologi dan oranye inovasi, dilengkapi sistem aplikasi media promosi kompetisi, backdrop eksibisi industri, dan materi presentasi investor."
    },
    "wajan-giok": {
        "description": "Brand Guideline Wajan Giok — identitas visual restoran Chinese food halal bernuansa modern otentik. Visualisasi logotype mengadopsi gaya kaligrafi aksara Tionghoa (Han) yang dipadukan dengan simbol naga kayu pembawa kemakmuran, menghadirkan kehangatan sajian oriental sehari-hari yang berkelas dan ramah keluarga.",
        "remove_gallery": [
            "/projects/wajan-giok/01.webp"
        ],
        "challenge": "Memperkenalkan konsep restoran masakan Cina otentik yang halal dan ramah keluarga dengan identitas oriental yang elegan tanpa kesan kaku atau kuno.",
        "solution": "Menghadirkan paduan logotype kaligrafi Han kontemporer dengan motif naga pembawa berkah, diaplikasikan pada buku menu jilid kulit, mangkok keramik custom, sumpit, signage neonbox oriental, dan celemek koki."
    },
    "baiturrohman": {
        "description": "Pedoman Identitas Visual Baiturrokhman Tour & Travel — biro perjalanan ibadah Umroh dan Haji Khusus. Logo dirancang dengan penuh kehati-hatian untuk mencerminkan esensi ibadah: mengintegrasikan siluet kubah masjid suci, garis lengkung orbit thawaf Ka'bah, dan sayap kemudahan pelayanan dalam palet warna hijau zamrud dan emas kemuliaan.",
        "remove_gallery": [
            "/projects/baiturrohman/01.webp",
            "/projects/baiturrohman/03.webp"
        ],
        "challenge": "Membangun kepercayaan dan rasa tenang bagi calon jamaah ibadah tanah suci melalui identitas visual biro travel yang bernuansa islami, profesional, dan berkelas.",
        "solution": "Merancang sistem identitas terpadu berornamen islami kontemporer yang diaplikasikan pada koper jamaah, tas serbaguna, paspor wallet, kain seragam batik ihram, banner manasik, dan papan nama kantor operasional."
    },
    "jmt": {
        "description": "Visual Guideline JMT Lounge & Cafe — destinasi santai dan ruang komunal modern di Malang. Menggunakan maskot kura-kura yang memiliki citra positif ketenangan dan kenyamanan, merepresentasikan JMT sebagai tempat bersantai (chill) tanpa terburu-buru, sekaligus mencerminkan komitmen bisnis yang fokus pada fondasi kuat, loyalitas pelanggan, dan keberlanjutan usaha jangka panjang.",
        "remove_gallery": [
            "/projects/jmt/05.webp"
        ],
        "challenge": "Menciptakan identitas cafe dan lounge yang santai, unik, dan memiliki maskot berkarakter kuat yang mudah diingat oleh komunitas anak muda dan pekerja kreatif.",
        "solution": "Mengembangkan maskot kura-kura ikonik bergaya minimalis kontemporer, dipadukan palet warna santai, signage neonbox, coaster minuman kayu, kemasan takeaway, dan seragam staf yang casual."
    },
    "lacamino": {
        "description": "Visual Guideline Lacamino Cigar — brand cerutu premium yang terinspirasi dari rute ziarah kuno bersejarah di Spanyol, 'El Camino de Santiago' (The Way of St. James). Filosofi nama Lacamino (Jalan) mencerminkan perjalanan hidup manusia yang penuh petualangan, lika-liku, dan pencapaian elegan, diwujudkan dalam kemasan cerutu eksklusif dan pita pita cincin tembakau mewah.",
        "remove_gallery": [
            "/projects/lacamino/01.webp",
            "/projects/lacamino/02.webp",
            "/projects/lacamino/03.webp"
        ],
        "challenge": "Menghadirkan identitas brand cerutu artisanal yang memancarkan aura kemewahan klasik Eropa, ketenangan reflektif, dan cita rasa tembakau pilihan bagi penikmat cerutu berpengalaman.",
        "solution": "Merancang logotype anggun dengan ornamen garis jalan ziarah, diaplikasikan pada ring cerutu beraksen foil emas, kotak kayu cedar pernis kilap, korek pemantik mewah, kantong kulit pelindung, dan poster lounge."
    },
    "techlink": {
        "description": "Visual Guideline TechLink — identitas visual konferensi dan ekspo teknologi modern. Mengusung konsep visual yang presisi, profesional, dan futuristik dengan tipografi geometris Exo family dan grafis konektivitas simpul data, dirancang untuk mendukung gelaran pameran teknologi digital berskala nasional.",
        "remove_gallery": [
            "/projects/techlink/01.webp"
        ],
        "challenge": "Merancang sistem visual event teknologi yang adaptif terhadap berbagai platform multimedia, signage panggung megah, dan media cetak expo.",
        "solution": "Mengembangkan sistem grafis modular bergradasi neon biru-ungu dengan tipografi teknologi Exo, diaplikasikan pada lanyard ID card peserta, kartu akses VIP, backdrop panggung LED, dan booth pameran."
    },
    "proxon": {
        "description": "Visual Guideline PROXON (PT Proxima Omnia Strategy) — konsultan strategi bisnis dan manajemen korporat. Logo memadukan inisial 'P' dengan panah sudut maju, melambangkan akselerasi pertumbuhan bisnis, ketajaman analisis, dan eksekusi strategi terpadu yang berorientasi hasil bagi klien korporasi.",
        "remove_gallery": [
            "/projects/proxon/01.webp"
        ],
        "challenge": "Membangun citra firma konsultansi manajemen yang kredibel, tajam, dan setara dengan standar konsultan global.",
        "solution": "Merumuskan identitas visual minimalis tegas dengan palet warna navy otoritas dan oranye presisi, panduan kop surat resmi, map presentasi tender, kartu nama eksekutif, dan desain laporan analitik tahunan."
    },
    "kiyona": {
        "description": "Mini GSM Kiyona — brand produk perawatan kulit dan kecantikan holistik. Nama KIYONA lahir dari gabungan kata 'Kiyo' (Murni) dan 'Na' (Indah/Lembut), berpijak pada keyakinan bahwa kecantikan sejati lahir dari pemurnian diri yang otentik. Mengadaptasi bentuk Bunga Lily lambang kemurnian dan kelahiran kembali, dengan tagline 'So light, It Becomes Your Skin' serta simpul ikatan komitmen brand bersama penggunanya.",
        "remove_gallery": [
            "/projects/kiyona/01.webp"
        ],
        "challenge": "Menciptakan identitas brand kecantikan organik yang lembut, jujur, dan berdaya pikat premium di tengah ketatnya persaingan industri kosmetik lokal.",
        "solution": "Merancang simbol bunga lily bersimpul halus dengan palet warna pastel menenangkan, diaplikasikan pada botol pipet serum, jar krim kaca buram, kemasan box kosmetik emboss, tas belanja ramah lingkungan, dan etalase konter kecantikan."
    },
    "uwg": {
        "description": "Graphic Standard Manual Universitas Widyagama Malang (UWG) — standarisasi logo akronim perguruan tinggi swasta terkemuka di Malang. Mengusung simbol akronim geometris kubus pengetahuan yang mencerminkan kampus yang inovatif, berdaya saing global, dan berakar kuat pada nilai nasionalisme dan kewirausahaan.",
        "remove_gallery": [
            "/projects/uwg/01.webp"
        ],
        "challenge": "Menyederhanakan dan memodernisasi identitas visual kampus agar lebih aplikatif pada media digital, signage arsitektur kampus, dan armada transportasi tanpa menghilangkan nilai historis universitas.",
        "solution": "Merumuskan standarisasi logo akronim presisi monokrom dan warna resmi kampus, diaplikasikan pada branding bus operasional, bendera fakultas, map ijazah wisuda, kartu tanda mahasiswa (KTM), dan sistem penanda gedung perkuliahan."
    },
    "rohani": {
        "description": "Graphic Standard Manual Keripik Tempe Rohani — brand legendaris oleh-oleh khas Malang yang berdiri sejak 1988. Pedoman GSM mencakup standarisasi anatomi grid logo, sistem tipografi, aturan kontras warna latar belakang, kemasan standing pouch higienis, dan papan nama outlet pusat oleh-oleh Sanan Malang.",
        "remove_gallery": [
            "/projects/rohani/04.webp"
        ],
        "challenge": "Menata ulang identitas visual brand kuliner warisan legendaris agar tampil lebih rapi, modern, dan higienis namun tetap mempertahankan kehangatan cita rasa tradisional yang dicintai konsumen.",
        "solution": "Menstandarkan proporsi logo ikonik, kemasan oleh-oleh kedap udara bernuansa oranye hangat, seragam staf toko, kantong belanja kain, dan neonbox penanda sentra industri oleh-oleh."
    },
    "momsarasa": {
        "description": "Graphic Standard Manual Momsarasa — produsen camilan olahan kentang premium khas dataran tinggi. Rebranding Momsarasa menghadirkan karakter visual yang ramah dan hangat dengan tipografi bernuansa nostalgia pedesaan, mencerminkan keaslian bahan baku kentang pilihan yang diolah renyah dengan bumbu rempah alami warisan keluarga.",
        "remove_gallery": [
            "/projects/momsarasa/02.webp"
        ],
        "challenge": "Meningkatkan daya saing produk camilan UMKM lokal agar dapat menembus rak supermarket modern dan pasar ekspor dengan kemasan menarik dan higienis.",
        "solution": "Merancang sistem identitas visual lengkap: monogram logo kentang ramah, standarisasi kemasan zipper pouch, stiker segel toples, seragam karyawan toko, dan desain booth pameran kuliner."
    },
    "yin-yam": {
        "description": "Mini Graphic Standard Manual Yin Yam — brand kuliner street food Chinese food otentik siap saji. Visualisasi logo mengadopsi filosofi Yin & Yang (keseimbangan dan saling melengkapi) yang dipadukan dengan ornamen simbol kemakmuran Tionghoa dan tipografi aksara oriental dalam palet warna biru navy (#023473) dan merah (#F10732).",
        "remove_gallery": [
            "/projects/yin-yam/01.webp"
        ],
        "challenge": "Menciptakan identitas visual gerai makanan cepat saji oriental yang bersih, lezat, dan berkarakter kuat untuk konsep gerai takeaway dan pesan-antar online.",
        "solution": "Merancang logo segel oriental modern, kemasan paper box ramah minyak, tas jinjing takeaway, stiker segel makanan, poster promosi dinding bergaya artistik, dan panduan branding gerobak outlet."
    },
    "satu-titik": {
        "description": "Graphic Standard Manual Satu Titik Coffee and Creative Space — destinasi kafe dan ruang kreatif kolaboratif oleh PT PUS. Konsep logo menggabungkan inisial huruf 'S' yang mengadopsi bentuk uap dan leher teko seduh (kettle coffee) sebagai representasi proses seduhan kopi manual dan titik awal lahirnya ide-ide kreatif baru.",
        "remove_gallery": [
            "/projects/satu-titik/01.webp",
            "/projects/satu-titik/02.webp",
            "/projects/satu-titik/03.webp"
        ],
        "challenge": "Membangun identitas ruang kafe yang tidak hanya menjual kopi berkualitas, tetapi juga berfungsi sebagai working space dan hub kreatif bagi pegiat industri kreatif dan komunitas lokal.",
        "solution": "Mengembangkan logo berbasis teko seduh dan titik temu gagasan, diaplikasikan pada paper cup ramah lingkungan, kantong biji kopi craft, buku menu, apron barista, penanda nomor meja kayu, dan neon sign interior."
    },
    "amarta-wisesa": {
        "description": "Graphic Standard Manual CV Amarta Wisesa — perusahaan jasa konstruksi, renovasi, dan pengadaan infrastruktur sipil. Mengusung identitas visual kokoh dengan palet warna emas prestise (#D89640) dan hitam solid (#000000) yang melambangkan keandalan struktur, ketepatan waktu, dan integritas kemitraan proyek.",
        "remove_gallery": [
            "/projects/amarta-wisesa/03.webp",
            "/projects/amarta-wisesa/04.webp"
        ],
        "challenge": "Menciptakan citra perusahaan konstruksi dan kontraktor yang solid, amanah, dan berstandar profesional tinggi untuk tender proyek swasta maupun pemerintah.",
        "solution": "Merumuskan standarisasi logo geometris tegas, pedoman zona aman, kop surat perusahaan, kartu nama tim proyek, helm safety berstiker identitas, dan papan nama proyek lapangan."
    },
    "plut-kumkm": {
        "description": "Visual Guideline PLUT-KUMKM — Pusat Layanan Usaha Terpadu Koperasi dan Usaha Mikro, Kecil, dan Menengah (Kementerian Koperasi dan UKM RI). Identitas visual dirancang terpadu untuk merepresentasikan 10 bidang layanan konsultasi bisnis, pendampingan perizinan, dan pemberdayaan wirausaha di seluruh sentra daerah Indonesia.",
        "remove_gallery": [
            "/projects/plut-kumkm/02.webp",
            "/projects/plut-kumkm/03.webp"
        ],
        "challenge": "Menyusun sistem identitas visual layanan publik kementerian yang ramah, informatif, dan mudah dipahami oleh pelaku usaha kecil dan mikro di berbagai penjuru daerah.",
        "solution": "Menghadirkan ikonografi 10 bidang layanan PLUT, palet warna layanan pemerintah yang segar dan bersahabat, modul panduan konsultasi UMKM, banner sosialisasi, dan signage gedung pelayanan terpadu."
    },
    "dailbana": {
        "description": "Graphic Standard Manual PT Dailbana Prima Indonesia — perusahaan manufaktur benang bordir dan benang jahit tekstil berkualitas ekspor. Pedoman identitas visual GSM menetapkan sistem warna merah dinamis (#EC1C28) dan biru korporat (#1F4DA0) untuk memastikan konsistensi merek pada kemasan kelos benang, karton ekspor, dan materi pemasaran tekstil global.",
        "remove_gallery": [
            "/projects/dailbana/01.webp"
        ],
        "challenge": "Menstandarisasi identitas visual pabrik tekstil multinasional agar memiliki tampilan kemasan produk yang presisi, mudah diidentifikasi di lini produksi garmen, dan konsisten di pasar internasional.",
        "solution": "Merancang pedoman warna dan tipografi resmi, label stiker kelos benang, kardus kemasan berstandar ekspor, kartu nama manajemen, dan papan nama pabrik manufaktur."
    }
}

# Now let's update lib/projects.ts
with open("lib/projects.ts", "r", encoding="utf-8") as f:
    code = f.read()

# For each project in updates, let's update its fields in lib/projects.ts
for slug, u in projects_updates.items():
    # Find the block for this slug
    m = re.search(r'(slug:\s*"' + re.escape(slug) + r'",.*?)(?=\n  // ──|\n  \{|\n\];)', code, re.DOTALL)
    if not m:
        print(f"Block not found for slug {slug}")
        continue
        
    block = m.group(1)
    new_block = block
    
    # Update description if present
    if "description" in u:
        new_block = re.sub(r'description:\s*"[^"]*"', f'description:\n      "{u["description"]}"', new_block)
        
    # Update galleryImages: remove files listed in remove_gallery
    if "remove_gallery" in u:
        rem_set = set(u["remove_gallery"])
        m_gal = re.search(r'galleryImages:\s*\[(.*?)\]', new_block, re.DOTALL)
        if m_gal:
            gal_items = re.findall(r'"([^"]+)"', m_gal.group(1))
            filtered_items = [it for it in gal_items if it not in rem_set]
            formatted_gal = 'galleryImages: [\n' + ',\n'.join(f'      "{it}"' for it in filtered_items) + ',\n    ]'
            new_block = new_block[:m_gal.start()] + formatted_gal + new_block[m_gal.end():]
            
    # If project details exist or can be updated/added:
    if "challenge" in u and "solution" in u:
        # Check if details exists in new_block
        if "details:" in new_block:
            # Update challenge & solution inside details
            new_block = re.sub(r'challenge:\s*"[^"]*"', f'challenge:\n        "{u["challenge"]}"', new_block)
            new_block = re.sub(r'solution:\s*"[^"]*"', f'solution:\n        "{u["solution"]}"', new_block)
        else:
            # Add details object before the end of the block
            details_str = f''',
    details: {{
      scope: [
        "Brand Identity & Positioning",
        "Visual Standard Manual",
        "Corporate & Marketing Assets",
        "Packaging & Environmental Design",
      ],
      challenge:
        "{u['challenge']}",
      solution:
        "{u['solution']}",
      deliverables: [
        "Buku Pedoman Standar Identitas Visual",
        "Sistem Logo & Palet Warna Resmi",
        "Aplikasi Desain Kemasan & Promosi",
        "Standarisasi Material & Penerapan Media",
      ],
    }}'''
            # Insert before last closing brace/comma
            # find last tags or featured
            m_insert = re.search(r'tags:\s*\[[^\]]*\],?', new_block)
            if m_insert:
                idx = m_insert.end()
                new_block = new_block[:idx] + details_str + new_block[idx:]

    code = code[:m.start(1)] + new_block + code[m.end(1):]

# Ensure yin-yam coverImage is "/projects/yin-yam/cover.webp"
code = re.sub(r'slug:\s*"yin-yam",.*?coverImage:\s*"[^"]*"', lambda m: m.group(0).replace(m.group(0).split('coverImage: "')[1].split('"')[0], '/projects/yin-yam/cover.webp'), code, flags=re.DOTALL)

with open("lib/projects.ts", "w", encoding="utf-8") as f:
    f.write(code)

print("Successfully updated lib/projects.ts with all enriched copy and filtered galleries!")
