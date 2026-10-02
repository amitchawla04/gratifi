import sys
from PIL import Image
f, top, bot = sys.argv[1], int(sys.argv[2]), int(sys.argv[3])
im = Image.open(f); h = im.size[1]
t = h - top if top > 0 else 0
b = h - bot
im.crop((0, max(0,t), im.size[0], b)).save(sys.argv[4])
