import fitz, json, os, sys

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

WORKS = r"C:\Users\hamam\uteroid-project\content\Works"
TARGETS = {
    "stamford": "[SIAP PREVIEW]GSM STAMFORD INDONESIA.pdf",
    "jmt": "VISUAL GUIDELINE JMT.pdf",
    "lacamino": "VISUAL GUIDELINE LACAMINO.pdf",
    "techlink": "visual guideline techlink.pdf",
    "sfi": "BRAND GUIDELINE SFI.pdf",
    "wajan-giok": "BRAND GUIDELINES WAJAN GIOK.pdf",
    "baiturrohman": "Baiturrohman Visual Guideline 09-10 .pdf",
    "bpr-tulungagung": "BPR TULUNGAGUNG GSM_removed.pdf",
    "rohani": "GSM - Rohani_removed.pdf",
}

out = {}
for slug, fname in TARGETS.items():
    path = os.path.join(WORKS, fname)
    if not os.path.exists(path):
        print(f"{slug}: MISSING {fname}")
        continue
    doc = fitz.open(path)
    print(f"\n===== {slug} ({fname}) — {doc.page_count} pages =====")
    for i, page in enumerate(doc):
        t = page.get_text("text") or ""
        t = " ".join(t.split())
        imgs = len(page.get_images(full=True))
        txt = t[:400]
        print(f"[p{i+1:02}] chars={len(t):5} imgs={imgs} :: {txt}")
    doc.close()