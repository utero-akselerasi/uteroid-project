import os
import sys
import base64
import json
from playwright.sync_api import sync_playwright

def test_render():
    pdf_path = r"C:\Users\hamam\uteroid-project\content\Works\GARAGEPLUG GSM.pdf"
    out_dir = r"C:\Users\hamam\uteroid-project\public\projects\garageplug"
    os.makedirs(out_dir, exist_ok=True)
    
    with open(pdf_path, "rb") as f:
        pdf_b64 = base64.b64encode(f.read()).decode("utf-8")
        
    html_content = f"""<!DOCTYPE html>
<html>
<head>
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
</head>
<body>
<canvas id="the-canvas"></canvas>
<script>
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  const pdfData = atob("{pdf_b64}");
  
  async function renderPage(pageNum, scale) {{
    const loadingTask = pdfjsLib.getDocument({{ data: pdfData }});
    const pdf = await loadingTask.promise;
    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({{ scale: scale }});
    const canvas = document.getElementById('the-canvas');
    const context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    
    await page.render({{
      canvasContext: context,
      viewport: viewport
    }}).promise;
    
    return canvas.toDataURL('image/webp', 0.92);
  }}
  window.renderPage = renderPage;
  window.ready = true;
</script>
</body>
</html>"""

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.set_content(html_content)
        page.wait_for_function("window.ready === true")
        
        # Render page 1
        data_url = page.evaluate("window.renderPage(1, 2.0)")
        header, encoded = data_url.split(",", 1)
        data = base64.b64decode(encoded)
        
        cover_path = os.path.join(out_dir, "cover.webp")
        with open(cover_path, "wb") as f:
            f.write(data)
            
        print(f"Cover written successfully: {cover_path}, size: {len(data)} bytes")
        browser.close()

if __name__ == "__main__":
    test_render()
