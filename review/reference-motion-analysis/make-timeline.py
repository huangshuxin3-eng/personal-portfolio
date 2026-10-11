from PIL import Image,ImageDraw
from pathlib import Path
root=Path('portfolio-prototype/folder-study/review/reference-motion-analysis')
for group in range(4):
    canvas=Image.new('RGB',(1120,1192),'#e8e6df')
    draw=ImageDraw.Draw(canvas)
    for k in range(12):
        frame=group*36+k*3+1
        source=Image.open(root/'frames'/f'frame-{frame:03}.png').convert('RGB')
        source.thumbnail((280,497))
        # 4 columns / 3 rows: 100ms apart. Trim UI playback controls from each thumbnail.
        source=source.crop((0,0,280,367))
        x=(k%4)*280;y=(k//4)*397
        canvas.paste(source,(x,y+25))
        draw.text((x+8,y+6),f'{(frame-1)/30:.2f}s / frame {frame-1}',fill='#111111')
    canvas.save(root/f'timeline-{group+1}.png')
