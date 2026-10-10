"""Thumbnail v2 (1280x720): the claim of the film (Opus 5.5 edited it) on a real frame of the v2 wall, the channel's face on the right.
-> V2/08_YOUTUBE/miniatura.jpg + miniatura_320.png (phone-size check)"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont

P = Path(r'<PROJECT_ROOT>')
OUT = P / 'V2' / '08_YOUTUBE'
W, H = 1280, 720
BLACK, BOLD = r'C:\Windows\Fonts\seguibl.ttf', r'C:\Windows\Fonts\segoeuib.ttf'
ORANGE, YELLOW, WHITE, BG = (255, 122, 61), (255, 210, 31), (255, 255, 255), (11, 15, 23)

im = Image.new('RGB', (W, H), BG)
wall = Image.open(P / 'V2' / 'out' / 'v2_14.png').convert('RGB').crop((880, 290, 1880, 650))  # real v2 frame: 68 films about Fable 5 lit
wall = ImageEnhance.Brightness(wall.resize((int(wall.width * 720 / wall.height), 720), Image.LANCZOS)).enhance(0.75)
im.paste(wall, (-120, 0))
grad = Image.new('L', (W, H))
gd = ImageDraw.Draw(grad)
for x in range(W):
    gd.line([(x, 0), (x, H)], fill=int(245 * max(0, 1 - x / 820)))
im.paste(Image.new('RGB', (W, H), BG), (0, 0), grad)

face = Image.open(P / '04_ASSETS' / 'thumb' / 'face_1.5.png').convert('RGB').crop((700, 30, 1400, 1080))
face = face.resize((int(face.width * 720 / face.height), 720), Image.LANCZOS)
mask = Image.new('L', face.size, 255)
md = ImageDraw.Draw(mask)
for i in range(140):
    md.line([(i, 0), (i, face.height)], fill=int(255 * i / 140))
im.paste(face, (W - face.width + 20, 0), mask.filter(ImageFilter.GaussianBlur(4)))

d = ImageDraw.Draw(im)
def outlined(xy, text, size, fill):
    f = ImageFont.truetype(BLACK, size)
    for dx in (-4, 0, 4):
        for dy in (-4, 0, 4):
            d.text((xy[0] + dx, xy[1] + dy), text, font=f, fill=(0, 0, 0))
    d.text(xy, text, font=f, fill=fill)

outlined((46, 34), 'TEN FILM', 112, WHITE)
outlined((46, 172), 'ZMONTOWAŁ', 112, WHITE)
outlined((46, 316), 'OPUS 5.5', 168, ORANGE)
f = ImageFont.truetype(BOLD, 46)
pill = '239 FILMÓW O AI'
tw = d.textlength(pill, font=f)
d.rounded_rectangle([50, 610, 50 + tw + 44, 680], radius=16, fill=YELLOW)
d.text((72, 614), pill, font=f, fill=BG)
OUT.mkdir(exist_ok=True)
im.save(OUT / 'miniatura.jpg', quality=92, optimize=True)
im.resize((320, 180), Image.LANCZOS).save(OUT / 'miniatura_320.png')
print('ok', (OUT / 'miniatura.jpg').stat().st_size)
