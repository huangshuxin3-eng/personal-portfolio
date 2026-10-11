import {chromium} from 'file:///C:/Users/黄舒心/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';import {createServer} from 'node:http';import {readFile,writeFile} from 'node:fs/promises';import path from 'node:path';import assert from 'node:assert/strict';
const base=process.cwd(),server=createServer(async(req,res)=>{try{const u=decodeURI(req.url.split('?')[0]);const f=path.join(base,u==='/'?'index.html':u);const ext=path.extname(f);res.setHeader('Content-Type',({'.svg':'image/svg+xml','.css':'text/css','.js':'text/javascript','.png':'image/png','.webm':'video/webm'})[ext]||'text/html');res.end(await readFile(f));}catch{res.writeHead(404);res.end();}});await new Promise(r=>server.listen(0,'127.0.0.1',r));const url=`http://127.0.0.1:${server.address().port}`,browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
try{for(const[name,width,height]of [['desktop',1440,900],['mobile',390,844]]){
const ctx=await browser.newContext({viewport:{width,height},recordVideo:{dir:'recordings/clean',size:{width,height}}});
const p=await ctx.newPage();await p.goto(url+'/?autoplay=0',{waitUntil:'networkidle'});await p.waitForFunction(()=>document.querySelector('#scene').dataset.ready==='true');
assert.equal(await p.evaluate(()=>document.querySelector('#scene').dataset.state),'paused');
await p.waitForTimeout(500);await p.evaluate(()=>window.dispatchEvent(new Event('hand-preview-play')));
await p.waitForFunction(()=>document.querySelector('#scene').dataset.state==='exited');await p.waitForTimeout(800);
const video=p.video();await ctx.close();await video.saveAs(`recordings/hand-motion-${name}.webm`);console.log(name+' clean recording saved');
}}finally{await browser.close();await new Promise(r=>server.close(r));}
