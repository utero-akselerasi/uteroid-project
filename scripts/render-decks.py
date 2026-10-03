#!/usr/bin/env python3
"""
scripts/render-decks.py
Render project PDFs (already manually watermarked) directly into the
public/projects/<slug>/deck/ asset format used by PDFDeckSlider.

Output per page (matches existing decks):
  - full:  PDF point size x SCALE  (default 2.0)  -> deck/NNN.webp
  - thumb: THUMB_WIDTH px wide                    -> deck/thumbs/NNN.webp
  - deck/manifest.json { slug, total_pages, deck_images, aspect_ratios, thumbnails }

No watermarking is performed except for OPTIONAL per-project stamping
(--stamp) which overlays the manually-applied Utero mark on PDFs that
were delivered clean (currently only brandidentity-logo73.pdf).

Usage:
  python scripts/render-decks.py --all
  python scripts/render-decks.py --replacements
  python scripts/render-decks.py --new
  python scripts/render-decks.py --slugs garageplug,lacamino
"""

import argparse
import io
import json
import shutil
import sys
from pathlib import Path

import pymupdf
from PIL import Image

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

WORKSPACE = Path(r"C:\Users\hamam\uteroid-project")
PDF_DIR = WORKSPACE / "public" / "pdf slides"
OUTPUT_BASE = WORKSPACE / "public" / "projects"

SCALE = 2.0
THUMB_WIDTH = 120
QUALITY = 78

# slug -> source PDF filename (public/pdf slides)
REPLACEMENTS = {
    "baiturrohman": "Baiturrohman Visual Guideline 09-10 .pdf",
    "bank-sidoarjo": "Bank Sidoarjo Visual Guideline  FILE FINAL.pdf",
    "boop": "Boop Mini GSM.pdf",
    "bpr-tulungagung": "BPR TULUNGAGUNG GSM.pdf",
    "sfi": "BRAND GUIDELINE SFI.pdf",
    "wajan-giok": "BRAND GUIDELINES WAJAN GIOK.pdf",
    "cos-pleng": "COS PLENG Mini GSM .pdf",
    "garageplug": "GARAGEPLUG GSM.pdf",
    "ayam-goreng-nelongso": "GSM - Ayam Goreng Nelongso.pdf",
    "konas-2021": "GSM - KONAS 2021.pdf",
    "mie-gacoan": "GSM - MIE GACOAN.pdf",
    "rohani": "GSM - Rohani.pdf",
    "gsm-1922": "GSM 1922  New COLOR 27 mei  .pdf",
    "amarta-wisesa": "GSM Amarta Wisesa.pdf",
    "bpr-artha-kanjuruhan": "GSM BPR Artha Kanjuruhan.pdf",
    "chatten": "gsm chatten.pdf",
    "dailbana": "GSM Dailbana.pdf",
    "mcc": "GSM MCC Final.pdf",
    "satu-titik": "GSM MINI SATU TITIK LW.pdf",
    "momsarasa": "GSM momsarasa compres.pdf",
    "uwg": "GSM UWG 26042021 PREVIEW.pdf",
    "kiyona": "MINI GSM KIYONA.pdf",
    "maitri": "PREV GUIDELINE MAITRI.pdf",
    "jmt": "VISUAL GUIDELINE JMT.pdf",
    "lacamino": "VISUAL GUIDELINE LACAMINO.pdf",
    "plut-kumkm": "VISUAL GUIDELINE PLUT KUMKM.pdf",
    "proxon": "visual guideline proxon.pdf",
    "techlink": "visual guideline techlink.pdf",
    "yin-yam": "yin yam mini graphic standart manual.pdf",
    "stamford": "[SIAP PREVIEW]GSM STAMFORD INDONESIA.pdf",
    "wismari": "WISMARI FINAL.pdf",
}

# slug -> { pdf, stamp }
NEW_PROJECTS = {
    "logo-73-indonesia": {"pdf": "brandidentity-logo73.pdf", "stamp": True},
    "latobas-cigar": {"pdf": "latobas cigar.pdf", "stamp": False},
    "dhika-universe": {"pdf": "GSM - Dhika Universe.pdf", "stamp": False},
}

# The manually-applied Utero watermark is a dedicated 877x204 image XObject
# embedded in every delivered PDF. We reuse that exact asset when stamping.
STAMP_REFERENCE_PDF = "GSM - MIE GACOAN.pdf"  # 842x595pt, matches logo73 page size
STAMP_WIDTH_RATIO = 0.55  # of page width (confirmed across delivered PDFs)


def extract_stamp_rgba() -> bytes:
    """Return the manually-applied Utero watermark as an RGBA PNG.

    The stamp is stored as a base RGB image plus a separate SMask; both must
    be combined so the overlay keeps the same (very low) opacity as the
    watermarked PDFs it was lifted from.
    """
    doc = pymupdf.open(PDF_DIR / STAMP_REFERENCE_PDF)
    page = doc[0]
    for xref, *_ in page.get_images(full=True):
        info = doc.extract_image(xref)
        if info["width"] != 877 or info["height"] != 204:
            continue
        base = Image.open(io.BytesIO(info["image"])).convert("RGB")
        rgba = base.convert("RGBA")
        smask = info.get("smask")
        if smask:
            sinfo = doc.extract_image(smask)
            alpha = Image.open(io.BytesIO(sinfo["image"])).convert("L")
            rgba.putalpha(alpha)
        buf = io.BytesIO()
        rgba.save(buf, format="PNG")
        doc.close()
        return buf.getvalue()
    doc.close()
    raise RuntimeError("Reference watermark (877x204) not found")


def render_pdf(pdf_path: Path, slug: str, stamp_png: bytes | None = None) -> dict:
    out_dir = OUTPUT_BASE / slug / "deck"
    thumbs_dir = out_dir / "thumbs"
    if out_dir.exists():
        shutil.rmtree(out_dir)
    thumbs_dir.mkdir(parents=True, exist_ok=True)

    doc = pymupdf.open(pdf_path)
    total = doc.page_count
    deck_images, thumbs, ratios = [], [], []

    if stamp_png is not None:
        # Stamp the PDF itself so PyMuPDF embeds the image's SMask/alpha
        # exactly the way the delivered watermarked PDFs do.
        for i in range(total):
            pr = doc[i].rect
            sw = STAMP_WIDTH_RATIO * pr.width
            sh = sw * 204.0 / 877.0
            x0 = pr.x0 + (pr.width - sw) / 2
            y0 = pr.y0 + (pr.height - sh) / 2
            doc[i].insert_image(
                pymupdf.Rect(x0, y0, x0 + sw, y0 + sh), stream=stamp_png, overlay=True
            )

    for i in range(total):
        page = doc[i]
        pix = page.get_pixmap(matrix=pymupdf.Matrix(SCALE, SCALE), alpha=False)
        img = Image.frombytes("RGB", (pix.width, pix.height), pix.samples)

        name = f"{i + 1:03d}.webp"
        img.save(out_dir / name, "WEBP", quality=QUALITY, method=6)
        deck_images.append(f"/projects/{slug}/deck/{name}")
        ratios.append(round(img.width / img.height, 10))

        th = img.resize((THUMB_WIDTH, max(1, round(THUMB_WIDTH * img.height / img.width))), Image.LANCZOS)
        th.save(thumbs_dir / name, "WEBP", quality=QUALITY, method=6)
        thumbs.append(f"/projects/{slug}/deck/thumbs/{name}")

        print(f"  {slug} {name} ({img.width}x{img.height})")

    doc.close()

    manifest = {
        "slug": slug,
        "total_pages": total,
        "deck_images": deck_images,
        "aspect_ratios": ratios,
        "thumbnails": thumbs,
    }
    (out_dir / "manifest.json").write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    print(f"  -> {slug}: {total} pages, manifest written")
    return manifest


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--all", action="store_true")
    ap.add_argument("--replacements", action="store_true")
    ap.add_argument("--new", action="store_true")
    ap.add_argument("--slugs", type=str, default="")
    args = ap.parse_args()

    jobs: list[tuple[str, Path, bytes | None]] = []
    stamp_png = None

    if args.all or args.replacements:
        for slug, fname in REPLACEMENTS.items():
            jobs.append((slug, PDF_DIR / fname, None))
    if args.all or args.new:
        for slug, cfg in NEW_PROJECTS.items():
            if cfg["stamp"]:
                if stamp_png is None:
                    stamp_png = extract_stamp_rgba()
                jobs.append((slug, PDF_DIR / cfg["pdf"], stamp_png))
            else:
                jobs.append((slug, PDF_DIR / cfg["pdf"], None))

    if args.slugs:
        wanted = {s.strip() for s in args.slugs.split(",") if s.strip()}
        mapping = dict(REPLACEMENTS)
        new_files = {k: v["pdf"] for k, v in NEW_PROJECTS.items()}
        for slug in wanted:
            if slug in mapping:
                jobs.append((slug, PDF_DIR / mapping[slug], None))
            elif slug in new_files:
                cfg = NEW_PROJECTS[slug]
                if cfg["stamp"] and stamp_png is None:
                    stamp_png = extract_stamp_rgba()
                jobs.append((slug, PDF_DIR / cfg["pdf"], stamp_png if cfg["stamp"] else None))
            else:
                print(f"!! unknown slug: {slug}")

    if not jobs:
        ap.error("nothing selected; use --all/--replacements/--new/--slugs")

    print(f"Rendering {len(jobs)} deck(s)...")
    for slug, pdf, stamp in jobs:
        if not pdf.exists():
            print(f"!! MISSING PDF for {slug}: {pdf}")
            continue
        print(f"[{slug}] {pdf.name}")
        render_pdf(pdf, slug, stamp)
    print("Done.")


if __name__ == "__main__":
    main()
