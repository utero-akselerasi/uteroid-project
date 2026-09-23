import fitz, json, os, sys, re
sys.stdout.reconfigure(encoding="utf-8", errors="replace")
ROOT = r"C:\Users\hamam\uteroid-project"
WORKS = os.path.join(ROOT, r"content\Works")
MAP = {
    "bank-sidoarjo": "Bank Sidoarjo Visual Guideline  FILE FINAL_removed.pdf",
    "gsm-1922": "GSM 1922  New COLOR 27 mei  _removed.pdf",
}
pdfs = json.load(open(os.path.join(ROOT, r"scripts\full_pdf_pages.json"), encoding="utf-8"))
for slug, fname in MAP.items():
    path = os.path.join(WORKS, fname)
    if not os.path.exists(path):
        print("MISSING", fname)
        continue
    doc = fitz.open(path)
    alltext = []
    pages = []
    for i, page in enumerate(doc):
        t = (page.get_text("text") or "").strip()
        t = " ".join(t.split())
        imgs = len(page.get_images(full=True))
        pages.append({"page": i + 1, "nchars": len(t), "nimgs": imgs, "text": t})
        if t:
            alltext.append(t)
    pdfs[slug] = {"pdf": fname, "pages": doc.page_count, "alltext": " // ".join(alltext)[:4000], "pages_list": pages}
    print(slug, doc.page_count, "pages", len(" ".join(alltext)), "chars")
    for pg in pages:
        print("  p%02d nchars=%4d nimgs=%2d :: %s" % (pg["page"], pg["nchars"], pg["nimgs"], pg["text"][:70]))
    doc.close()
json.dump(pdfs, open(os.path.join(ROOT, r"scripts\full_pdf_pages.json"), "w", encoding="utf-8"), ensure_ascii=False)