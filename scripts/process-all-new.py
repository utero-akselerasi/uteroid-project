#!/usr/bin/env python3
"""
scripts/process-all-new.py
Process all 28 new project PDFs into portfolio case study assets.
Uses the same Playwright + pdf.js pipeline as process-pdf.py.

Run:
  python scripts/process-all-new.py
  python scripts/process-all-new.py --slug bank-sidoarjo   (single project)
  python scripts/process-all-new.py --skip-existing        (skip if cover.webp already exists)
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
WORKS_DIR     = WORKSPACE_DIR / "content" / "Works"
OUTPUT_BASE   = WORKSPACE_DIR / "public" / "projects"

# ─────────────────────────────────────────────────────────────────────
# Project configs — 28 new PDFs
# Metadata is filled strictly from what the PDF filename / cover reveals.
# Fields that require reading the PDF body are left as empty strings
# and must be filled manually after review.
# ─────────────────────────────────────────────────────────────────────
NEW_PROJECTS = [
    {
        "slug": "bpr-tulungagung",
        "pdf": "BPR TULUNGAGUNG GSM_removed.pdf",
        "title": "BPR Tulungagung",
        "client": "BPR Tulungagung",
        "year": "",
        "category": "Brand Identity & Visual Guideline",
        "industry": "corporate",
        "disciplines": ["identity", "print"],
        "shortDescription": "Pedoman identitas visual Bank Perkreditan Rakyat Tulungagung.",
        "description": "Pedoman identitas visual Bank Perkreditan Rakyat (BPR) Tulungagung — mencakup standarisasi logo, warna, tipografi, dan aplikasi media komunikasi resmi.",
        "tags": ["banking", "identity", "gsm"],
        "max_pages": 15,
    },
    {
        "slug": "sfi",
        "pdf": "BRAND GUIDELINE SFI.pdf",
        "title": "SFI",
        "client": "SFI",
        "year": "",
        "category": "Brand Identity & Visual Guideline",
        "industry": "corporate",
        "disciplines": ["identity", "print"],
        "shortDescription": "Pedoman identitas brand SFI — sistem visual korporasi komprehensif.",
        "description": "Pedoman identitas brand SFI yang mencakup sistem visual korporasi komprehensif dari standarisasi logo hingga aplikasi media komunikasi.",
        "tags": ["identity", "corporate", "gsm"],
        "max_pages": 15,
    },
    {
        "slug": "wajan-giok",
        "pdf": "BRAND GUIDELINES WAJAN GIOK.pdf",
        "title": "Wajan Giok",
        "client": "Wajan Giok",
        "year": "",
        "category": "F&B Brand Identity & Visual Guideline",
        "industry": "fnb",
        "disciplines": ["identity", "packaging", "print"],
        "shortDescription": "Pedoman identitas brand kuliner Wajan Giok — sistem visual F&B yang kuat.",
        "description": "Pedoman identitas visual brand kuliner Wajan Giok, mencakup standarisasi logo, sistem warna, tipografi, kemasan, dan aplikasi media promosi.",
        "tags": ["fnb", "identity", "packaging", "gsm"],
        "max_pages": 15,
    },
    {
        "slug": "baiturrohman",
        "pdf": "Baiturrohman Visual Guideline 09-10 .pdf",
        "title": "Baiturrohman",
        "client": "Baiturrohman",
        "year": "",
        "category": "Institutional Visual Guideline",
        "industry": "government",
        "disciplines": ["identity", "print"],
        "shortDescription": "Pedoman identitas visual institusi Baiturrohman.",
        "description": "Pedoman identitas visual institusi Baiturrohman — standarisasi logo, warna, tipografi, dan panduan penggunaan identitas resmi.",
        "tags": ["institutional", "identity", "visual-guideline"],
        "max_pages": 15,
    },
    {
        "slug": "bank-sidoarjo",
        "pdf": "Bank Sidoarjo Visual Guideline  FILE FINAL_removed.pdf",
        "title": "Bank Sidoarjo",
        "client": "Bank Sidoarjo",
        "year": "",
        "category": "Banking Brand Identity & Visual Guideline",
        "industry": "corporate",
        "disciplines": ["identity", "print", "outdoor"],
        "shortDescription": "Pedoman identitas visual Bank Sidoarjo — standarisasi brand perbankan daerah.",
        "description": "Pedoman identitas visual Bank Sidoarjo yang komprehensif mencakup standarisasi logo, sistem warna korporasi, tipografi, sarana komunikasi, dan aplikasi periklanan.",
        "tags": ["banking", "identity", "corporate", "gsm"],
        "max_pages": 15,
    },
    {
        "slug": "boop",
        "pdf": "Boop Mini GSM.pdf",
        "title": "Boop",
        "client": "Boop",
        "year": "",
        "category": "Brand Identity & Mini GSM",
        "industry": "retail",
        "disciplines": ["identity", "print"],
        "shortDescription": "Mini GSM identitas brand Boop — panduan visual ringkas dan aplikatif.",
        "description": "Mini Graphic Standard Manual (GSM) brand Boop — pedoman identitas visual ringkas yang mencakup standarisasi logo, warna, dan panduan penggunaan identitas.",
        "tags": ["identity", "mini-gsm", "retail"],
        "max_pages": 12,
    },
    {
        "slug": "cos-pleng",
        "pdf": "COS PLENG Mini GSM .pdf",
        "title": "Cos Pleng",
        "client": "Cos Pleng",
        "year": "",
        "category": "F&B Brand Identity & Mini GSM",
        "industry": "fnb",
        "disciplines": ["identity", "print"],
        "shortDescription": "Mini GSM identitas brand kuliner Cos Pleng.",
        "description": "Mini Graphic Standard Manual (GSM) brand Cos Pleng — panduan identitas visual ringkas untuk brand kuliner, mencakup logo, warna, dan tipografi.",
        "tags": ["fnb", "identity", "mini-gsm"],
        "max_pages": 12,
    },
    {
        "slug": "ayam-goreng-nelongso",
        "pdf": "GSM - Ayam Goreng Nelongso_removed.pdf",
        "title": "Ayam Goreng Nelongso",
        "client": "Ayam Goreng Nelongso",
        "year": "",
        "category": "F&B Brand Identity & Visual Guideline",
        "industry": "fnb",
        "disciplines": ["identity", "packaging", "print", "outdoor"],
        "shortDescription": "Pedoman identitas visual brand kuliner Ayam Goreng Nelongso.",
        "description": "Graphic Standard Manual brand Ayam Goreng Nelongso — mencakup standarisasi identitas visual, sistem warna, tipografi, kemasan, seragam, dan media promosi untuk jaringan kuliner.",
        "tags": ["fnb", "identity", "packaging", "gsm"],
        "max_pages": 15,
    },
    {
        "slug": "konas-2021",
        "pdf": "GSM - KONAS 2021.pdf",
        "title": "KONAS 2021",
        "client": "KONAS 2021",
        "year": "2021",
        "category": "Event Visual Identity & Guideline",
        "industry": "event",
        "disciplines": ["identity", "campaign", "print"],
        "shortDescription": "Pedoman identitas visual event KONAS 2021.",
        "description": "Graphic Standard Manual event KONAS 2021 — sistem identitas visual event nasional mencakup logo, warna, tipografi, dan aplikasi media promosi.",
        "tags": ["event", "identity", "campaign", "2021"],
        "max_pages": 15,
    },
    {
        "slug": "logo-75th-indonesia",
        "pdf": "GSM - Logo 75th Indonesia_removed.pdf",
        "title": "Logo HUT ke-75 RI",
        "client": "HUT ke-75 Republik Indonesia",
        "year": "2020",
        "category": "National Anniversary Visual Identity",
        "industry": "government",
        "disciplines": ["identity", "campaign", "print"],
        "shortDescription": "Pedoman penggunaan logo resmi peringatan Hari Ulang Tahun ke-75 Republik Indonesia.",
        "description": "Graphic Standard Manual logo peringatan HUT ke-75 Republik Indonesia — panduan penggunaan logo resmi, sistem warna merah-putih, dan aplikasi media komunikasi nasional.",
        "tags": ["government", "national", "identity", "indonesia", "2020"],
        "max_pages": 15,
    },
    {
        "slug": "mie-gacoan",
        "pdf": "GSM - MIE GACOAN_removed.pdf",
        "title": "Mie Gacoan",
        "client": "Mie Gacoan",
        "year": "",
        "category": "F&B Brand Identity & Visual Guideline",
        "industry": "fnb",
        "disciplines": ["identity", "packaging", "print", "outdoor"],
        "shortDescription": "Pedoman identitas visual brand kuliner Mie Gacoan.",
        "description": "Graphic Standard Manual brand Mie Gacoan — sistem identitas visual brand mie populer Indonesia mencakup logo, warna, tipografi, kemasan, dan aplikasi gerai.",
        "tags": ["fnb", "identity", "packaging", "gsm"],
        "max_pages": 15,
    },
    {
        "slug": "rohani",
        "pdf": "GSM - Rohani_removed.pdf",
        "title": "Rohani",
        "client": "Rohani",
        "year": "",
        "category": "Brand Identity & Visual Guideline",
        "industry": "retail",
        "disciplines": ["identity", "print"],
        "shortDescription": "Pedoman identitas visual brand Rohani.",
        "description": "Graphic Standard Manual brand Rohani — standarisasi identitas visual komprehensif mencakup logo, warna, tipografi, dan panduan aplikasi media.",
        "tags": ["identity", "gsm", "brand"],
        "max_pages": 15,
    },
    {
        "slug": "gsm-1922",
        "pdf": "GSM 1922  New COLOR 27 mei  _removed.pdf",
        "title": "1922",
        "client": "1922",
        "year": "",
        "category": "Brand Identity & Visual Guideline",
        "industry": "corporate",
        "disciplines": ["identity", "print"],
        "shortDescription": "Pedoman identitas visual brand 1922 dengan sistem warna baru.",
        "description": "Graphic Standard Manual brand 1922 — sistem identitas visual terbaru dengan palet warna yang diperbarui, mencakup standarisasi logo, tipografi, dan panduan aplikasi.",
        "tags": ["identity", "gsm", "corporate"],
        "max_pages": 15,
    },
    {
        "slug": "amarta-wisesa",
        "pdf": "GSM Amarta Wisesa_removed.pdf",
        "title": "Amarta Wisesa",
        "client": "Amarta Wisesa",
        "year": "",
        "category": "Property Brand Identity & Visual Guideline",
        "industry": "property",
        "disciplines": ["identity", "print", "outdoor"],
        "shortDescription": "Pedoman identitas visual properti Amarta Wisesa.",
        "description": "Graphic Standard Manual Amarta Wisesa — sistem identitas visual properti komprehensif mencakup logo, warna, tipografi, sarana korporasi, dan aplikasi media pemasaran.",
        "tags": ["property", "identity", "gsm"],
        "max_pages": 15,
    },
    {
        "slug": "bpr-artha-kanjuruhan",
        "pdf": "GSM BPR Artha Kanjuruhan_removed.pdf",
        "title": "BPR Artha Kanjuruhan",
        "client": "BPR Artha Kanjuruhan",
        "year": "",
        "category": "Banking Brand Identity & Visual Guideline",
        "industry": "corporate",
        "disciplines": ["identity", "print"],
        "shortDescription": "Pedoman identitas visual Bank Perkreditan Rakyat Artha Kanjuruhan.",
        "description": "Graphic Standard Manual BPR Artha Kanjuruhan — pedoman standarisasi identitas visual perbankan rakyat mencakup logo, warna korporasi, tipografi, dan media komunikasi.",
        "tags": ["banking", "identity", "corporate", "gsm"],
        "max_pages": 15,
    },
    {
        "slug": "dailbana",
        "pdf": "GSM Dailbana_removed.pdf",
        "title": "Dailbana",
        "client": "Dailbana",
        "year": "",
        "category": "Brand Identity & Visual Guideline",
        "industry": "retail",
        "disciplines": ["identity", "packaging", "print"],
        "shortDescription": "Pedoman identitas visual brand Dailbana.",
        "description": "Graphic Standard Manual brand Dailbana — sistem identitas visual komprehensif mencakup standarisasi logo, warna, tipografi, kemasan, dan panduan aplikasi media.",
        "tags": ["identity", "gsm", "brand"],
        "max_pages": 15,
    },
    {
        "slug": "satu-titik",
        "pdf": "GSM MINI SATU TITIK LW.pdf",
        "title": "Satu Titik",
        "client": "Satu Titik",
        "year": "",
        "category": "Brand Identity & Mini GSM",
        "industry": "services",
        "disciplines": ["identity", "print"],
        "shortDescription": "Mini GSM identitas visual brand Satu Titik.",
        "description": "Mini Graphic Standard Manual brand Satu Titik — panduan identitas visual ringkas mencakup logo, warna, tipografi, dan panduan penggunaan identitas.",
        "tags": ["identity", "mini-gsm", "services"],
        "max_pages": 12,
    },
    {
        "slug": "uwg",
        "pdf": "GSM UWG 26042021 PREVIEW_removed.pdf",
        "title": "UWG",
        "client": "UWG",
        "year": "2021",
        "category": "Brand Identity & Visual Guideline",
        "industry": "education",
        "disciplines": ["identity", "print", "digital"],
        "shortDescription": "Pedoman identitas visual UWG (Universitas Widyagama).",
        "description": "Graphic Standard Manual UWG — standarisasi identitas visual institusi pendidikan mencakup logo, warna, tipografi, sarana korporasi, dan media komunikasi.",
        "tags": ["education", "identity", "gsm", "university", "2021"],
        "max_pages": 15,
    },
    {
        "slug": "momsarasa",
        "pdf": "GSM momsarasa compres_removed.pdf",
        "title": "Momsarasa",
        "client": "Momsarasa",
        "year": "",
        "category": "F&B Brand Identity & Visual Guideline",
        "industry": "fnb",
        "disciplines": ["identity", "packaging", "print"],
        "shortDescription": "Pedoman identitas visual brand makanan Momsarasa.",
        "description": "Graphic Standard Manual brand Momsarasa — sistem identitas visual brand kuliner ibu dan anak mencakup logo, warna, tipografi, kemasan, dan media promosi.",
        "tags": ["fnb", "identity", "packaging", "gsm"],
        "max_pages": 15,
    },
    {
        "slug": "kiyona",
        "pdf": "MINI GSM KIYONA.pdf",
        "title": "Kiyona",
        "client": "Kiyona",
        "year": "",
        "category": "Brand Identity & Mini GSM",
        "industry": "retail",
        "disciplines": ["identity", "packaging", "print"],
        "shortDescription": "Mini GSM identitas visual brand Kiyona.",
        "description": "Mini Graphic Standard Manual brand Kiyona — pedoman identitas visual ringkas mencakup logo, warna, tipografi, kemasan, dan panduan penggunaan identitas.",
        "tags": ["identity", "mini-gsm", "retail"],
        "max_pages": 15,
    },
    {
        "slug": "maitri",
        "pdf": "PREV GUIDELINE MAITRI_removed.pdf",
        "title": "Maitri",
        "client": "Maitri",
        "year": "",
        "category": "Brand Identity & Visual Guideline",
        "industry": "services",
        "disciplines": ["identity", "print"],
        "shortDescription": "Pedoman identitas visual brand Maitri.",
        "description": "Pedoman identitas visual brand Maitri — standarisasi logo, sistem warna, tipografi, dan panduan aplikasi media komunikasi.",
        "tags": ["identity", "gsm", "brand"],
        "max_pages": 15,
    },
    {
        "slug": "jmt",
        "pdf": "VISUAL GUIDELINE JMT.pdf",
        "title": "JMT",
        "client": "JMT",
        "year": "",
        "category": "Brand Identity & Visual Guideline",
        "industry": "corporate",
        "disciplines": ["identity", "print", "outdoor"],
        "shortDescription": "Pedoman identitas visual JMT — sistem brand korporasi komprehensif.",
        "description": "Visual Guideline JMT — standarisasi identitas visual korporasi komprehensif mencakup logo, warna, tipografi, sarana komunikasi, dan aplikasi media.",
        "tags": ["corporate", "identity", "visual-guideline"],
        "max_pages": 15,
    },
    {
        "slug": "lacamino",
        "pdf": "VISUAL GUIDELINE LACAMINO.pdf",
        "title": "La Camino",
        "client": "La Camino",
        "year": "",
        "category": "Property & Hospitality Visual Guideline",
        "industry": "property",
        "disciplines": ["identity", "print", "indoor", "outdoor"],
        "shortDescription": "Pedoman identitas visual properti dan hospitality La Camino.",
        "description": "Visual Guideline La Camino — sistem identitas visual properti dan hospitality premium mencakup logo, warna, tipografi, signage, dan aplikasi lingkungan.",
        "tags": ["property", "hospitality", "identity", "visual-guideline"],
        "max_pages": 15,
    },
    {
        "slug": "plut-kumkm",
        "pdf": "VISUAL GUIDELINE PLUT KUMKM_removed.pdf",
        "title": "PLUT KUMKM",
        "client": "PLUT KUMKM",
        "year": "",
        "category": "Government Institution Visual Guideline",
        "industry": "government",
        "disciplines": ["identity", "signage", "print"],
        "shortDescription": "Pedoman identitas visual PLUT KUMKM — pusat layanan usaha terpadu koperasi dan UMKM.",
        "description": "Visual Guideline PLUT (Pusat Layanan Usaha Terpadu) KUMKM — standarisasi identitas visual lembaga pemerintah pemberdayaan koperasi dan usaha mikro, kecil, menengah.",
        "tags": ["government", "identity", "signage", "umkm"],
        "max_pages": 15,
    },
    {
        "slug": "wismari",
        "pdf": "WISMARI FINAL_removed.pdf",
        "title": "Wismari",
        "client": "Wismari",
        "year": "",
        "category": "Property Brand Identity & Visual Guideline",
        "industry": "property",
        "disciplines": ["identity", "print", "outdoor"],
        "shortDescription": "Pedoman identitas visual properti Wismari.",
        "description": "Graphic Standard Manual Wismari — sistem identitas visual properti komprehensif mencakup logo, warna, tipografi, sarana korporasi, dan media pemasaran properti.",
        "tags": ["property", "identity", "gsm"],
        "max_pages": 15,
    },
    {
        "slug": "proxon",
        "pdf": "visual guideline proxon.pdf",
        "title": "Proxon",
        "client": "Proxon",
        "year": "",
        "category": "Brand Identity & Visual Guideline",
        "industry": "services",
        "disciplines": ["identity", "digital", "print"],
        "shortDescription": "Pedoman identitas visual brand Proxon.",
        "description": "Visual Guideline Proxon — standarisasi identitas visual brand mencakup logo, sistem warna, tipografi, dan panduan aplikasi digital dan media cetak.",
        "tags": ["identity", "digital", "visual-guideline"],
        "max_pages": 15,
    },
    {
        "slug": "techlink",
        "pdf": "visual guideline techlink.pdf",
        "title": "Techlink",
        "client": "Techlink",
        "year": "",
        "category": "Technology Brand Identity & Visual Guideline",
        "industry": "services",
        "disciplines": ["identity", "digital", "print"],
        "shortDescription": "Pedoman identitas visual brand teknologi Techlink.",
        "description": "Visual Guideline Techlink — standarisasi identitas visual brand teknologi mencakup logo, sistem warna, tipografi digital, dan panduan aplikasi media.",
        "tags": ["technology", "identity", "digital", "visual-guideline"],
        "max_pages": 15,
    },
    {
        "slug": "yin-yam",
        "pdf": "yin yam mini graphic standart manual.pdf",
        "title": "Yin Yam",
        "client": "Yin Yam",
        "year": "",
        "category": "F&B Brand Identity & Mini GSM",
        "industry": "fnb",
        "disciplines": ["identity", "packaging", "print", "indoor"],
        "shortDescription": "Mini GSM identitas visual brand F&B Yin Yam.",
        "description": "Mini Graphic Standard Manual brand Yin Yam — pedoman identitas visual brand kuliner mencakup logo, warna, tipografi, kemasan, dan elemen interior.",
        "tags": ["fnb", "identity", "packaging", "mini-gsm"],
        "max_pages": 15,
    },
]


def process_project(browser, config, skip_existing=False):
    slug     = config["slug"]
    pdf_file = config["pdf"]
    pdf_path = WORKS_DIR / pdf_file
    out_dir  = OUTPUT_BASE / slug

    print(f"\n{'─'*55}")
    print(f"  {slug}  →  {pdf_file}")

    if not pdf_path.exists():
        print(f"  ERROR: PDF not found: {pdf_path}")
        return None

    out_dir.mkdir(parents=True, exist_ok=True)

    cover_path = out_dir / "cover.webp"
    if skip_existing and cover_path.exists():
        print(f"  SKIP (cover.webp already exists)")
        return config["slug"]

    # Read & encode PDF
    with open(pdf_path, "rb") as f:
        pdf_b64 = base64.b64encode(f.read()).decode("utf-8")

    page = browser.new_page()
    page.set_default_timeout(90_000)   # 90s for large PDFs

    html = f"""<!DOCTYPE html>
<html>
<head>
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
</head>
<body>
<canvas id="c"></canvas>
<script>
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  const pdfData = atob("{pdf_b64}");
  let pdfDoc = null;
  async function loadDoc() {{
    pdfDoc = await pdfjsLib.getDocument({{ data: pdfData }}).promise;
    return {{ numPages: pdfDoc.numPages }};
  }}
  async function renderPage(pageNum, scale) {{
    const p        = await pdfDoc.getPage(pageNum);
    const viewport = p.getViewport({{ scale: scale }});
    const canvas   = document.getElementById('c');
    canvas.width   = viewport.width;
    canvas.height  = viewport.height;
    const ctx      = canvas.getContext('2d');
    await p.render({{ canvasContext: ctx, viewport }}).promise;
    return canvas.toDataURL('image/webp', 0.88);
  }}
  window.loadDoc    = loadDoc;
  window.renderPage = renderPage;
  window.ready      = true;
</script>
</body>
</html>"""

    try:
        page.set_content(html)
        page.wait_for_function("window.ready === true", timeout=30_000)
        doc_info    = page.evaluate("window.loadDoc()")
        total_pages = doc_info["numPages"]
        print(f"  Pages: {total_pages}")

        # 1. Cover (page 1)
        data_url = page.evaluate("window.renderPage(1, 2.0)")
        encoded  = data_url.split(",", 1)[1]
        with open(cover_path, "wb") as f:
            f.write(base64.b64decode(encoded))
        print(f"  ✓ cover.webp ({cover_path.stat().st_size // 1024}KB)")

        # 2. Gallery pages 2 .. min(max_pages+1, total_pages+1)
        max_gallery = min(config.get("max_pages", 15), total_pages - 1)
        gallery_paths = []

        for idx in range(max_gallery):
            page_num = idx + 2           # pages start at 2
            if page_num > total_pages:
                break
            filename    = f"{idx+1:02d}.webp"
            target_path = out_dir / filename
            data_url    = page.evaluate(f"window.renderPage({page_num}, 2.0)")
            encoded     = data_url.split(",", 1)[1]
            with open(target_path, "wb") as f:
                f.write(base64.b64decode(encoded))
            gallery_paths.append(f"/projects/{slug}/{filename}")
            print(f"  ✓ {filename}  (page {page_num})")

        # 3. Write project.json
        project_data = {
            "slug":             slug,
            "title":            config["title"],
            "client":           config["client"],
            "year":             config.get("year", ""),
            "category":         config["category"],
            "industry":         config["industry"],
            "disciplines":      config["disciplines"],
            "shortDescription": config["shortDescription"],
            "description":      config["description"],
            "excerpt":          config["shortDescription"],
            "coverImage":       f"/projects/{slug}/cover.webp",
            "heroImage":        f"/projects/{slug}/cover.webp",
            "galleryImages":    gallery_paths,
            "gallery":          gallery_paths,
            "featured":         False,
            "tags":             config.get("tags", []),
            "details":          {},
        }
        meta_path = out_dir / "project.json"
        with open(meta_path, "w", encoding="utf-8") as f:
            json.dump(project_data, f, indent=2, ensure_ascii=False)
        print(f"  ✓ project.json written")

    except Exception as e:
        print(f"  ERROR during rendering: {e}")
        page.close()
        return None

    page.close()
    return slug


def main():
    parser = argparse.ArgumentParser(
        description="Process all 28 new Utero project PDFs into portfolio assets."
    )
    parser.add_argument(
        "--slug",
        help="Process only the project with this slug",
        default=None,
    )
    parser.add_argument(
        "--skip-existing",
        action="store_true",
        help="Skip projects whose cover.webp already exists",
    )
    args = parser.parse_args()

    projects_to_run = NEW_PROJECTS
    if args.slug:
        projects_to_run = [p for p in NEW_PROJECTS if p["slug"] == args.slug]
        if not projects_to_run:
            print(f"ERROR: No project with slug '{args.slug}' found.")
            valid = [p["slug"] for p in NEW_PROJECTS]
            print(f"Valid slugs: {valid}")
            sys.exit(1)

    succeeded = []
    failed    = []

    with sync_playwright() as pw:
        browser = pw.chromium.launch(headless=True)

        for cfg in projects_to_run:
            result = process_project(browser, cfg, skip_existing=args.skip_existing)
            if result:
                succeeded.append(result)
            else:
                failed.append(cfg["slug"])

        browser.close()

    print(f"\n{'='*55}")
    print(f"DONE:  {len(succeeded)} succeeded,  {len(failed)} failed")
    if failed:
        print(f"FAILED: {failed}")
    print(f"{'='*55}")


if __name__ == "__main__":
    main()
