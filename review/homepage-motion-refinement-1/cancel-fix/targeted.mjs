import {chromium} from 'file:///C:/Users/黄舒心/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import {createServer} from 'node:http';import {readFile,writeFile,mkdir} from 'node:fs/promises';import path from 'node:path';import assert from 'node:assert/strict';
const mode=process.argv[2],out='review/homepage-motion-refinement-1/cancel-fix';await mkdir(out+'/raw',{recursive:true});
const server=createServer(async(req,res)=>{try{let u=req.url.split('?')[0];let f=path.join(process.cwd(),'dist',u==='/'?'index.html':u);if(mode==='before'&&u==='/app.js')f=path.join(process.cwd(),out,'app-before.js');res.setHeader('Content-Type',({'.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml'})[path.extname(f)]||'text/html');res.end(await readFile(f));}catch{res.writeHead(404);res.end();}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const b=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const c=await b.newContext({viewport:{width:1440,height:900},recordVideo:{dir:out+'/raw',size:{width:1440,height:900}}});const p=await c.newPage(),errors=[],events=[],checks=[];p.on('pageerror',e=>errors.push(e.message));
const at=async i=>p.waitForFunction(i=>document.querySelector('.main-folder').dataset.index===String(i)&&!document.querySelector('.main-folder').hasAttribute('aria-busy'),i,{timeout:5000});
async function gesture(dx,hold,back=0){const r=await p.locator('.main-folder').boundingBox(),x=r.x+r.width/2,y=r.y+r.height/2;await p.mouse.move(x,y);await p.mouse.down();const steps=Math.max(1,Math.round(Math.abs(dx)/16));for(let i=1;i<=steps;i++){await p.mouse.move(x+dx*i/steps,y);await p.waitForTimeout(26);}await p.waitForTimeout(hold);if(back){const n=Math.max(1,Math.round(Math.abs(back)/12));for(let i=1;i<=n;i++){await p.mouse.move(x+dx+back*i/n,y);await p.waitForTimeout(26);}await p.waitForTimeout(260);}await p.mouse.up();}
try{
 await p.goto(`http://127.0.0.1:${server.address().port}`,{waitUntil:'domcontentloaded',timeout:10000});await p.waitForFunction(()=>document.querySelector('.hand-guide-anchor').dataset.state==='exited',{}, {timeout:10000});
 await p.evaluate(()=>{window.cancelEvidence=[];document.querySelector('.main-folder').addEventListener('folder:interaction',e=>{if(e.detail.type!=='drag-move')window.cancelEvidence.push({...e.detail,time:performance.now()});});});
 // The original recording's Scene 4: CV, left 92px over 6 steps, hold 420ms, release.
 await gesture(-92,420);
 const effects=await p.evaluate(()=>[...document.querySelectorAll('.carousel-slide')].map((s,i)=>({i,hidden:s.hasAttribute('hidden'),effects:s.getAnimations().map(a=>({duration:a.effect.getTiming().duration,frames:a.effect.getKeyframes()}))})));
 await p.evaluate(()=>document.querySelectorAll('.carousel-slide').forEach(s=>s.getAnimations().forEach(a=>{a.pause();a.currentTime=210;})));await p.waitForTimeout(40);
 const midpoint=await p.evaluate(()=>({index:document.querySelector('.main-folder').dataset.index,busy:document.querySelector('.main-folder').hasAttribute('aria-busy'),slides:[...document.querySelectorAll('.carousel-slide')].map(s=>({hidden:s.hasAttribute('hidden'),clip:getComputedStyle(s).clipPath,transform:getComputedStyle(s).transform}))}));
 await p.screenshot({path:`${out}/${mode}-return-210ms.png`});
 await p.evaluate(()=>document.querySelectorAll('.carousel-slide').forEach(s=>s.getAnimations().forEach(a=>a.play())));await at(0);
 const clipFrames=effects[0].effects.find(e=>e.frames.some(f=>f.clipPath));assert.equal(clipFrames.duration,420);assert.equal(clipFrames.frames.at(-1).clipPath,mode==='before'?'inset(0px 0px 0px 100%)':'inset(0px 0% 0px 0px)');checks.push('exact -92px / 420ms hold cancellation reproduced; return endpoint verified');
 // Unpaused version for the short human-review clip, followed by the original Scene 5 reversal.
 await gesture(-92,420);await at(0);await p.waitForTimeout(350);
 await gesture(-210,380,300);await at(0);await p.waitForTimeout(350);
 checks.push('original reverse drag -210px / 380ms hold / +300px / 260ms hold returns to CV');
 if(mode==='after'){
  for(const[key,i]of[['ArrowRight',1],['ArrowRight',2],['ArrowLeft',1],['ArrowLeft',0]]){await p.keyboard.press(key);await at(i);await p.waitForTimeout(150);}checks.push('forward and reverse switching');
  for(let i=0;i<3;i++){await p.keyboard.press('ArrowRight');await p.waitForTimeout(70);}await at(1);for(let i=0;i<3;i++){await p.keyboard.press('ArrowLeft');await p.waitForTimeout(70);}await at(0);checks.push('rapid input retains finite lock');
  await gesture(-230,320);await at(1);await gesture(230,320);await at(0);checks.push('committed mouse drags both directions');
 }
 await p.waitForTimeout(800);const final=await p.evaluate(()=>({index:document.querySelector('.main-folder').dataset.index,slides:[...document.querySelectorAll('.carousel-slide')].map(s=>({hidden:s.hasAttribute('hidden'),style:s.getAttribute('style')||'',animations:s.getAnimations().length})),hand:document.querySelector('.hand-guide-anchor').dataset.state,overflow:document.documentElement.scrollWidth>innerWidth,events:window.cancelEvidence}));
 assert.equal(final.index,'0');assert.equal(final.overflow,false);assert.ok(final.slides.every(s=>s.style===''&&s.animations===0));assert.equal(final.hand,'exited');assert.equal(errors.length,0);assert.ok(final.events.some(e=>e.type==='switch-cancel')&&final.events.some(e=>e.type==='drag-end'));checks.push('no stale WAAPI/styles, CV visibility restored, hand exits, no overflow or page errors');
 await writeFile(`${out}/${mode}-result.json`,JSON.stringify({effects,midpoint,final,errors,checks},null,2));const video=p.video();await c.close();await video.saveAs(`${out}/${mode}-desktop.webm`);console.log(mode,JSON.stringify({midpoint,checks}));
}finally{await b.close();server.closeAllConnections();await new Promise(r=>server.close(r));}
