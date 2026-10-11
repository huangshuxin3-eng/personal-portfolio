// Records the acceptance clip for Motion Refinement 1 (desktop 1440x900) plus its frame evidence.
import { chromium } from 'file:///C:/Users/黄舒心/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import { createServer } from 'node:http';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
const root = process.cwd(), out = 'review/homepage-motion-refinement-1/recordings';
await mkdir(out + '/raw', { recursive: true });
const server = createServer(async (req, res) => {
  try { const u = decodeURI(req.url.split('?')[0]), f = path.join(root, 'dist', u === '/' ? 'index.html' : u); res.setHeader('Content-Type', ({ '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml' })[path.extname(f)] || 'text/html'); res.end(await readFile(f)); } catch { res.writeHead(404); res.end(); }
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const url = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
const at = (p, i) => p.waitForFunction((i) => document.querySelector('.main-folder').dataset.index === String(i) && !document.querySelector('.main-folder').hasAttribute('aria-busy'), i, { timeout: 10000 });
const quiet = (p, ms) => p.waitForTimeout(ms);
const errors = [];
/** @param {any} p @param {number} dx @param {number} [hold] @param {number} [back] */
async function gesture(p, dx, hold = 320, back = 0) {
  const b = await p.locator('.main-folder').boundingBox(), x = b.x + b.width / 2, y = b.y + b.height / 2;
  await p.mouse.move(x, y); await p.mouse.down();
  const step = Math.max(1, Math.round(Math.abs(dx) / 16));
  for (let i = 1; i <= step; i++) { await p.mouse.move(x + dx * i / step, y); await p.waitForTimeout(26); }
  await quiet(p, hold);
  if (back) { const s2 = Math.max(1, Math.round(Math.abs(back) / 12)); for (let i = 1; i <= s2; i++) { await p.mouse.move(x + dx + back * i / s2, y); await p.waitForTimeout(26); } await quiet(p, 260); }
  await p.mouse.up();
}
try {
  const c = await browser.newContext({ viewport: { width: 1440, height: 900 }, recordVideo: { dir: out + '/raw', size: { width: 1440, height: 900 } } });
  const p = await c.newPage();
  p.on('pageerror', (e) => errors.push(e.message));
  await p.goto(url, { waitUntil: 'domcontentloaded' });
  // Scene 0 — first entry: the accepted intro plays and clears.
  await p.waitForFunction(() => document.querySelector('.hand-guide-anchor').dataset.state === 'intro', {}, { timeout: 20000 });
  await p.waitForFunction(() => { const h = document.querySelector('.hand-guide-anchor'); return h.hidden || h.dataset.state === 'exited'; }, {}, { timeout: 20000 });
  await quiet(p, 900);
  // Scene 1 — CV -> Portfolio.
  await p.keyboard.press('ArrowRight'); await at(p, 1); await quiet(p, 1300);
  // Scene 2 — Portfolio -> Demo.
  await p.keyboard.press('ArrowRight'); await at(p, 2); await quiet(p, 1300);
  // Scene 3 — Demo -> Portfolio -> CV.
  await p.keyboard.press('ArrowLeft'); await at(p, 1); await quiet(p, 1100);
  await p.keyboard.press('ArrowLeft'); await at(p, 0); await quiet(p, 1300);
  // Scene 4 — drag released part-way (below the commit threshold): the cut rewinds, no switch.
  await gesture(p, -92, 420); await quiet(p, 1400);
  // Scene 5 — reverse drag: the cut opens, then the pointer reverses and the cut rewinds with it.
  await gesture(p, -210, 380, 300); await quiet(p, 1500);
  // Scene 6 — rapid consecutive switching must still advance one folder at a time.
  for (let i = 0; i < 3; i++) { await p.keyboard.press('ArrowRight'); await quiet(p, 90); }
  await at(p, 1); await quiet(p, 1200);
  for (let i = 0; i < 2; i++) { await p.keyboard.press('ArrowLeft'); await quiet(p, 90); }
  await at(p, 0); await quiet(p, 1200);
  const finalState = await p.evaluate(() => ({ index: document.querySelector('.main-folder').dataset.index, caption: document.querySelector('.folder-caption > span').textContent, clips: [...document.querySelectorAll('.carousel-slide')].map((s) => s.style.clipPath || '-') }));
  await quiet(p, 600);
  const video = p.video(); await c.close(); await video.saveAs(`${out}/motion-desktop.webm`);
  await writeFile(`${out}/final-state.json`, JSON.stringify({ finalState, errors }, null, 2));
  console.log('final', JSON.stringify(finalState), 'pageerrors', errors.length);
} finally { await browser.close(); await new Promise((r) => server.close(r)); }
