from pathlib import Path
from PIL import Image
import json
root=Path('.')
data=json.loads((root/'measurements.json').read_text(encoding='utf8'))
for d in data:
    im=Image.open(root/'screenshots'/f"{d['name']}-hand-alpha.png").convert('RGBA')
    alpha=im.getchannel('A').point(lambda p:255 if p>40 else 0)
    box=alpha.getbbox()
    d['visibleHandPixels']={'x':box[0],'y':box[1],'width':box[2]-box[0],'height':box[3]-box[1]}
    d['visibleWidthRatio']=(box[2]-box[0])/(d['folder']['width']*388/460)
    print(d['name'],d['visibleHandPixels'],'ratio',round(d['visibleWidthRatio']*100,2))
(root/'measurements.json').write_text(json.dumps(data,indent=2),encoding='utf8')
