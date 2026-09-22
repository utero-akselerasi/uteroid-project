# pyrefly: ignore [missing-import]
from PIL import Image
import os

card_w, card_h = 600, 450 # 4:3
hero_w, hero_h = 1400, 600 # 21:9

slugs = ["sfi", "lacamino", "proxon", "yin-yam", "maitri", "amarta-wisesa", "plut-kumkm", "uwg"]

out_dir = r"c:\Users\hamam\uteroid-project\scripts\test_crops"
os.makedirs(out_dir, exist_ok=True)

for slug in slugs:
    src_path = f"c:/Users/hamam/uteroid-project/public/projects/{slug}/cover.webp"
    if not os.path.exists(src_path):
        continue
    img = Image.open(src_path)
    
    # 1. Test Card 4:3 with contain
    card_contain = Image.new("RGBA", (card_w, card_h), (240, 239, 237, 255))
    ratio = min(card_w / img.width, card_h / img.height)
    new_size = (int(img.width * ratio), int(img.height * ratio))
    resized = img.resize(new_size, Image.Resampling.LANCZOS)
    offset = ((card_w - new_size[0]) // 2, (card_h - new_size[1]) // 2)
    card_contain.paste(resized, offset)
    card_contain.save(os.path.join(out_dir, f"{slug}_card_contain.png"))

    # 2. Test Card 4:3 with cover scaled 0.85
    # cover ratio:
    ratio_cov = max(card_w / img.width, card_h / img.height) * 0.85
    new_size_cov = (int(img.width * ratio_cov), int(img.height * ratio_cov))
    resized_cov = img.resize(new_size_cov, Image.Resampling.LANCZOS)
    card_scale = Image.new("RGBA", (card_w, card_h), (240, 239, 237, 255))
    offset_cov = ((card_w - new_size_cov[0]) // 2, (card_h - new_size_cov[1]) // 2)
    card_scale.paste(resized_cov, offset_cov)
    card_scale.save(os.path.join(out_dir, f"{slug}_card_scale085.png"))

print("Saved card crop tests to scripts/test_crops")
