import sys
from PIL import Image
out=sys.argv[1]; fs=sys.argv[2:]
ims=[Image.open(f).convert('RGB') for f in fs]
ims=[i.crop((0,max(0,i.height-1300),i.width,i.height)) if i.height>1300 else i for i in ims]
h=max(i.height for i in ims); W=sum(i.width for i in ims)+10*(len(ims)-1)
o=Image.new('RGB',(W,h),'red'); x=0
for i in ims: o.paste(i,(x,0)); x+=i.width+10
o.save(out)
