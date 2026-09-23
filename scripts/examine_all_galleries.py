import os
import json
import re

# Load lib/projects.ts
with open("lib/projects.ts", "r", encoding="utf-8") as f:
    ts_text = f.read()

# Parse projects
project_blocks = re.split(r'slug:\s*"', ts_text)[1:]

projects_data = []

for block in project_blocks:
    slug = block.split('"')[0]
    title_m = re.search(r'title:\s*"([^"]+)"', block)
    title = title_m.group(1) if title_m else slug
    
    desc_m = re.search(r'description:\s*"([^"]+)"', block)
    desc = desc_m.group(1) if desc_m else ""
    
    gallery_m = re.search(r'galleryImages:\s*\[(.*?)\]', block, re.DOTALL)
    gallery = re.findall(r'"([^"]+)"', gallery_m.group(1)) if gallery_m else []
    
    projects_data.append({
        "slug": slug,
        "title": title,
        "desc": desc,
        "gallery": gallery
    })

print(f"Loaded {len(projects_data)} projects from lib/projects.ts")

# Now let's inspect the actual images in each gallery
# For each project, let's see which images are text/story/philosophy slides vs visual mockups/branding applications
for p in projects_data:
    slug = p["slug"]
    print(f"\n=======================================================")
    print(f"Project: {slug} ({p['title']}) - {len(p['gallery'])} gallery images")
    
    # Check if there is a project.json in public/projects/[slug]
    pjson_path = os.path.join("public", "projects", slug, "project.json")
    pjson = {}
    if os.path.exists(pjson_path):
        with open(pjson_path, "r", encoding="utf-8") as pj:
            pjson = json.load(pj)
            
    # Check each image
    for img_rel in p["gallery"]:
        img_file = os.path.join("public", img_rel.lstrip("/"))
        exists = os.path.exists(img_file)
        print(f"  Image: {img_rel} (exists: {exists})")
