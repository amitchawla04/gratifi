import sys,glob
from PIL import Image
def sheet(files,out,cols=4,w=300):
    ims=[Image.open(f) for f in files]; h=int(w*ims[0].height/ims[0].width)
    rows=(len(ims)+cols-1)//cols; S=Image.new('RGB',(cols*(w+10),rows*(h+10)),'white')
    for i,im in enumerate(ims): S.paste(im.resize((w,h)),((i%cols)*(w+10),(i//cols)*(h+10)))
    S.save(out)
pat=sys.argv[1]; out=sys.argv[2]
sheet(sorted(glob.glob(pat)),out)
