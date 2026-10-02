import sys
from PIL import Image
# combine: split tall images into 1000px chunks placed side by side (max 3 per output)
for f in sys.argv[1:]:
    im=Image.open(f); w,h=im.size; H=1000
    parts=[im.crop((0,y,w,min(h,y+H))) for y in range(0,h,H)]
    for k in range(0,len(parts),3):
        grp=parts[k:k+3]; out=Image.new('RGB',(w*len(grp)+10*(len(grp)-1),H),'white')
        for i,pp in enumerate(grp): out.paste(pp,(i*(w+10),0))
        n=f.split('/')[-1][:-4]; out.save(f'v/{n}_{k//3}.png')
        print(f'v/{n}_{k//3}.png')
