import os
import re
import json
# pyrefly: ignore [missing-import]
import pymupdf

works_dir = r"c:\Users\hamam\uteroid-project\content\Works"
pdf_files = [f for f in os.listdir(works_dir) if f.endswith(".pdf")]

# Mapping from slug to PDF filename based on projects.ts / implementation plan
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

print("Checking each project in detail...")

for slug, fname in slug_to_pdf.items():
    fpath = os.path.join(works_dir, fname)
    if not os.path.exists(fpath):
        print(f"MISSING FILE: {fname}")
        continue
    doc = pymupdf.open(fpath)
    
    print(f"\n==================== {slug} -> {fname} (pages: {len(doc)}) ====================")
    meta = doc.metadata or {}
    print(f"Metadata: creationDate={meta.get('creationDate')}, modDate={meta.get('modDate')}, title={meta.get('title')}")
    
    # Check text across all pages for year patterns
    found_snippets = []
    for pno in range(len(doc)):
        text = doc[pno].get_text()
        for line in text.splitlines():
            line_str = line.strip()
            # check if line contains 4 digit year or date
            if re.search(r"\b(19\d\d|20\d\d)\b", line_str) or any(w in line_str.lower() for w in ["copyright", "utero", "tahun", "januari", "februari", "maret", "april", "mei", "juni", "juli", "agustus", "september", "oktober", "november", "desember"]):
                if len(line_str) < 120 and len(line_str) > 3:
                    found_snippets.append(f"P{pno+1}: {line_str}")
                    
    if found_snippets:
        print("Relevant text snippets:")
        for s in found_snippets[:15]:
            print("  ", s)
    else:
        print("No date/year text snippets found in text stream.")
