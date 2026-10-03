#!/usr/bin/env python3
"""
scripts/generate-pdf-decks.py
Render all PDF pages to WebP for full presentation decks
"""

import os
import sys
import json
import base64
import argparse
from pathlib import Path
from typing import Dict, Any

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

# Map project slugs to PDF filenames
PROJECT_PDF_MAP = {
    "garageplug": "GARAGEPLUG GSM.pdf",
    "mcc": "GSM MCC Final.pdf",
    "stamford": "[SIAP PREVIEW]GSM STAMFORD INDONESIA.pdf",
    "chatten": "gsm chatten.pdf",
    "bank-sidoarjo": "Bank Sidoarjo Visual Guideline  FILE FINAL_removed.pdf",
    "mie-gacoan": "GSM - MIE GACOAN_removed_removed.pdf",
    "ayam-goreng-nelongso": "GSM - Ayam Goreng Nelongso_removed.pdf",
    "konas-2021": "GSM - KONAS 2021.pdf",
    "sfi": "BRAND GUIDELINE SFI.pdf",
    "wajan-giok": "BRAND GUIDELINES WAJAN GIOK.pdf",
    "bpr-tulungagung": "BPR TULUNGAGUNG GSM_removed.pdf",
    "bpr-artha-kanjuruhan": "GSM BPR Artha Kanjuruhan_removed.pdf",
    "baiturrohman": "Baiturrohman Visual Guideline 09-10 .pdf",
    "jmt": "VISUAL GUIDELINE JMT.pdf",
    "lacamino": "VISUAL GUIDELINE LACAMINO.pdf",
    "techlink": "visual guideline techlink.pdf",
    "proxon": "visual guideline proxon.pdf",
    "kiyona": "MINI GSM KIYONA.pdf",
    "uwg": "GSM UWG 26042021 PREVIEW_removed.pdf",
    "rohani": "GSM - Rohani_removed.pdf",
    "gsm-1922": "GSM 1922  New COLOR 27 mei  _removed.pdf",
    "momsarasa": "GSM momsarasa compres_removed.pdf",
    "yin-yam": "yin yam mini graphic standart manual.pdf",
    "cos-pleng": "COS PLENG Mini GSM .pdf",
    "boop": "Boop Mini GSM.pdf",
    "maitri": "PREV GUIDELINE MAITRI_removed.pdf",
    "satu-titik": "GSM MINI SATU TITIK LW.pdf",
    "amarta-wisesa": "GSM Amarta Wisesa_removed.pdf",
    "plut-kumkm": "VISUAL GUIDELINE PLUT KUMKM_removed.pdf",
    "dailbana": "GSM Dailbana_removed.pdf",
    "wismari": "WISMARI FINAL_removed.pdf",
}

def process_pdf_deck(browser, slug: str, pdf_filename: str, scale: float = 2.0):
    """Process a single PDF to generate deck images and manifest"""
    pdf_path = WORKS_DIR / pdf_filename
    deck_dir = OUTPUT_BASE_DIR / slug / "deck"
    thumbs_dir = deck_dir / "thumbs"
    
    deck_dir.mkdir(parents=True, exist_ok=True)
    thumbs_dir.mkdir(parents=True, exist_ok=True)
    
    print(f"\n{'='*60}")
    print(f"Processing: {slug}")
    print(f"PDF: {pdf_filename}")
    print(f"Output: {deck_dir}")
    
    if not pdf_path.exists():
        print(f"❌ ERROR: PDF not found: {pdf_path}")
        return None
    
    # Load PDF
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
    try {{
      pdfDoc = await pdfjsLib.getDocument({{ data: pdfData }}).promise;
      return {{ numPages: pdfDoc.numPages, error: null }};
    }} catch (e) {{
      return {{ numPages: 0, error: e.message }};
    }}
  }}

  async function renderPage(pageNum, scale) {{
    const p = await pdfDoc.getPage(pageNum);
    const viewport = p.getViewport({{ scale: scale }});
    const canvas = document.getElementById('c');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext('2d');
    await p.render({{ canvasContext: ctx, viewport }}).promise;
    return {{
      dataUrl: canvas.toDataURL('image/webp', 0.75),
      width: viewport.width,
      height: viewport.height
    }};
  }}

  window.loadDoc = loadDoc;
  window.renderPage = renderPage;
  window.ready = true;
</script>
</body>
</html>"""
    page.set_content(html)
    
    # Wait for PDF.js to load with longer timeout
    try:
        page.wait_for_function("window.ready === true", timeout=60000)
    except Exception as e:
        print(f"❌ ERROR: Timeout waiting for PDF.js to load: {e}")
        page.close()
        return None
    doc_info = page.evaluate("window.loadDoc()")
    total_pages = doc_info["numPages"]
    print(f"📄 Total pages: {total_pages}")
    
    # Process each page
    deck_images = []
    aspect_ratios = []
    
    for page_num in range(1, total_pages + 1):
        filename = f"{page_num:03d}.webp"
        thumb_filename = f"{page_num:03d}.webp"
        deck_path = deck_dir / filename
        thumb_path = thumbs_dir / thumb_filename
        
        print(f"  Rendering page {page_num}/{total_pages}...")
        
        # Render full-size deck image (1600px wide approx)
        result = page.evaluate(f"window.renderPage({page_num}, {scale})")
        data_url = result["dataUrl"]
        encoded = data_url.split(",", 1)[1]
        
        with open(deck_path, "wb") as f:
            f.write(base64.b64decode(encoded))
        
        # Calculate aspect ratio
        width = result["width"]
        height = result["height"]
        aspect_ratio = width / height
        aspect_ratios.append(aspect_ratio)
        
        # Render thumbnail (240px wide)
        thumb_scale = 240 / width
        thumb_result = page.evaluate(f"window.renderPage({page_num}, {thumb_scale})")
        thumb_data_url = thumb_result["dataUrl"]
        thumb_encoded = thumb_data_url.split(",", 1)[1]
        
        with open(thumb_path, "wb") as f:
            f.write(base64.b64decode(thumb_encoded))
        
        deck_images.append(f"/projects/{slug}/deck/{filename}")
        
        print(f"    ✓ {filename} ({deck_path.stat().st_size} bytes)")
        print(f"    ✓ thumb/{thumb_filename} ({thumb_path.stat().st_size} bytes)")
    
    page.close()
    
    # Generate manifest
    manifest = {
        "slug": slug,
        "total_pages": total_pages,
        "deck_images": deck_images,
        "aspect_ratios": aspect_ratios,
        "thumbnails": [f"/projects/{slug}/deck/thumbs/{i+1:03d}.webp" for i in range(total_pages)]
    }
    
    manifest_path = deck_dir / "manifest.json"
    with open(manifest_path, "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2, ensure_ascii=False)
    
    print(f"✓ Manifest saved: {manifest_path}")
    
    # Calculate total size
    total_size = sum(f.stat().st_size for f in deck_dir.glob("*.webp"))
    thumbs_size = sum(f.stat().st_size for f in thumbs_dir.glob("*.webp"))
    print(f"📊 Deck size: {total_size / 1024 / 1024:.2f} MB")
    print(f"📊 Thumbnails size: {thumbs_size / 1024 / 1024:.2f} MB")
    
    return {
        "slug": slug,
        "total_pages": total_pages,
        "deck_size_mb": total_size / 1024 / 1024,
        "thumbs_size_mb": thumbs_size / 1024 / 1024,
        "total_size_mb": (total_size + thumbs_size) / 1024 / 1024
    }

def main():
    parser = argparse.ArgumentParser(description="Generate PDF deck images for all projects")
    parser.add_argument("--slug", help="Process specific project slug only")
    parser.add_argument("--pdf", help="Override the PDF filename (content/Works) for --slug")
    parser.add_argument("--scale", type=float, default=2.0, help="Render scale (default: 2.0)")
    args = parser.parse_args()
    
    # Filter projects to process
    if args.slug:
        if args.slug not in PROJECT_PDF_MAP:
            print(f"❌ ERROR: Unknown slug: {args.slug}")
            print(f"Available slugs: {list(PROJECT_PDF_MAP.keys())}")
            sys.exit(1)
        pdf_filename = args.pdf or PROJECT_PDF_MAP[args.slug]
        if args.pdf and not (WORKS_DIR / args.pdf).exists():
            print(f"❌ ERROR: PDF not found in content/Works: {WORKS_DIR / args.pdf}")
            sys.exit(1)
        projects_to_process = {args.slug: pdf_filename}
    else:
        if args.pdf:
            print("❌ ERROR: --pdf requires --slug")
            sys.exit(1)
        projects_to_process = PROJECT_PDF_MAP
    
    results = []
    missing_pdfs = []
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        
        for slug, pdf_filename in projects_to_process.items():
            pdf_path = WORKS_DIR / pdf_filename
            if not pdf_path.exists():
                print(f"⚠️  WARNING: PDF not found for {slug}: {pdf_filename}")
                missing_pdfs.append({"slug": slug, "pdf": pdf_filename})
                continue
            
            result = process_pdf_deck(browser, slug, pdf_filename, args.scale)
            if result:
                results.append(result)
        
        browser.close()
    
    # Summary
    print(f"\n{'='*60}")
    print("SUMMARY")
    print(f"{'='*60}")
    print(f"✓ Successfully processed: {len(results)} projects")
    
    if missing_pdfs:
        print(f"⚠️  Missing PDFs: {len(missing_pdfs)}")
        for item in missing_pdfs:
            print(f"   - {item['slug']}: {item['pdf']}")
    
    total_size = sum(r["total_size_mb"] for r in results)
    print(f"\n📊 Total storage used: {total_size:.2f} MB")
    
    # Per-project breakdown
    print("\nPer-project breakdown:")
    for r in results:
        print(f"  {r['slug']}: {r['total_pages']} pages, {r['total_size_mb']:.2f} MB")
    
    # Save summary
    summary_path = WORKSPACE_DIR / "scripts" / "deck-generation-summary.json"
    with open(summary_path, "w", encoding="utf-8") as f:
        json.dump({
            "processed": results,
            "missing": missing_pdfs,
            "total_size_mb": total_size
        }, f, indent=2, ensure_ascii=False)
    print(f"\n✓ Summary saved: {summary_path}")

if __name__ == "__main__":
    main()
