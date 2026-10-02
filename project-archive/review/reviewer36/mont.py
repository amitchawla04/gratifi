import sys
from PIL import Image
out=sys.argv[1]; fs=sys.argv[2:]
ims=[Image.open(f) for f in fs]
# crop each to max 1100 height from bottom (chat) - keep full
H=max(i.size[1] for i in ims); W=sum(i.size[0] for i in ims)+10*(len(ims)-1)
m=Image.new('RGB',(W,H),'white'); x=0
for i in ims: m.paste(i,(x,0)); x+=i.size[0]+10
m.save(out)
