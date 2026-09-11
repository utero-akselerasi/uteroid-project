#!/usr/bin/env python3
"""
scripts/process-pdf.py
Reusable PDF to Portfolio Case Study Asset & Metadata Ingestion Pipeline
"""

import os
import sys
import json
import base64
import argparse
from pathlib import Path

# Force UTF-8 on Windows console
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

from playwright.sync_api import sync_playwright

WORKSPACE_DIR = Path(r"C:\Users\hamam\uteroid-project")
WORKS_DIR = WORKSPACE_DIR / "content" / "Works"
OUTPUT_BASE_DIR = WORKSPACE_DIR / "public" / "projects"

# Project metadata definitions based strictly on PDF source material
PROJECT_CONFIGS = {
    "garageplug": {
        "pdf_filename": "GARAGEPLUG GSM.pdf",
        "slug": "garageplug",
        "title": "GaragePlug Indonesia",
        "client": "PT. Era Automotive Revolution",
        "year": "2024",
        "category": "Brand Identity & Design System",
        "industry": "services",
        "disciplines": ["identity", "digital", "print", "indoor", "outdoor"],
        "shortDescription": "Platform cloud terintegrasi untuk bengkel mobil dan detailing center, dilengkapi sistem pedoman identitas brand (GSM) komprehensif dari logo hingga armada transportasi.",
        "description": "GaragePlug adalah perangkat lunak berbasis cloud easy-to-use yang menyediakan platform digital end-to-end untuk bengkel mobil dan detailing center. Sebagai platform premium cloud untuk industri pelayanan otomotif yang dipercaya lebih dari 5.000 pengguna di seluruh dunia, GaragePlug berekspansi ke Indonesia di bawah naungan PT. Era Automotive Revolution. Utero merancang sistem standarisasi identitas visual (GSM) menyeluruh mencakup logogram generator tenaga, konfigurasi logo horizontal & vertikal, sistem warna hijau tua (#003D2E) dan supergraphic, sarana korporasi, seragam teknisi, merchandise, sarana penanda (totem & neonbox), media promosi, hingga livery armada transportasi.",
        "excerpt": "Platform cloud terintegrasi untuk bengkel mobil dan detailing center, dilengkapi sistem pedoman identitas brand (GSM) komprehensif dari logo hingga armada transportasi.",
        "featured": True,
        "tags": ["cloud", "automotive", "identity", "gsm", "fleet"],
        "details": {
            "scope": [
                "Pedoman Identitas Brand (GSM)",
                "Standarisasi & Grid Konstruksi Logo",
                "Palet Warna & Supergraphic",
                "Sarana Korporasi (Stationery)",
                "Seragam & Workwear",
                "Sarana Penanda (Signage)",
                "Media Periklanan",
                "Branding Armada Transportasi"
            ],
            "challenge": "Membangun sistem standarisasi identitas visual jangka panjang untuk platform teknologi otomotif global di Indonesia, menjamin konsistensi mutlak di seluruh media digital, seragam kerja, merchandise, periklanan, dan armada operasional.",
            "solution": "Mengembangkan pedoman identitas visual berbasis logogram generator yang merepresentasikan pembangkit tenaga dan penggerak energi. Dipadukan palet warna hijau tua (#003D2E) lambang pertumbuhan dan go green, sistem diterapkan secara terpadu pada sarana korporasi, apparel, penanda, hingga livery kendaraan.",
            "deliverables": [
                "Buku Pedoman Identitas Brand (GSM)",
                "Konfigurasi Logo Horizontal & Vertical",
                "Stationery (Kop Surat, Amplop, Map, Kartu Nama, ID Card)",
                "Apparel (Kemeja, Polo, Wearpack, Topi)",
                "Merchandise (Mug, Tumbler, Totebag, Jam Dinding)",
                "Sarana Penanda (Totem, Mini Totem, Neonbox)",
                "Media Iklan (Roll Banner, Umbul-umbul, Billboard, Social Media)",
                "Livery Armada (Granmax, Alphard, Bus, Box Pick Up)"
            ]
        },
        # Curated pages: Page 1 = Cover; remaining pages = visual storytelling
        "curated_pages": [
            8,   # Identitas & Logogram Generator
            10,  # Variasi Logo (Horizontal & Vertical)
            12,  # Struktur Logo (Grid Konstruksi 4x4, 13x2)
            15,  # Variasi Warna Logo Horizontal
            20,  # Variasi Warna Logo Vertical
            22,  # Palet Warna (Hijau Tua, Hijau, Hijau Muda, Hitam, Putih)
            26,  # Image Style & Direction
            27,  # Supergraphic System
            29,  # Kop Surat (Letterhead)
            30,  # Amplop (Envelope)
            31,  # Stopmap Folder
            32,  # Kartu Nama (Business Card)
            33,  # ID Card & Lanyard
            41,  # Seragam Kemeja Lengan Pendek
            45,  # Seragam Wearpack
            52,  # Tumbler Stainless
            55,  # Totebag
            58,  # Totem Signage
            60,  # Neonbox
            64,  # Roll Banner
            66,  # Billboard
            70,  # Feed Instagram
            72,  # Transportasi Granmax
            74   # Transportasi Bus
        ]
    },
    "mcc": {
        "pdf_filename": "GSM MCC Final.pdf",
        "slug": "mcc",
        "title": "Malang Creative Center",
        "client": "Malang Creative Center (MCC)",
        "year": "2023",
        "category": "Creative Hub Identity & Ambience",
        "industry": "arts",
        "disciplines": ["identity", "signage", "space", "indoor", "outdoor"],
        "shortDescription": "Pedoman grafis dan identitas visual pusat inovasi dan kolaborasi industri kreatif terbesar di Jawa Timur.",
        "description": "Malang Creative Center (MCC) adalah episentrum ekosistem kreatif Kota Malang yang mengintegrasikan 17 subsektor ekonomi kreatif. Utero merancang pedoman identitas brand komprehensif, mentransformasikan filosofi kolaborasi dan pertumbuhan kultural ke dalam sistem visual dinamis, penanda ruang, dan aplikasi lingkungan fisik.",
        "excerpt": "Pedoman grafis dan identitas visual pusat inovasi dan kolaborasi industri kreatif terbesar di Jawa Timur.",
        "featured": True,
        "tags": ["creative-hub", "culture", "identity", "spatial"],
        "details": {
            "scope": [
                "Pedoman Identitas Brand (GSM)",
                "Standarisasi Logo & Konstruksi Grid",
                "Sistem Warna & Tipografi",
                "Environmental Signage",
                "Aplikasi Media Komunikasi",
                "Elemen Grafis & Supergraphic"
            ],
            "challenge": "Merancang sistem identitas visual yang mampu merepresentasikan keberagaman 17 subsektor ekonomi kreatif dalam satu platform visual yang kohesif dan dinamis di Kota Malang.",
            "solution": "Mengembangkan sistem visual yang fleksibel dan modular berbasis identitas kultural Malang, diterapkan pada ruang fisik, penanda, dan media komunikasi di seluruh gedung MCC.",
            "deliverables": [
                "Buku Pedoman Identitas Brand (GSM)",
                "Logo & Sistem Identitas Visual",
                "Environmental Signage & Wayfinding",
                "Supergraphic System",
                "Media Komunikasi Digital & Cetak"
            ]
        },
        # Render first 20 visual pages (2..21) for gallery
        "curated_pages": list(range(2, 22))
    },
    "stamford": {
        "pdf_filename": "[SIAP PREVIEW]GSM STAMFORD INDONESIA.pdf",
        "slug": "stamford",
        "title": "Stamford Indonesia FC",
        "client": "Stamford Indonesia FC",
        "year": "2021",
        "category": "Sports Academy Brand Identity",
        "industry": "education",
        "disciplines": ["identity", "campaign", "print"],
        "shortDescription": "Identitas visual dan pedoman brand akademi sepak bola terpadu bertaraf internasional 'Beyond Dreams'.",
        "description": "Stamford Indonesia FC (SIFC) adalah pusat pelatihan sepak bola terpadu yang memadukan pendidikan formal, kurikulum Filanesia, dan lisensi AFC. Utero menyusun pedoman identitas brand dari sketsa konsep hingga implementasi jersey, apparel, dan sarana fasilitas.",
        "excerpt": "Identitas visual dan pedoman brand akademi sepak bola terpadu bertaraf internasional 'Beyond Dreams'.",
        "featured": True,
        "tags": ["sports", "academy", "football", "identity"],
        "details": {
            "scope": [
                "Konsep & Strategi Brand",
                "Identitas Logo & Maskot",
                "Sistem Warna & Tipografi",
                "Jersey & Apparel Akademi",
                "Sarana Media Promosi",
                "Fasilitas & Signage"
            ],
            "challenge": "Membangun identitas brand akademi sepak bola profesional yang mampu mengangkat citra standar internasional sekaligus merepresentasikan semangat lokal dan aspirasi generasi muda.",
            "solution": "Mengembangkan identitas visual berbasis tagline 'Beyond Dreams' dengan logotype atletik, palet warna klub yang kuat, serta sistem aplikasi menyeluruh dari jersey hingga fasilitas pelatihan.",
            "deliverables": [
                "Logo & Brand Identity System",
                "Jersey Design (Home, Away, Goalkeeper)",
                "Apparel (Jaket, Polo, Kaos Training)",
                "Sarana Media & Promosi",
                "Signage Fasilitas Akademi"
            ]
        },
        # Render first 20 visual pages (2..21) for gallery
        "curated_pages": list(range(2, 22))
    },
    "chatten": {
        "pdf_filename": "gsm chatten.pdf",
        "slug": "chatten",
        "title": "Chatten Coffee & Floats",
        "client": "Chatten Cafe",
        "year": "2023",
        "category": "F&B Visual Identity & Packaging",
        "industry": "fnb",
        "disciplines": ["identity", "packaging", "indoor"],
        "shortDescription": "Identitas visual retro pop dan pedoman packaging gerai kopi dan sajian float modern.",
        "description": "Chatten Coffee & Floats menghadirkan nuansa klasik hangat dengan sentuhan pop kontemporer. Utero menyusun pedoman identitas merek meliputi maskot, tipografi retro, kemasan produk, dan elemen interior cafe.",
        "excerpt": "Identitas visual retro pop dan pedoman packaging gerai kopi dan sajian float modern.",
        "featured": True,
        "tags": ["fnb", "coffee", "retro", "packaging"],
        "details": {
            "scope": [
                "Konsep & Strategi Brand",
                "Identitas Visual & Maskot",
                "Sistem Tipografi Retro",
                "Kemasan Produk (Packaging)",
                "Elemen Interior Cafe",
                "Media Promosi Digital"
            ],
            "challenge": "Menciptakan identitas merek yang hangat dan memorable untuk cafe kopi dan float, menonjol di tengah persaingan ketat industri F&B dengan karakter visual retro pop yang autentik.",
            "solution": "Membangun ekosistem visual berbasis maskot karakter retro yang kuat, dipadu sistem tipografi vintage dan palet warna hangat, diterapkan konsisten di seluruh kemasan, interior, dan komunikasi brand.",
            "deliverables": [
                "Logo & Brand Identity",
                "Maskot Brand",
                "Packaging System (Cup, Box, Bag)",
                "Interior Graphic Elements",
                "Social Media Kit & Template"
            ]
        },
        # Render first 20 visual pages (2..21) for gallery
        "curated_pages": list(range(2, 22))
    }
}

def process_project(browser, config, scale=2.0, max_pages=None):
    slug = config["slug"]
    pdf_path = WORKS_DIR / config["pdf_filename"]
    out_dir = OUTPUT_BASE_DIR / slug
    out_dir.mkdir(parents=True, exist_ok=True)

    print("\n---------------------------------------------------")
    print(f"Processing Project: {config['title']} ({slug})")
    print(f"PDF Source: {pdf_path}")
    print(f"Output Dir: {out_dir}")

    if not pdf_path.exists():
        print(f"ERROR: PDF file not found: {pdf_path}")
        return None

    with open(pdf_path, "rb") as f:
        pdf_b64 = base64.b64encode(f.read()).decode("utf-8")

    page = browser.new_page()
    html = f"""<!DOCTYPE html>
<html>
<head>
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
</head>
<body>
<canvas id="c"></canvas>
<script>
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  const pdfData = atob("{pdf_b64}");
  let pdfDoc = null;

  async function loadDoc() {{
    pdfDoc = await pdfjsLib.getDocument({{ data: pdfData }}).promise;
    return {{ numPages: pdfDoc.numPages }};
  }}

  async function renderPage(pageNum, scale) {{
    const p = await pdfDoc.getPage(pageNum);
    const viewport = p.getViewport({{ scale: scale }});
    const canvas = document.getElementById('c');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext('2d');
    await p.render({{ canvasContext: ctx, viewport }}).promise;
    return canvas.toDataURL('image/webp', 0.90);
  }}

  window.loadDoc = loadDoc;
  window.renderPage = renderPage;
  window.ready = true;
</script>
</body>
</html>"""
    page.set_content(html)
    page.wait_for_function("window.ready === true")
    doc_info = page.evaluate("window.loadDoc()")
    total_pages = doc_info["numPages"]
    print(f"Loaded PDF: {total_pages} pages")

    # 1. Page 1 MUST become project cover image
    print("Rendering Page 1 -> cover.webp...")
    data_url = page.evaluate("window.renderPage(1, 2.0)")
    encoded = data_url.split(",", 1)[1]
    cover_path = out_dir / "cover.webp"
    with open(cover_path, "wb") as f:
        f.write(base64.b64decode(encoded))
    print(f"✓ Cover saved: {cover_path} ({cover_path.stat().st_size} bytes)")

    cover_web_path = f"/projects/{slug}/cover.webp"

    # 2. Render curated visual gallery pages
    curated = config.get("curated_pages", [])
    if not curated or curated == [1]:
        # If not manually specified, generate first up to 10 visual pages
        pages_to_render = [i for i in range(2, min(total_pages + 1, 12))]
    else:
        pages_to_render = [p for p in curated if p != 1 and p <= total_pages]

    if max_pages:
        pages_to_render = pages_to_render[:max_pages]

    gallery_web_paths = []
    for idx, page_num in enumerate(pages_to_render, start=1):
        filename = f"{idx:02d}-page-{page_num:02d}.webp"
        target_path = out_dir / filename
        print(f"Rendering Page {page_num} -> {filename}...")
        data_url = page.evaluate(f"window.renderPage({page_num}, 2.0)")
        encoded = data_url.split(",", 1)[1]
        with open(target_path, "wb") as f:
            f.write(base64.b64decode(encoded))
        gallery_web_paths.append(f"/projects/{slug}/{filename}")

    page.close()

    # Build final project JSON structure
    project_data = {
        "slug": config["slug"],
        "title": config["title"],
        "client": config["client"],
        "year": config["year"],
        "category": config["category"],
        "industry": config["industry"],
        "disciplines": config["disciplines"],
        "shortDescription": config["shortDescription"],
        "description": config["description"],
        "excerpt": config["shortDescription"],
        "coverImage": cover_web_path,
        "heroImage": cover_web_path,
        "galleryImages": gallery_web_paths,
        "gallery": gallery_web_paths,
        "featured": config.get("featured", True),
        "tags": config.get("tags", []),
        "details": config.get("details", {})
    }

    metadata_path = out_dir / "project.json"
    with open(metadata_path, "w", encoding="utf-8") as f:
        json.dump(project_data, f, indent=2, ensure_ascii=False)

    print(f"✓ Project metadata saved: {metadata_path}")
    return project_data


def main():
    parser = argparse.ArgumentParser(description="Process Utero Work PDFs into Portfolio Case Studies")
    parser.add_argument("pdf", nargs="?", help="Specific PDF filename in content/Works or project key")
    parser.add_argument("--all", action="store_true", help="Process all 4 PDFs")
    parser.add_argument("--max-pages", type=int, default=None, help="Limit number of gallery pages to render")
    args = parser.parse_args()

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)

        if args.all:
            results = {}
            for key, cfg in PROJECT_CONFIGS.items():
                results[key] = process_project(browser, cfg, max_pages=args.max_pages)
            print(f"\nSuccessfully processed {len(results)} projects!")
        elif args.pdf:
            target_key = None
            for key, cfg in PROJECT_CONFIGS.items():
                if key == args.pdf or cfg["pdf_filename"] == args.pdf or Path(args.pdf).name == cfg["pdf_filename"]:
                    target_key = key
                    break
            if not target_key:
                print(f"ERROR: Unknown project or PDF: {args.pdf}")
                print(f"Available keys: {list(PROJECT_CONFIGS.keys())}")
                sys.exit(1)
            process_project(browser, PROJECT_CONFIGS[target_key], max_pages=args.max_pages)
        else:
            # Default: process garageplug as first example
            process_project(browser, PROJECT_CONFIGS["garageplug"], max_pages=args.max_pages)

        browser.close()

if __name__ == "__main__":
    main()
