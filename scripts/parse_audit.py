import json
import re

with open(r"c:\Users\hamam\uteroid-project\scripts\pdf_audit_results.json", "r", encoding="utf-8") as f:
    data = json.load(f)

print("=" * 90)
print(f"{'Filename':<45} | {'Text Years':<15} | {'FN Years':<10} | {'Meta Year':<10} | {'TextLen'}")
print("-" * 90)

for fname, d in sorted(data.items()):
    txt_years = str(d["years_in_text"])
    fn_years = str(d["years_in_fname"])
    cdate = d.get("creation_date", "")
    m = re.search(r"D:(20\d\d)", cdate)
    meta_year = m.group(1) if m else ""
    tlen = d["full_text_len"]
    print(f"{fname[:44]:<45} | {txt_years:<15} | {fn_years:<10} | {meta_year:<10} | {tlen}")
