// Multi-viewport verification for the interaction-synchronisation round.
import {chromium} from 'file:///C:/Users/黄舒心/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import {createServer} from 'node:http';import {readFile,writeFile,mkdir} from 'node:fs/promises';import path from 'node:path';import assert from 'node:assert/strict';
const root=process.cwd(),out='review/homepage-hand-sync';await mkdir(out+'/screenshots',{recursive:true});
const server=createServer(async(req,res)=>{try{const baseline=req.url.startsWith('/checkpoint/'),u=decodeURI(req.url.split('?')[0]).replace('/checkpoint/','/'),f=path.join(root,baseline?out+'/checkpoint':'dist',u==='/'?'index.html':u);res.setHeader('Content-Type',({'.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml'})[path.extname(f)]||'text/html');res.end(await readFile(f));}catch{res.writeHead(404);res.end();}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const base=`http://127.0.0.1:${server.address().port}`;
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const checks=[],measurements=[];
const pass=s=>{checks.push(s);console.log('PASS '+s);};
const same=(a,b)=>Buffer.compare(a,b)===0; // deepEqual on megabyte buffers is needlessly heavy
const at=(p,i)=>p.waitForFunction(i=>document.querySelector('.main-folder').dataset.index===String(i)&&!document.querySelector('.main-folder').hasAttribute('aria-busy'),i,{timeout:8000});
const hand=p=>p.evaluate(()=>{const h=document.querySelector('.hand-guide-anchor'),a=document.querySelector('.hand-guide-actor');const r=a.getBoundingClientRect();return{hidden:h.hidden,state:h.dataset.state,x:+r.x.toFixed(1),opacity:+parseFloat(getComputedStyle(a).opacity).toFixed(3),animations:a.getAnimations().length,overflow:document.documentElement.scrollWidth>innerWidth};});
const settleWait=p=>p.waitForFunction(()=>{const h=document.querySelector('.hand-guide-anchor');return h.hidden===true&&document.querySelector('.hand-guide-actor').getAnimations().length===0;},{},{timeout:8000});
const load=async(p,baseline=false)=>{await p.goto(base+(baseline?'/checkpoint/':'/'),{waitUntil:'domcontentloaded'});await p.evaluate(()=>document.fonts.ready.catch(()=>{})).catch(()=>{});await p.waitForFunction(()=>{const h=document.querySelector('.hand-guide-anchor');return h&&(h.hidden===true||['exited','reduced'].includes(h.dataset.state));},{},{timeout:20000});};
/** slow two-way drag that keeps the pointer held so the coupling can be sampled mid-gesture */
async function drag(p,dx,touch=false){const b=await p.locator('.main-folder').boundingBox(),x=b.x+b.width/2,y=b.y+b.height/2;
 if(touch){const c=await p.context().newCDPSession(p);await c.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});
  for(let i=1;i<=12;i++){await c.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x+dx*i/12,y}]});await p.waitForTimeout(24);}
  await p.waitForTimeout(150);await c.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await c.detach();}
 else{await p.mouse.move(x,y);await p.mouse.down();for(let i=1;i<=12;i++){await p.mouse.move(x+dx*i/12,y);await p.waitForTimeout(24);}await p.waitForTimeout(150);await p.mouse.up();}}
try{
 for(const[name,width,height]of[['desktop',1440,900],['wide',1920,1080],['mobile',390,844]]){
  const p=await browser.newPage({viewport:{width,height},isMobile:name==='mobile',hasTouch:name==='mobile'}),errors=[];p.on('pageerror',e=>errors.push(e.message));
  // baseline (pre-change build) at rest
  await load(p,true);const baseline=await p.screenshot();
  await load(p);
  measurements.push({name,width,height,...await p.evaluate(()=>{const f=document.querySelector('.main-folder').getBoundingClientRect(),h=document.querySelector('.hand-guide-anchor');return{folderWidth:f.width,folderVisibleWidth:f.width*388/460,handWidth:parseFloat(h.style.width),handWidthExpected:f.width*388/460*.95*480/464,handPointerEvents:getComputedStyle(h).pointerEvents};})});
  // 1. resting state identical to the pre-change checkpoint
  assert.ok(same(await p.screenshot(),baseline),`${name}: resting frame must match checkpoint`);pass(`${name}: resting homepage pixel-identical to the pre-change checkpoint`);
  // 2. drag left: hand follows left, allows reversing, no overflow, no interception
  const b=await p.locator('.main-folder').boundingBox(),cx=b.x+b.width/2,cy=b.y+b.height/2;
  const DX=Math.min(230,Math.round(width*.42));
  await p.mouse.move(cx,cy);await p.mouse.down();
  await p.mouse.move(cx-DX*.3,cy,{steps:4});await p.waitForTimeout(140);const a1=await hand(p);
  await p.mouse.move(cx-DX*.75,cy,{steps:6});await p.waitForTimeout(140);const a2=await hand(p);
  await p.mouse.move(cx-DX*.4,cy,{steps:4});await p.waitForTimeout(170);const a3=await hand(p);
  assert.equal(a1.hidden,false);assert.equal(a1.state,'interactive');assert.ok(a2.x<a1.x-6);assert.ok(a3.x>a2.x+3);
  assert.equal(a1.overflow,false);assert.equal(a2.overflow,false);
  await p.mouse.move(cx-DX,cy,{steps:5});await p.waitForTimeout(120);await p.mouse.up();await at(p,1);await p.waitForTimeout(900);
  pass(`${name}: drag left is tracked by the hand (${a1.x}→${a2.x}), reversing the drag reverses the hand (→${a3.x}), no horizontal overflow`);
  // 3. drag right from portfolio back to CV
  await p.mouse.move(cx,cy);await p.mouse.down();
  await p.mouse.move(cx+DX*.3,cy,{steps:4});await p.waitForTimeout(140);const c1=await hand(p);
  await p.mouse.move(cx+DX*.75,cy,{steps:6});await p.waitForTimeout(140);const c2=await hand(p);
  assert.ok(c2.x>c1.x+6);assert.equal(c2.overflow,false);
  await p.mouse.move(cx+DX,cy,{steps:5});await p.waitForTimeout(120);await p.mouse.up();await at(p,0);await p.waitForTimeout(900);
  pass(`${name}: drag right is tracked by the hand (${c1.x}→${c2.x}) and returns to CV`);
  // 4. discrete wheel switch: hand gesture starts with the folder and finishes by itself
  await settleWait(p);const before=await hand(p);assert.equal(before.hidden,true);
  await p.mouse.move(0,0);await p.mouse.wheel(0,140);await p.waitForTimeout(120);
  const w1=await hand(p);await p.waitForTimeout(330);const w2=await hand(p);
  assert.equal(w1.state,'swipe');assert.equal(w1.hidden,false);assert.equal(w1.animations,0);assert.ok(Math.abs(w2.x-w1.x)>3);
  assert.equal(w2.overflow,false);
  await at(p,1);await settleWait(p);
  pass(`${name}: wheel switch drives one synchronised hand slide (${w1.x}→${w2.x}) that exits on its own`);
  // 5. keyboard switch on the last folder does not play a switch gesture
  await at(p,1);await p.keyboard.press('ArrowRight');await at(p,2);await settleWait(p);
  await p.keyboard.press('ArrowRight');await p.waitForTimeout(300);const edge=await hand(p);
  assert.equal(edge.hidden,true);pass(`${name}: boundary arrow press plays no switch gesture`);
  // 6. rapid consecutive input: one gesture per real switch, no orphan foreground
  const events=[];await p.evaluate(()=>{window.__sw=0;document.querySelector('.main-folder').addEventListener('folder:interaction',e=>{if(e.detail.type==='switch-start')window.__sw++;});});
  for(let i=0;i<6;i++){await p.keyboard.press('ArrowLeft');await p.waitForTimeout(80);}
  await p.waitForTimeout(2200);const rapid=await hand(p);const switches=await p.evaluate(()=>window.__sw);
  assert.equal(rapid.hidden,true);assert.equal(rapid.animations,0);assert.ok(switches<=2&&switches>=1);
  assert.ok(['0','1','2'].includes(await p.evaluate(()=>document.querySelector('.main-folder').dataset.index)));
  pass(`${name}: rapid input produced ${switches} switch(es) for 6 presses, no stacked gesture, no orphan foreground`);
  // 7. gesture layer never intercepts input, and returning to CV restores the checkpoint frame
  assert.equal(await p.evaluate(()=>getComputedStyle(document.querySelector('.hand-guide-anchor')).pointerEvents),'none');
  const here=await p.evaluate(()=>Number(document.querySelector('.main-folder').dataset.index));
  for(let i=here;i>0;i--){await p.keyboard.press('ArrowLeft');await at(p,i-1);await p.waitForTimeout(750);}
  await settleWait(p);await p.mouse.move(0,0);await p.evaluate(()=>document.activeElement instanceof HTMLElement&&document.activeElement.blur());
  await p.waitForTimeout(400);
  assert.ok(same(await p.screenshot(),baseline),`${name}: settled frame must match the checkpoint`);
  pass(`${name}: foreground stays pointer-events:none and returning to CV reproduces the checkpoint frame exactly`);
  assert.equal(errors.length,0,errors.join(' | '));pass(`${name}: zero JavaScript errors`);
  await p.close();
 }
 // 8. reduced motion keeps the frozen static fallback and never animates
 for(const[name,width,height]of[['desktop',1440,900],['mobile',390,844]]){
  const r=await browser.newPage({viewport:{width,height},isMobile:name==='mobile',hasTouch:name==='mobile',reducedMotion:'reduce'});
  await r.goto(base,{waitUntil:'domcontentloaded'});await r.waitForFunction(()=>document.querySelector('.hand-guide-anchor').dataset.state==='reduced',{},{timeout:20000});
  const pose=await r.evaluate(()=>{const f=document.querySelector('.main-folder').getBoundingClientRect(),a=document.querySelector('.hand-guide-actor');const vw=f.width*388/460,hw=vw*.95*480/464,hh=hw*620/480;const inner=innerWidth<=700?0:.06;const m=(getComputedStyle(a).transform.match(/-?[\d.]+(?:[eE][-+]?\d+)?/g)||[]).map(Number);return{inline:a.style.transform,expected:`translate(${.07*vw-hw*.35}px,${(-.02+inner)*hh}px) rotate(14deg)`,ex:.07*vw-hw*.35,ey:(-.02+inner)*hh,deg:m.length>=6?Math.atan2(m[1],m[0])*180/Math.PI:NaN,mx:m[4],my:m[5],animations:document.getAnimations().length,swipeNoteHidden:getComputedStyle(document.querySelector('.swipe-note svg')).visibility};});
  assert.match(pose.inline,/rotate\(14deg\)$/,`${name}: reduced pose must be the frozen 1.18s pose`);
  assert.ok(Math.abs(pose.mx-pose.ex)<.01&&Math.abs(pose.my-pose.ey)<.01&&Math.abs(pose.deg-14)<.01,`${name}: reduced pose matrix must match the frozen pose`);
  assert.equal(pose.animations,0);
  assert.equal(pose.swipeNoteHidden,'hidden');
  await r.screenshot({path:`${out}/screenshots/${name}-reduced.png`});
  if(name==='mobile'){await r.setViewportSize({width:1440,height:900});await r.waitForFunction(()=>Math.abs(parseFloat(document.querySelector('.hand-guide-anchor').style.width)-document.querySelector('.main-folder').getBoundingClientRect().width*388/460*.95*480/464)<.01,{},{timeout:4000});
   assert.equal(await r.evaluate(()=>document.getAnimations().length),0);
   assert.equal(await r.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);}
  await r.keyboard.press('ArrowRight');await at(r,1);
  assert.equal(await r.evaluate(()=>document.getAnimations().length),0);assert.equal(await r.locator('.hand-guide-anchor').isHidden(),true);
  await r.emulateMedia({reducedMotion:'no-preference'});await r.waitForTimeout(600);
  assert.equal(await r.locator('.hand-guide-anchor').isHidden(),true);assert.equal(await r.evaluate(()=>document.querySelector('.hand-guide-actor').getAnimations().length),0);
  pass(`${name}: reduced motion shows the frozen static hand, resizes with it, dismisses on first input and never replays`);
  await r.close();
 }
 // 9. toggling reduced motion mid-intro replaces motion with the frozen pose
 const t=await browser.newPage({viewport:{width:1440,height:900}});
 await t.goto(base,{waitUntil:'domcontentloaded'});await t.waitForFunction(()=>document.querySelector('.hand-guide-anchor').dataset.state==='intro',{},{timeout:20000});
 await t.emulateMedia({reducedMotion:'reduce'});await t.waitForTimeout(250);
 assert.equal(await t.locator('.hand-guide-anchor').getAttribute('data-state'),'reduced');
 assert.equal(await t.evaluate(()=>document.querySelector('.hand-guide-actor').getAnimations().length),0);
 pass('toggling reduced motion mid-intro replaces the motion with the approved static pose');
 // 10. no second yellow hand while the big hand is on screen
 const v=await browser.newPage({viewport:{width:1440,height:900}});
 await load(v);await v.mouse.move(720,470);await v.mouse.down();await v.mouse.move(560,470,{steps:8});await v.waitForTimeout(160);
 const during=await v.evaluate(()=>({big:document.querySelector('.hand-guide-anchor').hidden,small:getComputedStyle(document.querySelector('.swipe-note svg')).visibility}));
 await v.mouse.up();await v.waitForTimeout(1200);
 const afterSmall=await v.evaluate(()=>getComputedStyle(document.querySelector('.swipe-note svg')).visibility);
 assert.equal(during.big,false);assert.equal(during.small,'hidden');assert.equal(afterSmall,'visible');
 pass('the small yellow hand is hidden while the big hand is on screen and restored once it has exited');
 await v.close();await t.close();
 await writeFile(out+'/results.json',JSON.stringify({checks,measurements},null,2));
 console.log(`\n${checks.length} checks passed`);
}finally{await browser.close();await new Promise(r=>server.close(r));}
