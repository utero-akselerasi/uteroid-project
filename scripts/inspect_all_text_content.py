import json

with open("scripts/project_slide_evaluations.json", "r", encoding="utf-8") as f:
    evals = json.load(f)

for slug, d in evals.items():
    if d["text_slides"]:
        print(f"\n==================== {slug} ====================")
        for ts in d["text_slides"]:
            print(f"File: {ts['filename']} (Page {ts['page']}) [{ts['category']}]")
            print(f"Text Content:\n{ts['raw_text']}\n{'-'*40}")
