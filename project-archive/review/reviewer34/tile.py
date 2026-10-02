import sys
from PIL import Image
# usage: tile.py out.png seg_h file1 [file2 ...]  -> each file split into segments, all segments laid side by side
out=sys.argv[1]; H=int(sys.argv[2]); segs=[]
for f in sys.argv[3:]:
    im=Image.open(f).convert('RGB'); w,h=im.size
    for y in range(0,h,H):
        segs.append(im.crop((0,y,w,min(h,y+H))))
W=sum(s.size[0]+6 for s in segs); out_im=Image.new('RGB',(W,H),(255,0,255)); x=0
for s in segs: out_im.paste(s,(x,0)); x+=s.size[0]+6
out_im.save(out)
print(out, out_im.size)
