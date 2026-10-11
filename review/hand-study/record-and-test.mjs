import {chromium} from 'file:///C:/Users/黄舒心/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';import {createServer} from 'node:http';import {readFile,writeFile} from 'node:fs/promises';import path from 'node:path';import assert from 'node:assert/strict';
const base=process.cwd(),server=createServer(async(req,res)=>{try{const u=decodeURI(req.url.split('?')[0]);const f=path.join(base,u==='/'?'index.html':u);const ext=path.extname(f);res.setHeader('Content-Type',({'.svg':'image/svg+xml','.css':'text/css','.js':'text/javascript','.png':'image/png','.webm':'video/webm'})[ext]||'text/html');res.end(await readFile(f));}catch{res.writeHead(404);res.end();}});await new Promise(r=>server.listen(0,'127.0.0.1',r));const url=`http://127.0.0.1:${server.address().port}`,browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});const checks=[],paths=[];
async function load(p){await p.goto(url,{waitUntil:'networkidle'});await p.waitForFunction(()=>document.querySelector('#scene').dataset.ready==='true');}
async function sample(p,t){await p.evaluate(t=>window.dispatchEvent(new CustomEvent('hand-preview-seek',{detail:t})),t);return await p.evaluate(()=>{const svg=document.querySelector('.hand-actor svg'),m=svg.getScreenCTM(),tip=new DOMPoint(352,25).matrixTransform(m);return{x:tip.x,y:tip.y};});}
try{
const cp=await browser.newPage({viewport:{width:1200,height:820}});await cp.goto(url+'/comparison.html',{waitUntil:'networkidle'});await cp.screenshot({path:'screenshots/reference-comparison.png'});await cp.close();
for(const[name,width,height]of[['desktop',1440,900],['mobile',390,844]]){
const ctx=await browser.newContext({viewport:{width,height},recordVideo:{dir:'recordings',size:{width,height}}});const p=await ctx.newPage();await load(p);const folderBefore=await p.locator('.main-folder').innerHTML();const sequence=[];
for(const t of [650,1180,1350,1650,1770,2130,2250,2510,2670])sequence.push({t,...await sample(p,t)});
paths.push({name,width,height,points:sequence,minTipX:Math.min(...sequence.map(s=>s.x)),maxTipX:Math.max(...sequence.map(s=>s.x))});
await sample(p,1650);await p.screenshot({path:`screenshots/${name}-left-sweep.png`});await sample(p,0);
await p.evaluate(()=>window.dispatchEvent(new Event('hand-preview-play')));await p.waitForFunction(()=>document.querySelector('#scene').dataset.state==='exited');
assert.equal(await p.locator('.main-folder').innerHTML(),folderBefore);assert.equal(await p.evaluate(()=>document.getAnimations().some(a=>a.playState==='running')),false);assert.equal(await p.evaluate(()=>getComputedStyle(document.querySelector('.hand-actor')).opacity),'0');
await p.waitForTimeout(800);assert.equal(await p.evaluate(()=>document.querySelector('#scene').dataset.state),'exited');checks.push(`${name}: static folder unchanged, once-only trajectory, completely exits, no looping`);
await p.locator('#play').click();await p.waitForTimeout(500);assert.equal(await p.evaluate(()=>document.querySelector('#scene').dataset.state),'running');checks.push(`${name}: explicit replay works`);
await p.evaluate(()=>window.dispatchEvent(new CustomEvent('hand-preview-seek',{detail:1180})));await p.waitForTimeout(700);
const video=p.video();await ctx.close();await video.saveAs(`recordings/hand-motion-${name}.webm`);
}
const reduced=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});await load(reduced);assert.equal(await reduced.evaluate(()=>document.getAnimations().length),0);assert.equal(await reduced.locator('#play').isDisabled(),true);await reduced.screenshot({path:'screenshots/mobile-reduced-motion.png'});checks.push('reduced motion: no automatic animation; static pose, controls disabled');await reduced.close();
await writeFile('motion-measurements.json',JSON.stringify({paths,checks},null,2));console.log(JSON.stringify({paths,checks},null,2));
}finally{await browser.close();await new Promise(r=>server.close(r));}
