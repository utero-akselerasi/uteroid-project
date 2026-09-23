import json
import re
import os

# Let's write the complete updated projects.ts
# We'll make sure:
# 1. yin-yam coverImage and heroImage are "/projects/yin-yam/cover.webp" (which is now fixed and 140KB)
# 2. Text slides are removed from galleryImages across all projects
# 3. Rich extracted Indonesian copy from the slides is integrated into description and details (challenge, solution, scope, deliverables)

# Let's inspect each project's current details and build the updated data
with open("lib/projects.ts", "r", encoding="utf-8") as f:
    orig_ts = f.read()

# Let's prepare text extractions and clean galleries
with open("scripts/all_projects_slides.json", "r", encoding="utf-8") as f:
    slides_data = json.load(f)

print("Ready to process projects.ts")
