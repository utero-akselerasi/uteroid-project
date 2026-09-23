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

# Let's inspect each project in detail
# We want to identify images that are pure text explanation slides
# (e.g. Kata Pengantar, Latar Belakang, Story Logo paragraphs, Table of Contents)
# and keep visual application slides (signage, packaging, mockups, stationery, uniform, merchandise, posters, logo variations, color sheets)

project_evaluations = {}

for slug, pdf_name in sorted(pdf_mapping.items()):
    pdf_path = os.path.join("content", "Works", pdf_name)
    if not os.path.exists(pdf_path):
        continue
    doc = pymupdf.open(pdf_path)
    
    # Check all images in public/projects/[slug]
    img_dir = os.path.join("public", "projects", slug)
    if not os.path.exists(img_dir):
        continue
    
    images = sorted([f for f in os.listdir(img_dir) if f.endswith(".webp") and f != "cover.webp"])
    
    evaluated_images = []
    for img in images:
        # Determine page index
        m_page = re.search(r'page-(\d+)', img)
        if m_page:
            p_idx = int(m_page.group(1)) - 1
        else:
            m_num = re.search(r'^(\d+)\.webp', img)
            if m_num:
                p_idx = int(m_num.group(1)) # 01 is page 2 (index 1)
            else:
                p_idx = 0
                
        if p_idx >= len(doc):
            p_idx = len(doc) - 1
            
        page = doc[p_idx]
        txt = page.get_text().strip()
        txt_clean = " ".join(txt.split())
        txt_lower = txt.lower()
        
        # Check text classification
        is_text_slide = False
        category = "visual"
        extracted_copy = ""
        
        # Exact conditions for text-only explanatory slides:
        # 1. Kata Pengantar / Preface
        if "kata pengantar" in txt_lower or "preface" in txt_lower:
            is_text_slide = True
            category = "preface"
            extracted_copy = txt_clean
        # 2. Latar Belakang / Background / Tentang Kami / Visi & Misi
        elif any(k in txt_lower for k in ["latar belakang", "background", "tentang kami", "visi & misi", "visi dan misi"]):
            is_text_slide = True
            category = "background"
            extracted_copy = txt_clean
        # 3. Story Logo / Filosofi Logo (where it's predominantly an explanatory story paragraph)
        elif any(k in txt_lower for k in ["story logo", "filosofi logo", "filosofi brand", "makna logo"]):
            # If there's substantial story text (> 80 chars)
            if len(txt) > 80:
                is_text_slide = True
                category = "story_logo"
                extracted_copy = txt_clean
        # 4. Table of contents / Daftar Isi
        elif "daftar isi" in txt_lower or "table of content" in txt_lower:
            is_text_slide = True
            category = "toc"
            extracted_copy = txt_clean
            
        evaluated_images.append({
            "filename": img,
            "path": f"/projects/{slug}/{img}",
            "page": p_idx + 1,
            "is_text_slide": is_text_slide,
            "category": category,
            "raw_text": txt,
            "extracted_copy": extracted_copy
        })
        
    project_evaluations[slug] = {
        "slug": slug,
        "pdf": pdf_name,
        "total_images": len(images),
        "text_slides": [img for img in evaluated_images if img["is_text_slide"]],
        "visual_images": [img for img in evaluated_images if not img["is_text_slide"]],
        "all_images": evaluated_images
    }

with open("scripts/project_slide_evaluations.json", "w", encoding="utf-8") as f:
    json.dump(project_evaluations, f, indent=2, ensure_ascii=False)

print(f"Evaluated all {len(project_evaluations)} projects.")
text_slide_projects = [slug for slug, d in project_evaluations.items() if d["text_slides"]]
print(f"Projects with text slides identified: {len(text_slide_projects)}")
for slug in text_slide_projects:
    d = project_evaluations[slug]
    print(f"  - {slug}: {len(d['text_slides'])} text slides removed (remaining visual images: {len(d['visual_images'])})")
