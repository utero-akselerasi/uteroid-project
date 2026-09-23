import json
import re
import os

with open("scripts/all_projects_slides.json", "r", encoding="utf-8") as f:
    data = json.load(f)

# Let's inspect each project and flag text slides to remove and extract
# We will check each slide's content and design purpose

for slug, slides in data.items():
    print(f"\n============================== {slug} ({len(slides)} slides) ==============================")
    for s in slides:
        txt = s["text"]
        txt_lower = txt.lower()
        
        # Check if it has story logo, latar belakang, kata pengantar, daftar isi
        is_text = False
        tag = ""
        
        if "daftar isi" in txt_lower or "table of content" in txt_lower:
            is_text = True
            tag = "TOC"
        elif "kata pengantar" in txt_lower or "preface" in txt_lower:
            is_text = True
            tag = "PREFACE"
        elif "latar belakang" in txt_lower or "background" in txt_lower:
            is_text = True
            tag = "BACKGROUND"
        elif "story logo" in txt_lower or "filosofi logo" in txt_lower or "filosofi brand" in txt_lower or "makna logo" in txt_lower:
            if len(txt) > 60:
                is_text = True
                tag = "STORY_LOGO"
                
        if is_text:
            clean_t = " ".join(txt.split())
            print(f"  [REMOVE -> COPY] {s['filename']} (P{s['page']}) [{tag}]")
            print(f"    Text: {clean_t[:120]}...")
