import json, sys, os, re
sys.stdout.reconfigure(encoding="utf-8", errors="replace")

ROOT = r"C:\Users\hamam\uteroid-project"
cur = json.load(open(os.path.join(ROOT, r"scripts\current_projects.json"), encoding="utf-8"))
audit = json.load(open(os.path.join(ROOT, r"scripts\text_slides_audit_report.json"), encoding="utf-8"))
pdfs = json.load(open(os.path.join(ROOT, r"scripts\full_pdf_pages.json"), encoding="utf-8"))

curmap = {p["slug"]: p for p in cur}
auditmap = {a["slug"]: a for a in audit}

# Fix PDF mapping
pdfmap_slugs = {k: v for k, v in pdfs.items()}
print("PDFs missing in dump:", [s for s in curmap if s not in pdfmap_slugs])

for slug, p in curmap.items():
    gal = [os.path.basename(g) for g in p["galleryImages"]]
    a = auditmap.get(slug)
    ts_files = []
    if a:
        for ts in a.get("text_slides", []):
            fname = os.path.basename(ts.get("image", ""))
            if fname:
                ts_files.append((fname, ts.get("reason", ""), ts.get("estimated_page", "")))
    # text slides still IN the gallery?
    still = [(f, r, pg) for (f, r, pg) in ts_files if f in gal]
    # audit pages' list vs current gallery
    pdf = pdfmap_slugs.get(slug)
    print(f"\n== {slug}")
    print(f"   gallery={len(gal)} details={'Y' if p['hasDetails'] else '-'}")
    if still:
        print(f"   STILL_TEXT_SLIDES={len(still)}")
        for f, r, pg in still:
            print(f"     - {f}  page~{pg}  {r}")
    if pdf and slug not in pdfmap_slugs:
        pass