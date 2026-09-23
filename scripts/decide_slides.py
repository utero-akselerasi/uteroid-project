import json, sys, os, re
sys.stdout.reconfigure(encoding="utf-8", errors="replace")

ROOT = r"C:\Users\hamam\uteroid-project"
cur = json.load(open(os.path.join(ROOT, r"scripts\current_projects.json"), encoding="utf-8"))
audit = json.load(open(os.path.join(ROOT, r"scripts\text_slides_audit_report.json"), encoding="utf-8"))
pdfs = json.load(open(os.path.join(ROOT, r"scripts\full_pdf_pages.json"), encoding="utf-8"))

def norm(s):
    return re.sub(r'[^a-z0-9]+', '', (s or '').lower())

def true_page(pdf, snippet):
    """Find PDF page whose text best contains the normalized snippet."""
    if not pdf or not snippet:
        return None
    n = norm(snippet)
    if len(n) < 12:
        return None
    best = None
    bestscore = 0
    for pg in pdf["pages_list"]:
        t = norm(pg["text"])
        # longest common prefix approach: find how much of n appears at start of t
        score = 0
        for i in range(len(t), 0, -20):
            if n[:i] in t:
                score = i
                break
        if score > bestscore:
            bestscore = score
            best = pg
    if bestscore >= 16:
        return best
    return None

out = {}
for a in audit:
    slug = a["slug"]
    p = next((x for x in cur if x["slug"] == slug), None)
    if not p:
        continue
    gal = [os.path.basename(g) for g in p["galleryImages"]]
    pdf = pdfs.get(slug)
    decisions = []  # (filename, action, page, nchars, nimgs, headline)
    for ts in a.get("text_slides", []):
        fname = os.path.basename(ts.get("image", ""))
        if fname not in gal:
            continue
        snippet = ts.get("text") or ""
        pg = true_page(pdf, snippet) if pdf else None
        if pg is None:
            # fall back to estimated page
            est = ts.get("estimated_page")
            pg = next((x for x in (pdf or {}).get("pages_list", []) if x["page"] == est), None) if est else None
        nchars = pg["nchars"] if pg else None
        nimgs = pg["nimgs"] if pg else None
        reason = (ts.get("reason") or "").lower()
        t = norm(pg["text"]) if pg else ""
        is_toc = any(k in norm(ts.get("text") or "") for k in ("daftarisi", "tableofcontent", "indexidentitas")) and nchars and nchars < 200
        if pg is None:
            action = "UNKNOWN"  # cannot verify; keep
        elif is_toc:
            action = "REMOVE"
        elif nchars is not None and nimgs is not None and nchars >= 120 and nimgs <= 1:
            action = "REMOVE"
        else:
            action = "KEEP"
        decisions.append((fname, action, (pg or {}).get("page"), nchars, nimgs, ts.get("text")))
    out[slug] = decisions

# report
for slug in out:
    dec = out[slug]
    rm = [(d[0], d[2], d[3], d[4]) for d in dec if d[1] == "REMOVE"]
    kp = [(d[0], d[2], d[3], d[4]) for d in dec if d[1] == "KEEP"]
    un = [(d[0],) for d in dec if d[1] == "UNKNOWN"]
    p = next(x for x in cur if x["slug"] == slug)
    total = len(p["galleryImages"])
    print(f'\n{slug} gallery={total} REMOVE={len(rm)} KEEP={len(kp)} UNKNOWN={len(un)} -> after={total-len(rm)}')
    for r in rm[:20]:
        print(f'   RM {r}')
    for k in kp[:8]:
        print(f'   KEEP {k}')
    for u in un[:4]:
        print(f'   ?? {u}')
json.dump(out, open(os.path.join(ROOT, r"scripts\slide_decisions.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)