import os
import base64
from playwright.sync_api import sync_playwright

def render_covers():
    works_dir = r"C:\Users\hamam\uteroid-project\content\Works"
    files = {
        "garageplug": "GARAGEPLUG GSM.pdf",
        "mcc": "GSM MCC Final.pdf",
        "stamford": "[SIAP PREVIEW]GSM STAMFORD INDONESIA.pdf",
        "chatten": "gsm chatten.pdf"
    }
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        
        for slug, filename in files.items():
            path = os.path.join(works_dir, filename)
            out_dir = os.path.join(r"C:\Users\hamam\uteroid-project\public\projects", slug)
            os.makedirs(out_dir, exist_ok=True)
            
            with open(path, "rb") as f:
                b64 = base64.b64encode(f.read()).decode("utf-8")
                
            html = f"""<!DOCTYPE html>
<html>
<head>
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
</head>
<body>
<canvas id="c"></canvas>
<script>
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  async function renderP1() {{
    const pdf = await pdfjsLib.getDocument({{ data: atob("{b64}") }}).promise;
    const p1 = await pdf.getPage(1);
    const viewport = p1.getViewport({{ scale: 2.0 }});
    const canvas = document.getElementById('c');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext('2d');
    await p1.render({{ canvasContext: ctx, viewport }}).promise;
    return canvas.toDataURL('image/webp', 0.90);
  }}
  window.renderP1 = renderP1;
  window.ready = true;
</script>
</body>
</html>"""
            page.set_content(html)
            page.wait_for_function("window.ready === true")
            data_url = page.evaluate("window.renderP1()")
            encoded = data_url.split(",", 1)[1]
            out_file = os.path.join(out_dir, "cover.webp")
            with open(out_file, "wb") as out:
                out.write(base64.b64decode(encoded))
            print(f"Rendered cover for {slug}: {out_file} ({os.path.getsize(out_file)} bytes)")
            
        browser.close()

if __name__ == "__main__":
    render_covers()
