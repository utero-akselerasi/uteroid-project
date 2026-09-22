import os
# pyrefly: ignore [missing-import]
import pymupdf

works_dir = r"c:\Users\hamam\uteroid-project\content\Works"
check_slugs = {
    "garageplug": "GARAGEPLUG GSM.pdf",
    "chatten": "gsm chatten.pdf",
    "mie-gacoan": "GSM - MIE GACOAN_removed_removed.pdf",
    "ayam-goreng-nelongso": "GSM - Ayam Goreng Nelongso_removed.pdf",
    "bpr-tulungagung": "BPR TULUNGAGUNG GSM_removed.pdf",
    "bpr-artha-kanjuruhan": "GSM BPR Artha Kanjuruhan_removed.pdf",
    "uwg": "GSM UWG 26042021 PREVIEW_removed.pdf",
    "rohani": "GSM - Rohani_removed.pdf",
    "boop": "Boop Mini GSM.pdf",
    "satu-titik": "GSM MINI SATU TITIK LW.pdf",
    "momsarasa": "GSM momsarasa compres_removed.pdf",
}

for slug, fname in check_slugs.items():
    doc = pymupdf.open(os.path.join(works_dir, fname))
    print(f"\n--- {slug} ({fname}) ---")
    lines_with_numbers = []
    for pidx, page in enumerate(doc):
        t = page.get_text()
        for line in t.splitlines():
            line = line.strip()
            if any(ch.isdigit() for ch in line) or any(w in line.lower() for w in ["copyright", "utero", "tahun", "gsm", "guideline", "jan", "feb", "mar", "apr", "mei", "jun", "jul", "agu", "sep", "okt", "nov", "des"]):
                lines_with_numbers.append(f"P{pidx+1}: {line}")
    if lines_with_numbers:
        for l in lines_with_numbers[:10]:
            print(" ", l)
    else:
        print("  NO text lines matched.")
