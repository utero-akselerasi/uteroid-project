import os
import re
import json
# pyrefly: ignore [missing-import]
import pymupdf

works_dir = r"c:\Users\hamam\uteroid-project\content\Works"
pdf_files = [f for f in os.listdir(works_dir) if f.endswith(".pdf")]

print(f"Total PDFs found: {len(pdf_files)}")

results = {}

for fname in sorted(pdf_files):
    fpath = os.path.join(works_dir, fname)
    doc = pymupdf.open(fpath)
    meta = doc.metadata or {}
    
    # search text in all pages
    page_texts = {}
    all_text = ""
    for i in range(len(doc)):
        t = doc[i].get_text()
        if t.strip():
            page_texts[i + 1] = t.strip()
            all_text += f"\n--- Page {i+1} ---\n" + t.strip()

    # extract 4-digit years 2015-2026
    years_in_text = re.findall(r"\b(201[5-9]|202[0-6])\b", all_text)
    years_in_fname = re.findall(r"(201[5-9]|202[0-6])", fname)
    
    # Check creationDate
    c_date = meta.get("creationDate", "")
    m_date = meta.get("modDate", "")
    
    results[fname] = {
        "pages": len(doc),
        "years_in_text": sorted(list(set(years_in_text))),
        "years_in_fname": sorted(list(set(years_in_fname))),
        "creation_date": c_date,
        "mod_date": m_date,
        "text_sample": {p: page_texts[p][:250] for p in list(page_texts.keys())[:5]},
        "full_text_len": len(all_text)
    }

with open(r"c:\Users\hamam\uteroid-project\scripts\pdf_audit_results.json", "w", encoding="utf-8") as f:
    json.dump(results, f, indent=2, ensure_ascii=False)

print("Audit complete! Saved to scripts/pdf_audit_results.json")
