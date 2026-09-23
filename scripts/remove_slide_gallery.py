import json, os, sys, re, shutil
sys.stdout.reconfigure(encoding="utf-8", errors="replace")
ROOT = r"C:\Users\hamam\uteroid-project"
path = os.path.join(ROOT, r"lib\projects.ts")
decisions = json.load(open(os.path.join(ROOT, r"scripts\slide_decisions.json"), encoding="utf-8"))

rm = {slug: {d[0] for d in dec if d[1] == "REMOVE"} for slug, dec in decisions.items()}
rm = {k: v for k, v in rm.items() if v}

# check no removed file is used as hoverImage
lines = open(path, encoding="utf-8").read().split("\n")
cur = None
hovermap = {}
for ln in lines:
    m = re.match(r'\s*slug: "([^"]+)"', ln)
    if m:
        cur = m.group(1)
    hm = re.match(r'\s*hoverImage: "([^"]+)"', ln)
    if hm and cur:
        hovermap[cur] = os.path.basename(hm.group(1))
for slug, files in rm.items():
    for f in files:
        if hovermap.get(slug) == f:
            print("WARN hoverImage removed:", slug, f)

# state machine: rewrite galleryImages blocks
out_lines = []
cur = None
in_gallery = False
pending = []  # (start_idx, slug) of current gallery block
i = 0
while i < len(lines):
    ln = lines[i]
    m = re.match(r'\s*slug: "([^"]+)"', ln)
    if m:
        cur = m.group(1)
    if re.match(r'\s*galleryImages: \[$', ln) and cur:
        in_gallery = True
        block_lines = [ln]
        j = i + 1
        while j < len(lines) and not re.match(r'\s*\],\s*$', lines[j]):
            block_lines.append(lines[j])
            j += 1
        if j < len(lines):
            block_lines.append(lines[j])  # closing '],'
        removals = rm.get(cur, set())
        if removals:
            new_block = []
            removed = []
            for bl in block_lines:
                fm = re.match(r'\s*"(/projects/[^"]+)"\s*,?\s*$', bl)
                if fm:
                    fname = os.path.basename(fm.group(1))
                    if fname in removals:
                        removed.append(fname)
                        continue
                new_block.append(bl)
            out_lines.extend(new_block)
            print(f"{cur}: removed {removed}")
        else:
            out_lines.extend(block_lines)
        i = j
        in_gallery = False
        continue
    out_lines.append(ln)
    i += 1

open(os.path.join(ROOT, r"scripts\projects.ts.new"), "w", encoding="utf-8").write("\n".join(out_lines))
print("WROTE scripts/projects.ts.new")