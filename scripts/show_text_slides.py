import json

with open("scripts/detailed_text_slides_analysis.json", "r", encoding="utf-8") as f:
    data = json.load(f)

for p in data:
    text_slides = [it for it in p["items"] if it["is_text_explanation"]]
    if text_slides:
        slug = p["slug"]
        title = p["title"]
        print(f"=== {slug} ({title}) - {len(text_slides)} text slides / {p['gallery_count']} images ===")
        for ts in text_slides:
            img = ts["image"]
            ttype = ts["text_type"]
            pidx = ts["page_idx"]
            print(f"  Img: {img} (Page {pidx}) [{ttype}]")
            lines = [l.strip() for l in ts["text"].split("\n") if l.strip()]
            for l in lines[:4]:
                print(f"    > {l}")
            if len(lines) > 4:
                print(f"    > ... (+{len(lines)-4} lines)")
