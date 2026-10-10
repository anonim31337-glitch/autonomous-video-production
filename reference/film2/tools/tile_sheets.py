"""Contact sheets per chapter (transcript M10): six columns, the frame number printed on each tile.
input remotion/out/sheets/<seg>_<frame>.jpg -> 09_QA/sheets/sheet_<seg>.jpg     usage: python tile_sheets.py"""
import re
from collections import defaultdict
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

SRC = Path(r'<PROJECT_ROOT>\remotion\out\sheets')
OUT = Path(r'<PROJECT_ROOT>\09_QA\sheets')
OUT.mkdir(parents=True, exist_ok=True)
font = ImageFont.truetype(r'C:\Windows\Fonts\consola.ttf', 18)
groups = defaultdict(list)
for f in SRC.glob('*.jpg'):
    seg, fr = re.match(r'(.+)_(\d+)\.jpg', f.name).groups()
    groups[seg].append((int(fr), f))
for seg, items in groups.items():
    items.sort()
    w, h = Image.open(items[0][1]).size
    cols, rows = 6, (len(items) + 5) // 6
    sheet = Image.new('RGB', (cols * w, rows * h), (20, 20, 20))
    d = ImageDraw.Draw(sheet)
    for i, (fr, f) in enumerate(items):
        x, y = (i % cols) * w, (i // cols) * h
        sheet.paste(Image.open(f), (x, y))
        d.text((x + 6, y + 4), f'{fr}  {fr / 30:.1f}s', fill=(255, 80, 80), font=font)
    sheet.save(OUT / f'sheet_{seg}.jpg', quality=85)
    print(seg, len(items), 'stills')
