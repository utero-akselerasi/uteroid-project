import os
# pyrefly: ignore [missing-import]
import pymupdf
# pyrefly: ignore [missing-import]
from PIL import Image
import io

def render_covers():
    works_dir = r"C:\Users\hamam\uteroid-project\content\Works"
    files = {
        "garageplug": "GARAGEPLUG GSM.pdf",
        "mcc": "GSM MCC Final.pdf",
        "stamford": "[SIAP PREVIEW]GSM STAMFORD INDONESIA.pdf",
        "chatten": "gsm chatten.pdf",
        "mie-gacoan": "GSM - MIE GACOAN_removed_removed.pdf",
    }
    
    for slug, filename in files.items():
        path = os.path.join(works_dir, filename)
        out_dir = os.path.join(r"C:\Users\hamam\uteroid-project\public\projects", slug)
        os.makedirs(out_dir, exist_ok=True)
        
        if not os.path.exists(path):
            print(f"File not found: {path}")
            continue
            
        doc = pymupdf.open(path)
        p1 = doc[0]
        pix = p1.get_pixmap(dpi=200)
        img = Image.open(io.BytesIO(pix.tobytes("png")))
        
        out_file = os.path.join(out_dir, "cover.webp")
        img.save(out_file, "WEBP", quality=92)
        print(f"Rendered cover for {slug}: {out_file} ({os.path.getsize(out_file)} bytes)")

if __name__ == "__main__":
    render_covers()
