import os
# pyrefly: ignore [missing-import]
import pymupdf

works_dir = r"c:\Users\hamam\uteroid-project\content\Works"
out_dir = r"c:\Users\hamam\uteroid-project\scripts\temp_covers"
os.makedirs(out_dir, exist_ok=True)

slug_to_pdf = {
    "garageplug": "GARAGEPLUG GSM.pdf",
    "mcc": "GSM MCC Final.pdf",
    "stamford": "[SIAP PREVIEW]GSM STAMFORD INDONESIA.pdf",
    "chatten": "gsm chatten.pdf",
    "bank-sidoarjo": "Bank Sidoarjo Visual Guideline  FILE FINAL_removed.pdf",
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

for slug, fname in slug_to_pdf.items():
    fpath = os.path.join(works_dir, fname)
    if not os.path.exists(fpath):
        continue
    doc = pymupdf.open(fpath)
    p0 = doc[0]
    pix = p0.get_pixmap(dpi=100)
    out_path = os.path.join(out_dir, f"{slug}_p1.png")
    pix.save(out_path)
    # Also save page 2 if exists
    if len(doc) > 1:
        p1 = doc[1]
        pix1 = p1.get_pixmap(dpi=100)
        pix1.save(os.path.join(out_dir, f"{slug}_p2.png"))

print(f"Rendered all covers and page 2 to {out_dir}")
