import sys, glob
from PIL import Image
pat, out = sys.argv[1], sys.argv[2]
H = int(sys.argv[3]) if len(sys.argv) > 3 else 1400
fs = sorted(glob.glob(pat))
ims = []
for f in fs:
    im = Image.open(f).convert('RGB'); im = im.crop((0, 0, im.width, min(im.height, H))); ims.append(im)
if not ims: sys.exit('none')
w = sum(i.width for i in ims) + 10 * (len(ims) - 1); h = max(i.height for i in ims)
S = Image.new('RGB', (w, h), (120, 120, 120)); x = 0
for i in ims: S.paste(i, (x, 0)); x += i.width + 10
if S.width > 3400: S = S.resize((3400, int(S.height * 3400 / S.width)))
S.save(out); print(len(ims), S.size)
