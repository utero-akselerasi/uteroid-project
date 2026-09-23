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

print(f"Total projects: {len(pdf_mapping)}")

# Read projects.ts to find current galleryImages for each project
with open("lib/projects.ts", "r", encoding="utf-8") as f:
    ts_content = f.read()

# Parse galleryImages per slug
projects_gallery = {}
project_blocks = re.split(r'slug:\s*"', ts_content)[1:]
for block in project_blocks:
    slug = block.split('"')[0]
    # find galleryImages: [ ... ]
    m = re.search(r'galleryImages:\s*\[(.*?)\]', block, re.DOTALL)
    if m:
        imgs = re.findall(r'"([^"]+)"', m.group(1))
        projects_gallery[slug] = imgs
    else:
        projects_gallery[slug] = []

print(f"Projects with gallery parsed: {len(projects_gallery)}")

report = []

for slug, pdf_name in sorted(pdf_mapping.items()):
    pdf_path = os.path.join("content", "Works", pdf_name)
    if not os.path.exists(pdf_path):
        print(f"Error: {pdf_path} not found")
        continue

    doc = pymupdf.open(pdf_path)
    current_gallery = projects_gallery.get(slug, [])

    # Let's inspect each image currently in the gallery
    text_slides_found = []
    
    for img_path in current_gallery:
        # img_path e.g. "/projects/garageplug/01-page-08.webp" or "/projects/yin-yam/01.webp"
        filename = os.path.basename(img_path)
        # Find which page number this corresponds to
        # If named "01-page-08.webp", page is 8.
        # If named "01.webp", let's check page 1 or 2.
        pno = None
        m_page = re.search(r'page-(\d+)', filename)
        if m_page:
            pno = int(m_page.group(1))
        else:
            m_num = re.search(r'^(\d+)\.webp', filename)
            if m_num:
                # usually 01.webp corresponds to page index 1 (page 2) or page 1
                # let's check project.json if exists
                pjson_path = os.path.join("public", "projects", slug, "project.json")
                if os.path.exists(pjson_path):
                    with open(pjson_path, "r", encoding="utf-8") as pj:
                        pj_data = json.load(pj)
                        # check if mapping exists
                # Or let's inspect the page in doc
                pno = int(m_num.group(1)) + 1 # 01 is usually page 2 (after cover page 1)
                if pno > len(doc):
                    pno = int(m_num.group(1))

        # Check the text on this page
        if pno and 1 <= pno <= len(doc):
            page_text = doc[pno - 1].get_text().strip()
            # Also check page pno if off by 1
            alt_text = doc[pno - 2].get_text().strip() if pno >= 2 else ""
            
            # Analyze if this page is primarily text
            lines = [l.strip() for l in page_text.split("\n") if l.strip()]
            
            # Indicators of text-explanation slides:
            # - High word count, few vector elements / illustrations
            # - Keywords: "kata pengantar", "latar belakang", "story logo", "filosofi logo", "tentang kami", "visi misi", "daftar isi", "pedoman umum"
            txt_lower = page_text.lower()
            is_text_slide = False
            reason = ""
            
            if any(k in txt_lower for k in ["kata pengantar", "latar belakang", "visi dan misi", "visi & misi", "daftar isi", "table of content"]):
                is_text_slide = True
                reason = "Documentary / Preface / TOC slide"
            elif "story logo" in txt_lower or "filosofi logo" in txt_lower or "filosofi brand" in txt_lower or "tentang brand" in txt_lower:
                # Check if it has extensive paragraph text (> 100 chars of body)
                if len(page_text) > 80:
                    is_text_slide = True
                    reason = "Logo story / philosophy explanatory text block"
            elif len(page_text) > 250:
                is_text_slide = True
                reason = f"High text density ({len(page_text)} chars)"
                
            if is_text_slide:
                text_slides_found.append({
                    "image": img_path,
                    "filename": filename,
                    "estimated_page": pno,
                    "reason": reason,
                    "text": page_text
                })

    report.append({
        "slug": slug,
        "pdf": pdf_name,
        "gallery_count": len(current_gallery),
        "text_slides": text_slides_found
    })

with open("scripts/text_slides_audit_report.json", "w", encoding="utf-8") as f:
    json.dump(report, f, indent=2, ensure_ascii=False)

print("\nAUDIT SUMMARY:")
total_text_slides = sum(len(r["text_slides"]) for r in report)
print(f"Found {total_text_slides} potential text slides across {len(report)} projects.")
for r in report:
    if r["text_slides"]:
        print(f"\n[Project: {r['slug']}] ({len(r['text_slides'])} text slides / {r['gallery_count']} total images):")
        for ts in r["text_slides"]:
            print(f"  - {ts['image']} | {ts['reason']}")
            preview = ts['text'].replace('\n', ' ')[:100]
            print(f"    Text: {preview}...")
