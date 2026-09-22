import re

filepath = r"c:\Users\hamam\uteroid-project\lib\projects.ts"

with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

verified_years = {
    "garageplug": "",
    "mcc": "2022",
    "stamford": "2021",
    "chatten": "",
    "bank-sidoarjo": "2023",
    "mie-gacoan": "",
    "logo-75th-indonesia": "2020",
    "ayam-goreng-nelongso": "",
    "konas-2021": "2021",
    "sfi": "2024",
    "wajan-giok": "2024",
    "bpr-tulungagung": "",
    "bpr-artha-kanjuruhan": "",
    "baiturrohman": "2023",
    "jmt": "2026",
    "lacamino": "2025",
    "techlink": "2024",
    "proxon": "2024",
    "kiyona": "2026",
    "uwg": "2021",
    "rohani": "",
    "gsm-1922": "2022",
    "momsarasa": "",
    "yin-yam": "2024",
    "cos-pleng": "2023",
    "boop": "",
    "maitri": "2025",
    "satu-titik": "",
    "amarta-wisesa": "2023",
    "plut-kumkm": "2024",
    "dailbana": "2023",
    "wismari": "2019",
}

# Update each project's year
updated_count = 0
for slug, new_year in verified_years.items():
    # Regex to find slug: "slug", ... year: "old_year"
    pattern = rf'(slug:\s*"{slug}"[\s\S]*?year:\s*)"[^"]*"'
    if re.search(pattern, content):
        content = re.sub(pattern, rf'\1"{new_year}"', content, count=1)
        updated_count += 1
    else:
        print(f"Warning: Could not match slug: {slug}")

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)

print(f"Successfully updated {updated_count} projects in lib/projects.ts")
