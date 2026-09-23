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

with open("lib/projects.ts", "r", encoding="utf-8") as f:
    ts_text = f.read()

project_blocks = re.split(r'slug:\s*"', ts_text)[1:]

projects = []
for block in project_blocks:
    slug = block.split('"')[0]
    title_m = re.search(r'title:\s*"([^"]+)"', block)
    title = title_m.group(1) if title_m else slug
    desc_m = re.search(r'description:\s*"([^"]+)"', block)
    desc = desc_m.group(1) if desc_m else ""
    gallery_m = re.search(r'galleryImages:\s*\[(.*?)\]', block, re.DOTALL)
    gallery = re.findall(r'"([^"]+)"', gallery_m.group(1)) if gallery_m else []
    
    projects.append({
        "slug": slug,
        "title": title,
        "desc": desc,
        "gallery": gallery
    })

analysis_results = []

for p in projects:
    slug = p["slug"]
    pdf_name = pdf_mapping.get(slug)
    if not pdf_name:
        continue
    pdf_path = os.path.join("content", "Works", pdf_name)
    if not os.path.exists(pdf_path):
        continue
    
    doc = pymupdf.open(pdf_path)
    
    # Read project.json if exists
    pjson_path = os.path.join("public", "projects", slug, "project.json")
    page_map = {}
    if os.path.exists(pjson_path):
        try:
            with open(pjson_path, "r", encoding="utf-8") as pj:
                pdata = json.load(pj)
                # Check structure
        except Exception:
            pass

    gallery_items_info = []
    
    for img_rel in p["gallery"]:
        fname = os.path.basename(img_rel)
        # Determine PDF page index
        # 1. Check if filename has page number e.g. 01-page-08.webp
        m_page = re.search(r'page-(\d+)', fname)
        if m_page:
            p_idx = int(m_page.group(1)) - 1
        else:
            m_num = re.search(r'^(\d+)\.webp', fname)
            if m_num:
                p_idx = int(m_num.group(1)) # 01 is page index 1 (page 2)
            else:
                p_idx = 0
                
        if p_idx >= len(doc):
            p_idx = len(doc) - 1
            
        page = doc[p_idx]
        text = page.get_text().strip()
        lines = [l.strip() for l in text.split("\n") if l.strip()]
        
        # Check image drawing elements / vector vs text
        # Count text length
        text_lower = text.lower()
        
        # Classify
        is_text_explanation = False
        text_type = ""
        
        # Look for preface / kata pengantar / latar belakang / visi misi / story logo / tentang
        if any(k in text_lower for k in ["kata pengantar", "latar belakang", "background", "visi dan misi", "visi & misi", "tentang brand", "about us", "daftar isi", "table of contents", "pendahuluan"]):
            is_text_explanation = True
            text_type = "Background / Story / Preface"
        elif "story logo" in text_lower or "filosofi logo" in text_lower or "filosofi brand" in text_lower:
            if len(text) > 60:
                is_text_explanation = True
                text_type = "Story Logo / Philosophy"
        elif len(text) > 300 and not any(k in text_lower for k in ["mockup", "signage", "stationery", "merchandise", "packaging"]):
            is_text_explanation = True
            text_type = "Long explanatory text"

        gallery_items_info.append({
            "image": img_rel,
            "filename": fname,
            "page_idx": p_idx + 1,
            "text": text,
            "is_text_explanation": is_text_explanation,
            "text_type": text_type
        })
        
    analysis_results.append({
        "slug": slug,
        "title": p["title"],
        "gallery_count": len(p["gallery"]),
        "items": gallery_items_info
    })

with open("scripts/detailed_text_slides_analysis.json", "w", encoding="utf-8") as out:
    json.dump(analysis_results, out, indent=2, ensure_ascii=False)

print(f"Analysis complete for {len(analysis_results)} projects.")
