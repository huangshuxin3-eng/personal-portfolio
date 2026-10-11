from PIL import Image,ImageDraw
from pathlib import Path
root=Path('portfolio-prototype/folder-study/review/reference-motion-analysis')
for name,start in [('switch-1',39),('switch-2',64)]:
    sheet=Image.new('RGB',(1120,1080),'#e8e6df'); draw=ImageDraw.Draw(sheet)
    for k in range(12):
        frame=start+k
        img=Image.open(root/'frames'/f'frame-{frame:03}.png').convert('RGB')
        img=img.crop((0,120,560,770)).resize((280,325))
        x=k%4*280;y=k//4*360
        sheet.paste(img,(x,y+25));draw.text((x+8,y+6),f'{(frame-1)/30:.3f}s / F{frame-1}',fill='#111')
    sheet.save(root/f'{name}-frame-by-frame.png')
