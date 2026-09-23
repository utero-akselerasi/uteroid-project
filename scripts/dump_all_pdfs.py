import fitz, json, os, sys
sys.stdout.reconfigure(encoding="utf-8", errors="replace")

WORKS = r"C:\Users\hamam\uteroid-project\content\Works"
SLUGS = {
    "garageplug": "GARAGEPLUG GSM.pdf",
    "mcc": "GSM MCC Final.pdf",
    "stamford": "[SIAP PREVIEW]GSM STAMFORD INDONESIA.pdf",
    "chatten": "gsm chatten.pdf",
    "bank-sidoarjo": "Bank Sidoarjo Visual Guideline FILE FINAL_removed.pdf",
    "mie-gacoan": "GSM - MIE GACOAN_removed_removed.pdf",
    "logo-75th-indonesia": "GSM - Logo 75th Indonesia_removed.pdf",
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
    "gsm-1922": "GSM 1922 New COLOR 27 mei _removed.pdf",
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

out = {}
summary = []
for slug, fname in SLUGS.items():
    path = os.path.join(WORKS, fname)
    if not os.path.exists(path):
        summary.append(f"{slug}: MISSING PDF {fname}")
        continue
    doc = fitz.open(path)
    pages = []
    alltext = []
    for i, page in enumerate(doc):
        t = (page.get_text("text") or "").strip()
        t = " ".join(t.split())
        imgs = len(page.get_images(full=True))
        pages.append({"page": i + 1, "nchars": len(t), "nimgs": imgs, "text": t})
        if t: alltext.append(t)
    joined = " // ".join(alltext)
    out[slug] = {"pdf": fname, "pages": doc.page_count, "alltext": joined[:4000], "pages_list": pages}
    summary.append(f"{slug:22} {doc.page_count:3} pages  text_chars={len(joined):6}  :: {joined[:220]}")
    doc.close()

json.dump(out, open(r"C:\Users\hamam\uteroid-project\scripts\full_pdf_pages.json", "w", encoding="utf-8"), ensure_ascii=False)
open(r"C:\Users\hamam\uteroid-project\scripts\pdf_summary.txt", "w", encoding="utf-8").write("\n".join(summary))
print("\n".join(summary))