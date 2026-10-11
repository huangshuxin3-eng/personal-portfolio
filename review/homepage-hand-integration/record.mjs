import {chromium} from 'file:///C:/Users/黄舒心/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import {createServer} from 'node:http';import {readFile,mkdir} from 'node:fs/promises';import path from 'node:path';
const root=process.cwd(),out='review/homepage-hand-integration/recordings';await mkdir(out,{recursive:true});
const server=createServer(async(req,res)=>{try{const u=decodeURI(req.url.split('?')[0]),f=path.join(root,'dist',u==='/'?'index.html':u);res.setHeader('Content-Type',({'.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml'})[path.extname(f)]||'text/html');res.end(await readFile(f));}catch{res.writeHead(404);res.end();}});await new Promise(r=>server.listen(0,'127.0.0.1',r));
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const at=async(p,i)=>p.waitForFunction(i=>document.querySelector('.main-folder').dataset.index===String(i)&&!document.querySelector('.main-folder').hasAttribute('aria-busy'),i);
try{for(const[name,width,height]of[['desktop',1440,900],['mobile',390,844]]){
 const c=await browser.newContext({viewport:{width,height},isMobile:name==='mobile',hasTouch:name==='mobile',recordVideo:{dir:out+'/raw',size:{width,height}}});
 const p=await c.newPage();await p.goto(`http://127.0.0.1:${server.address().port}`,{waitUntil:'networkidle'});
 await p.waitForFunction(()=>document.querySelector('.hand-guide-anchor').dataset.state==='exited');await p.waitForTimeout(700);
 const drag=async dx=>{const b=await p.locator('.main-folder').boundingBox(),x=b.x+b.width/2,y=b.y+b.height/2;if(name==='mobile'){const d=await c.newCDPSession(p);await d.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});for(let i=1;i<=12;i++){await d.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x+dx*i/12,y}]});await p.waitForTimeout(20);}await d.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await d.detach();}else{await p.mouse.move(x,y);await p.mouse.down();await p.mouse.move(x+dx,y,{steps:16});await p.mouse.up();}};
 if(name==='desktop'){await p.mouse.wheel(0,120);await at(p,1);await p.waitForTimeout(600);await p.keyboard.press('ArrowRight');await at(p,2);}else{await drag(-140);await at(p,1);await p.waitForTimeout(600);await drag(-140);await at(p,2);}
 await p.waitForTimeout(600);await drag(name==='mobile'?140:230);await at(p,1);await p.waitForTimeout(400);await drag(name==='mobile'?140:230);await at(p,0);await p.mouse.move(0,0);await p.waitForTimeout(800);
 // Reload to also show the foreground yielding immediately to real input.
 await p.reload({waitUntil:'networkidle'});await p.waitForFunction(()=>document.querySelector('.hand-guide-anchor').dataset.state==='running');await p.waitForTimeout(600);await drag(name==='mobile'?-140:-230);await at(p,1);await p.waitForTimeout(700);
 const video=p.video();await c.close();await video.saveAs(`${out}/homepage-${name}.webm`);console.log(name+' browser recording saved');
}}finally{await browser.close();await new Promise(r=>server.close(r));}
