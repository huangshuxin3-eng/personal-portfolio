import {readFile,mkdir,cp,rm,stat} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';import path from 'node:path';
const root=path.dirname(fileURLToPath(import.meta.url)),source=path.join(root,'portfolio-source'),site=path.join(root,'site');
function run(args,cwd=root){const r=spawnSync(process.execPath,args,{cwd,stdio:'inherit'});if(r.error)throw r.error;if(r.status!==0)throw Error('Build gate failed: '+args[0]);}
run([path.join(source,'node_modules/typescript/bin/tsc'),'--allowJs','--checkJs','--noEmit','--target','ES2022','--module','ES2022','--lib','DOM,DOM.Iterable,ES2022','dist/app.js','dist/hand-guide.js']);
run([path.join(source,'node_modules/next/dist/bin/next'),'build'],source);
const assets=['index.html','style.css','app.js','hand-guide.css','hand-guide.js','retro-hand.svg'];
const html=await readFile(path.join(root,'dist/index.html'),'utf8');
for(const a of assets){await stat(path.join(root,'dist',a));if(a!=='index.html'&&!html.includes(a))throw Error('Missing homepage reference: '+a);}
for(const a of ['portfolio/index.html','portfolio/legaltrace/index.html','_next','legaltrace/workbench.png','legaltrace/extension.png','legaltrace/extension-panel.png','legaltrace/landing.png'])await stat(path.join(source,'out',a));
// Clear only the fixed, verified generated site directory; source and baseline never enter this path.
if(path.dirname(site)!==root||path.basename(site)!=='site')throw Error('Unsafe output path');
await rm(site,{recursive:true,force:true});await mkdir(site,{recursive:true});
for(const a of assets)await cp(path.join(root,'dist',a),path.join(site,a));
for(const a of ['portfolio','_next','legaltrace'])await cp(path.join(source,'out',a),path.join(site,a),{recursive:true});
console.log('BUILD PASS: unified static website -> '+site+' (homepage + portfolio only; no CV/Demo placeholders)');
