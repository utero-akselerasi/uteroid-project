import os
import glob
from playwright.sync_api import sync_playwright

def inspect_pdfs():
    works_dir = r"C:\Users\hamam\uteroid-project\content\Works"
    pdf_files = glob.glob(os.path.join(works_dir, "*.pdf"))
    
    print(f"Found {len(pdf_files)} PDF files:")
    for p in pdf_files:
        size_mb = os.path.getsize(p) / (1024 * 1024)
        print(f" - {os.path.basename(p)} ({size_mb:.2f} MB)")

if __name__ == "__main__":
    inspect_pdfs()
