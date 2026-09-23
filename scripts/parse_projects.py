import re, sys, os, json
sys.stdout.reconfigure(encoding="utf-8", errors="replace")

src = open(r"C:\Users\hamam\uteroid-project\lib\projects.ts", encoding="utf-8").read()

start = src.index("export const projects: Project[] = [") + len("export const projects: Project[] = [")
end = src.index("];", start)
body = src[start:end]

# Split top-level project objects: lines that start with `    slug: "..."` (4 spaces)
pat = re.compile(r'\n    slug: ("[^"]+")', re.M)
matches = list(pat.finditer(body))
projects = []
for i, m in enumerate(matches):
    seg = body[m.start(): matches[i+1].start() if i+1 < len(matches) else len(body)]
    def getf(field):
        fm = re.search(r'\n    ' + field + r': (.*)', seg)
        return fm.group(1).strip() if fm else None
    def getlist(field):
        fm = re.search(r'\n    ' + field + r': \[(.*?)\n    \]', seg, re.S)
        if not fm: return []
        return re.findall(r'"([^"]+)"', fm.group(1))
    def getdetails():
        fm = re.search(r'details: \{', seg)
        if not fm: return None
        return True
    title = getf("title")
    projects.append({
        "slug": m.group(1).strip('"'),
        "title": re.sub(r'^["\']|["\']$', '', title) if title else None,
        "client": getf("client"),
        "year": getf("year"),
        "category": getf("category"),
        "coverImage": getf("coverImage"),
        "galleryImages": getlist("galleryImages"),
        "hasDetails": bool(getdetails()),
        "desc_len": len(getf("description") or ""),
        "short_len": len(getf("shortDescription") or ""),
    })

print("projects:", len(projects))
for p in projects:
    cover_ok = os.path.exists(os.path.join(r"C:\Users\hamam\uteroid-project\public", p["coverImage"].lstrip("/"))) if p["coverImage"] else False
    gdir = os.path.join(r"C:\Users\hamam\uteroid-project\public\projects", p["slug"])
    disk = sorted(os.listdir(gdir)) if os.path.isdir(gdir) else []
    disk_minus = [d for d in disk if d != "cover.webp"]
    ts_files = [os.path.basename(x) for x in p["galleryImages"]]
    extra = [d for d in disk_minus if d not in ts_files]
    missing = [t for t in ts_files if t not in disk]
    print(f'{p["slug"]:22} gal={len(p["galleryImages"]):2} det={"Y" if p["hasDetails"] else "-"} desc={p["desc_len"]:5} title={p["title"]} | client={p["client"]} | cover_ok={cover_ok} | disk={len(disk_minus)} missing={missing} extra={extra[:8]}')

json.dump(projects, open(r"C:\Users\hamam\uteroid-project\scripts\current_projects.json", "w", encoding="utf-8"), indent=1, ensure_ascii=False)