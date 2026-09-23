import json

with open("scripts/all_projects_slides.json", "r", encoding="utf-8") as f:
    data = json.load(f)

for slug, slides in data.items():
    print(f"\n==================== {slug} ====================")
    for s in slides[:3]:
        txt_sample = " ".join(s["text"].split())[:140]
        print(f"  {s['filename']} (P{s['page']}): {txt_sample}")
