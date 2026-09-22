import os
# pyrefly: ignore [missing-import]
import pymupdf
# pyrefly: ignore [missing-import]
from PIL import Image
import io

def test_render():
    pdf_path = r"C:\Users\hamam\uteroid-project\content\Works\GARAGEPLUG GSM.pdf"
    out_dir = r"C:\Users\hamam\uteroid-project\public\projects\garageplug"
    os.makedirs(out_dir, exist_ok=True)
    
    if not os.path.exists(pdf_path):
        print(f"PDF not found: {pdf_path}")
        return
        
    doc = pymupdf.open(pdf_path)
    p1 = doc[0]
    pix = p1.get_pixmap(dpi=200)
    img = Image.open(io.BytesIO(pix.tobytes("png")))
    
    cover_path = os.path.join(out_dir, "cover.webp")
    img.save(cover_path, "WEBP", quality=92)
    print(f"Cover written successfully: {cover_path}, size: {os.path.getsize(cover_path)} bytes")

if __name__ == "__main__":
    test_render()
