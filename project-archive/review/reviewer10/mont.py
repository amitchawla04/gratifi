import sys
from PIL import Image
out=sys.argv[1]; fs=sys.argv[2:]
ims=[Image.open(f) for f in fs]
H=max(i.size[1] for i in ims); H=min(H,1400)
W=sum(i.size[0] for i in ims)+10*(len(ims)-1)
m=Image.new('RGB',(W,H),'white'); x=0
for i in ims: m.paste(i.crop((0,0,i.size[0],min(i.size[1],H))),(x,0)); x+=i.size[0]+10
m.save(out)
