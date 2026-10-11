from PIL import Image
from pathlib import Path
root=Path('.')
im=Image.open('../reference-motion-analysis/frames/frame-034.png')
im.crop((45,630,475,994)).save('reference-hand-keyframe.png')
