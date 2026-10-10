"""Contact sheets from stills.mjs output: one sheet per composition, frame number on each tile.
usage: python sheets.py <stillsDir> Ch0 Ch1 ...  -> <stillsDir>/../sheet_<id>.jpg"""
import glob, os, sys
from PIL import Image, ImageDraw

d = sys.argv[1]
for cid in sys.argv[2:]:
    fs = sorted(glob.glob(os.path.join(d, f'{cid}_*.jpg')))
    if not fs:
        continue
    W, H, cols = 640, 360, 6
    rows = (len(fs) + cols - 1) // cols
    sheet = Image.new('RGB', (W * cols, H * rows), 'black')
    for i, f in enumerate(fs):
        im = Image.open(f).resize((W, H))
        ImageDraw.Draw(im).text((6, 4), os.path.basename(f).split('_')[-1][:-4], fill=(255, 0, 0))
        sheet.paste(im, ((i % cols) * W, (i // cols) * H))
    sheet.save(os.path.join(d, '..', f'sheet_{cid}.jpg'), quality=85)
    print(cid, len(fs))
