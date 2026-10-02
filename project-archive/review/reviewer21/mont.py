import sys
from PIL import Image
out=sys.argv[1]; fs=sys.argv[2:]
ims=[Image.open(f).convert('RGB') for f in fs]
h=max(i.size[1] for i in ims); w=sum(i.size[0] for i in ims)+10*(len(ims)-1)
m=Image.new('RGB',(w,h),(255,0,255)); x=0
for i in ims: m.paste(i,(x,0)); x+=i.size[0]+10
m.save(out)
