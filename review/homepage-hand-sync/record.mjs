// Records the acceptance clips for the interaction-synchronisation round.
import {chromium} from 'file:///C:/Users/黄舒心/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import {createServer} from 'node:http';import {readFile,mkdir} from 'node:fs/promises';import path from 'node:path';
const root=process.cwd(),out='review/homepage-hand-sync/recordings';await mkdir(out+'/raw',{recursive:true});
const server=createServer(async(req,res)=>{try{const u=decodeURI(req.url.split('?')[0]),f=path.join(root,'dist',u==='/'?'index.html':u);res.setHeader('Content-Type',({'.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml'})[path.extname(f)]||'text/html');res.end(await readFile(f));}catch{res.writeHead(404);res.end();}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const url=`http://127.0.0.1:${server.address().port}`;
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
/** @param {any} p */
const idx=p=>p.evaluate(()=>document.querySelector('.main-folder').dataset.index);
/** @param {any} p @param {string} s */
const wait=(p,s)=>p.waitForFunction(state=>document.querySelector('.hand-guide-anchor').dataset.state===state,s,{timeout:20000});
try{
 for(const[name,width,height]of[['desktop',1440,900],['mobile',390,844]]){
  const c=await browser.newContext({viewport:{width,height},isMobile:name==='mobile',hasTouch:name==='mobile',recordVideo:{dir:out+'/raw',size:{width,height}}});
  const p=await c.newPage();
  // slow, stepped drag so the coupling between pointer and hand is legible in the clip
  const drag=async dx=>{const b=await p.locator('.main-folder').boundingBox(),x=b.x+b.width/2,y=b.y+b.height/2;
   if(name==='mobile'){const d=await c.newCDPSession(p);await d.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});
    for(let i=1;i<=14;i++){await d.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x+dx*i/14,y}]});await p.waitForTimeout(38);}
    await p.waitForTimeout(320);await d.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await d.detach();}
   else{await p.mouse.move(x,y);await p.mouse.down();
    for(let i=1;i<=14;i++){await p.mouse.move(x+dx*i/14,y);await p.waitForTimeout(38);}
    await p.waitForTimeout(320);await p.mouse.up();}};
  await p.goto(url,{waitUntil:'domcontentloaded'});
  // 1. first entry: the hand performs its automatic swipe demo, then leaves the composition intact
  await wait(p,'intro');await p.waitForTimeout(200);await wait(p,'exited');await p.waitForTimeout(700);
  if(name==='desktop'){
   // 2. mouse drag left: the hand travels left with the pointer
   await drag(-250);await p.waitForTimeout(1100);
   // 3. mouse drag right: the hand travels right with the pointer, back to CV
   await drag(250);await p.waitForTimeout(1100);
   // 4. wheel: discrete switch with a short directional hand slide
   await p.mouse.move(width/2,height-120);await p.mouse.wheel(0,150);await p.waitForTimeout(1500);
   // 5. input stops: the hand exits and the frame is restored
   await p.mouse.move(20,20);await p.waitForTimeout(900);
  }else{
   await drag(-170);await p.waitForTimeout(1200);
   await drag(170);await p.waitForTimeout(1200);
   await p.waitForTimeout(400);
  }
  console.log(name,'final index',await idx(p));
  const video=p.video();await c.close();await video.saveAs(`${out}/homepage-${name}.webm`);console.log(name+' recording saved');
 }
}finally{await browser.close();await new Promise(r=>server.close(r));}
