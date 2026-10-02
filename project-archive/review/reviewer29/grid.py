import sys
from PIL import Image
# grid.py out.png img1 img2 img3 ... ; each image cropped to max 1300 tall (bottom part), 3 per row
out=sys.argv[1]; fs=sys.argv[2:]
ims=[]
for f in fs:
    im=Image.open(f); w,h=im.size
    if h>1300: im=im.crop((0,h-1300,w,h))
    ims.append(im)
H=max(i.size[1] for i in ims); W=sum(i.size[0] for i in ims)+10*(len(ims)-1)
o=Image.new('RGB',(W,H),'white'); x=0
for i in ims: o.paste(i,(x,0)); x+=i.size[0]+10
o.save(out); print(out)
