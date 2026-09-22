import re

with open(r"c:\Users\hamam\uteroid-project\lib\projects.ts", "r", encoding="utf-8") as f:
    content = f.read()

matches = re.findall(r'slug:\s*"([^"]+)"[\s\S]*?year:\s*"([^"]*)"', content)
print(f"Total projects in projects.ts: {len(matches)}")
for slug, year in matches:
    print(f'{slug:<25}: year="{year}"')
