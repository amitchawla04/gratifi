import sys
from PIL import Image
out=sys.argv[1]; fs=sys.argv[2:]
ims=[Image.open(f) for f in fs]
H=max(i.height for i in ims); H=min(H,1400)
W=sum(i.width for i in ims)+10*(len(ims)-1)
m=Image.new('RGB',(W,H),(255,0,255)); x=0
for i in ims: m.paste(i.crop((0,0,i.width,min(i.height,H))),(x,0)); x+=i.width+10
m.save(out)
