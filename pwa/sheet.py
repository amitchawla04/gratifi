import sys, glob
from PIL import Image
files=sys.argv[2:]
ims=[Image.open(f).resize((390,844)) for f in files]
o=Image.new('RGB',(len(ims)*400,844),'white')
for i,im in enumerate(ims): o.paste(im,(i*400,0))
o.save(sys.argv[1])
