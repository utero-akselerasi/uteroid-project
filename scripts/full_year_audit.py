import os
import re
# pyrefly: ignore [missing-import]
import pymupdf

works_dir = r"c:\Users\hamam\uteroid-project\content\Works"

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

print("Slug | PDF File | Verified Year | Evidence")
print("-" * 80)

for slug, fname in slug_to_pdf.items():
    fpath = os.path.join(works_dir, fname)
    doc = pymupdf.open(fpath)
    
    # Check all pages text
    full_text = ""
    for p in doc:
        full_text += p.get_text() + "\n"
        
    # Check specific patterns
    years_found = re.findall(r"\b(201[5-9]|202[0-6])\b", full_text)
    
    # Metadata dates
    meta = doc.metadata or {}
    cdate = meta.get("creationDate", "")
    m = re.search(r"D:(20\d\d)", cdate)
    meta_year = m.group(1) if m else ""
    
    # Filename date
    fn_m = re.search(r"(20\d\d)", fname)
    fn_year = fn_m.group(1) if fn_m else ""
    
    print(f"{slug:<22} | {fname[:25]:<25} | Text: {set(years_found)} | Meta: {meta_year} | FN: {fn_year}")
