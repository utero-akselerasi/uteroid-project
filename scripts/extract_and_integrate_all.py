import os
import json
import re
# pyrefly: ignore [missing-import]
import pymupdf

pdf_mapping = {
    "amarta-wisesa": "GSM Amarta Wisesa_removed.pdf",
    "ayam-goreng-nelongso": "GSM - Ayam Goreng Nelongso_removed.pdf",
    "baiturrohman": "Baiturrohman Visual Guideline 09-10 .pdf",
    "bank-sidoarjo": "Bank Sidoarjo Visual Guideline  FILE FINAL_removed.pdf",
    "boop": "Boop Mini GSM.pdf",
    "bpr-artha-kanjuruhan": "GSM BPR Artha Kanjuruhan_removed.pdf",
    "bpr-tulungagung": "BPR TULUNGAGUNG GSM_removed.pdf",
    "chatten": "gsm chatten.pdf",
    "cos-pleng": "COS PLENG Mini GSM .pdf",
    "dailbana": "GSM Dailbana_removed.pdf",
    "garageplug": "GARAGEPLUG GSM.pdf",
    "gsm-1922": "GSM 1922  New COLOR 27 mei  _removed.pdf",
    "jmt": "VISUAL GUIDELINE JMT.pdf",
    "kiyona": "MINI GSM KIYONA.pdf",
    "konas-2021": "GSM - KONAS 2021.pdf",
    "lacamino": "VISUAL GUIDELINE LACAMINO.pdf",
    "logo-75th-indonesia": "GSM - Logo 75th Indonesia_removed.pdf",
    "maitri": "PREV GUIDELINE MAITRI_removed.pdf",
    "mcc": "GSM MCC Final.pdf",
    "mie-gacoan": "GSM - MIE GACOAN_removed_removed.pdf",
    "momsarasa": "GSM momsarasa compres_removed.pdf",
    "plut-kumkm": "VISUAL GUIDELINE PLUT KUMKM_removed.pdf",
    "proxon": "visual guideline proxon.pdf",
    "rohani": "GSM - Rohani_removed.pdf",
    "satu-titik": "GSM MINI SATU TITIK LW.pdf",
    "sfi": "BRAND GUIDELINE SFI.pdf",
    "stamford": "[SIAP PREVIEW]GSM STAMFORD INDONESIA.pdf",
    "techlink": "visual guideline techlink.pdf",
    "uwg": "GSM UWG 26042021 PREVIEW_removed.pdf",
    "wajan-giok": "BRAND GUIDELINES WAJAN GIOK.pdf",
    "wismari": "WISMARI FINAL_removed.pdf",
    "yin-yam": "yin yam mini graphic standart manual.pdf",
}

all_projects_extracted = {}

for slug, pdf_name in sorted(pdf_mapping.items()):
    pdf_path = os.path.join("content", "Works", pdf_name)
    if not os.path.exists(pdf_path):
        continue
    doc = pymupdf.open(pdf_path)
    
    img_dir = os.path.join("public", "projects", slug)
    if not os.path.exists(img_dir):
        continue
    
    images = sorted([f for f in os.listdir(img_dir) if f.endswith(".webp") and f != "cover.webp"])
    
    slides = []
    for img in images:
        m_page = re.search(r'page-(\d+)', img)
        if m_page:
            p_idx = int(m_page.group(1)) - 1
        else:
            m_num = re.search(r'^(\d+)\.webp', img)
            if m_num:
                p_idx = int(m_num.group(1))
            else:
                p_idx = 0
        if p_idx >= len(doc):
            p_idx = len(doc) - 1
            
        page = doc[p_idx]
        txt = page.get_text().strip()
        
        slides.append({
            "img": f"/projects/{slug}/{img}",
            "filename": img,
            "page": p_idx + 1,
            "text": txt
        })
        
    all_projects_extracted[slug] = slides

with open("scripts/all_projects_slides.json", "w", encoding="utf-8") as f:
    json.dump(all_projects_extracted, f, indent=2, ensure_ascii=False)

print(f"Extracted slide data for all {len(all_projects_extracted)} projects.")
