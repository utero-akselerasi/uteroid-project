import os
# pyrefly: ignore [missing-import]
import pymupdf

works_dir = r"c:\Users\hamam\uteroid-project\content\Works"
target_files = {
    "garageplug": "GARAGEPLUG GSM.pdf",
    "mcc": "GSM MCC Final.pdf",
    "chatten": "gsm chatten.pdf",
    "mie-gacoan": "GSM - MIE GACOAN_removed_removed.pdf",
    "ayam-goreng-nelongso": "GSM - Ayam Goreng Nelongso_removed.pdf",
    "bpr-tulungagung": "BPR TULUNGAGUNG GSM_removed.pdf",
    "bpr-artha-kanjuruhan": "GSM BPR Artha Kanjuruhan_removed.pdf",
    "rohani": "GSM - Rohani_removed.pdf",
    "boop": "Boop Mini GSM.pdf",
    "satu-titik": "GSM MINI SATU TITIK LW.pdf",
}

out_dir = r"c:\Users\hamam\uteroid-project\scripts\temp_prefaces"
os.makedirs(out_dir, exist_ok=True)

for slug, fname in target_files.items():
    doc = pymupdf.open(os.path.join(works_dir, fname))
    # render page 2, 3, and last page
    pages_to_render = [1, 2, len(doc)-1]
    for pidx in pages_to_render:
        if 0 <= pidx < len(doc):
            pix = doc[pidx].get_pixmap(dpi=100)
            pix.save(os.path.join(out_dir, f"{slug}_p{pidx+1}.png"))

print("Rendered prefaces and last pages.")
