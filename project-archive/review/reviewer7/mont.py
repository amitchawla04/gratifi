import sys
from PIL import Image
out=sys.argv[1]; fs=sys.argv[2:]
ims=[Image.open(f) for f in fs]
H=min(1500,max(i.size[1] for i in ims))
W=sum(i.size[0] for i in ims)+10*(len(ims)-1)
m=Image.new('RGB',(W,H),(255,0,255)); x=0
for i in ims:
    m.paste(i.crop((0,max(0,i.size[1]-H) if i.size[1]>H and '--top' not in out else 0,i.size[0],i.size[1])),(x,0)); x+=i.size[0]+10
m.save(out)
