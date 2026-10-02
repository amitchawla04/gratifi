import sys
from PIL import Image
out=sys.argv[1]; files=sys.argv[2:]; h=1100
ims=[Image.open(f) for f in files]
ims=[i.crop((0,max(0,i.size[1]-h),i.size[0],i.size[1])) for i in ims]
W=sum(i.size[0] for i in ims); H=max(i.size[1] for i in ims)
m=Image.new('RGB',(W,H),'white'); x=0
for i in ims: m.paste(i,(x,0)); x+=i.size[0]
m.save(out)
