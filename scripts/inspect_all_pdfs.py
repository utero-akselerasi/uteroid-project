import os
import base64
import json
from playwright.sync_api import sync_playwright

def inspect_all_pdfs():
    works_dir = r"C:\Users\hamam\uteroid-project\content\Works"
    files = [
        "GARAGEPLUG GSM.pdf",
        "GSM MCC Final.pdf",
        "[SIAP PREVIEW]GSM STAMFORD INDONESIA.pdf",
        "gsm chatten.pdf"
    ]
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        
        for filename in files:
            path = os.path.join(works_dir, filename)
            with open(path, "rb") as f:
                b64 = base64.b64encode(f.read()).decode("utf-8")
                
            page = browser.new_page()
            html = """<!DOCTYPE html>
<html>
<head>
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
</head>
<body>
<script>
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  async function inspect(b64Data) {
    const pdf = await pdfjsLib.getDocument({ data: atob(b64Data) }).promise;
    let pageCount = pdf.numPages;
    let samples = [];
    for (let i = 1; i <= Math.min(10, pageCount); i++) {
      const p = await pdf.getPage(i);
      const text = await p.getTextContent();
      const str = text.items.map(it => it.str).join(" ");
      if (str.trim().length > 0) {
        samples.push({ page: i, text: str.replace(/\\s+/g, ' ').trim().substring(0, 150) });
      }
    }
    return { pageCount, samples };
  }
  window.inspect = inspect;
</script>
</body>
</html>"""
            page.set_content(html)
            page.wait_for_load_state("networkidle")
            info = page.evaluate("window.inspect", b64)
            print(f"\n==========================================")
            print(f"FILE: {filename}")
            print(f"Total Pages: {info['pageCount']}")
            for s in info['samples']:
                print(f"  Page {s['page']}: {s['text']}")
            page.close()

        browser.close()

if __name__ == "__main__":
    inspect_all_pdfs()
