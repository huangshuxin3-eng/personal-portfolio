from pathlib import Path
import hashlib,json,re
root=Path('.')
manifest={str(p):hashlib.sha256(p.read_bytes()).hexdigest() for p in sorted((root/'dist').glob('*')) if p.is_file()}
(root/'review/hand-study/homepage-before-sha256.json').write_text(json.dumps(manifest,indent=2),encoding='utf8')
(root/'review/hand-study/frozen-layout.css').write_bytes((root/'dist/style.css').read_bytes())
app=(root/'dist/app.js').read_text(encoding='utf-8-sig')
# Preserve the drawing function verbatim, without importing carousel initialization.
prefix=app[:app.index('document.querySelectorAll("[data-folder]")')]
(root/'review/hand-study/folder-art.js').write_text(prefix,encoding='utf8')
