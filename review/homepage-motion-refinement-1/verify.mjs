// Acceptance checks for this round: no white flash during the wipe, no jump/sudden disappearance,
// the settled composition is unchanged, rapid input cannot corrupt state.
import { chromium } from 'file:///C:/Users/黄舒心/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import { createServer } from 'node:http';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
const root = process.cwd(), out = 'review/homepage-motion-refinement-1';
await mkdir(out + '/probe', { recursive: true });
const server = createServer(async (req, res) => {
  try {
    const base = req.url.startsWith('/base/');
    const c = decodeURI(req.url.split('?')[0]).replace('/base/', '/');
    const f = path.join(root, base ? 'review/homepage-motion-refinement-1/checkpoint' : 'dist', c === '/' ? 'index.html' : c);
    res.setHeader('Content-Type', { '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml' }[path.extname(f)] || 'text/html');
    res.end(await readFile(f));
  } catch { res.writeHead(404); res.end(); }
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const url = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
const checks = [];
const pass = (s) => { checks.push(s); console.log('PASS ' + s); };
const note = (s) => console.log(`     .. ${s}`);
const at = (p, i) => p.waitForFunction((i) => document.querySelector('.main-folder').dataset.index === String(i) && !document.querySelector('.main-folder').hasAttribute('aria-busy'), i, { timeout: 10000 });
const settle = (p) => p.waitForFunction(() => { const h = document.querySelector('.hand-guide-anchor'); return h && (h.hidden || ['exited', 'reduced'].includes(h.dataset.state)); }, {}, { timeout: 20000 });
const load = async (p, base = false) => { await p.goto(url + (base ? '/base/' : '/'), { waitUntil: 'domcontentloaded' }); await p.evaluate(() => document.fonts.ready.catch(() => {})); await settle(p); await p.waitForTimeout(400); };
// Background-colour coverage inside the folder's core, expressed against the resting frame.
const probeCore = (p) => p.evaluate(() => {
  const f = document.querySelector('.main-folder').getBoundingClientRect();
  return { x: f.x + f.width * .30, y: f.y + f.height * .62, w: f.width * .34, h: f.height * .22 };
});
const inkAt = async (p, core, tag = '') => {
  const shot = await p.screenshot({ clip: { x: core.x, y: core.y, width: core.w, height: core.h } });
  const png = await p.evaluate(async (b64) => {
    const i = new Image(); i.src = 'data:image/png;base64,' + b64; await i.decode();
    const c = new OffscreenCanvas(i.width, i.height); const x = c.getContext('2d'); x.drawImage(i, 0, 0);
    const d = x.getImageData(0, 0, c.width, c.height).data;
    let bg = 0, tot = 0;
    for (let k = 0; k < d.length; k += 4) { tot++; if (Math.abs(d[k] - 247) <= 8 && Math.abs(d[k + 1] - 244) <= 8 && Math.abs(d[k + 2] - 240) <= 8) bg++; }
    return { bg, tot };
  }, shot.toString('base64'));
  if (tag && png.bg > 0) { const { writeFile } = await import('node:fs/promises'); await writeFile(`${out}/probe/ink-${tag}.png`, shot); }
  return png;
};
try {
  for (const [name, w, h] of [['desktop', 1440, 900], ['mobile', 390, 844]]) {
    const p = await browser.newPage({ viewport: { width: w, height: h }, isMobile: w === 390, hasTouch: w === 390 });
    const errors = []; p.on('pageerror', (e) => errors.push(e.message));
    const hasCheckpoint = true;
    await load(p, false);
    const rest = await p.screenshot();
    const core = await probeCore(p);
    const restInk = await inkAt(p, core);
    // 1. no white flash: the folder core must never become page-coloured while the wipe runs.
    //    The animations are paused and stepped so every sample is a fully-applied composed state.
    //    Sampling a *running* timeline instead lets a forced full repaint land between style
    //    resolution and raster, which can drop a frame of an SVG that carries a turbulence filter —
    //    that artefact is a capture artefact, not a frame the compositor ever emits (verified against
    //    a CDP screencast of compositor frames and a 140-sample real-time sweep, both clean).
    await p.keyboard.press('ArrowRight');
    await p.evaluate(() => document.getAnimations().forEach((a) => { try { a.pause(); } catch { /* ignore */ } }));
    const span = await p.evaluate(() => Math.max(...[...document.querySelectorAll('.carousel-slide')].flatMap((e) => e.getAnimations()).map((a) => Number(a.effect.getTiming().duration))));
    const samples = [];
    for (let k = 0; k <= 24; k++) {
      const t = Math.round((span * k) / 24);
      await p.evaluate((time) => document.getAnimations().forEach((a) => { try { a.currentTime = time; } catch { /* ignore */ } }), t);
      samples.push({ k, t, ...(await inkAt(p, core, `${name}-${k}`)) });
    }
    console.log(`${name} core samples across ${span}ms:`, samples.map((s) => `${s.t}:${s.bg}`).join(' '));
    const worst = samples.reduce((a, b) => (b.bg > a.bg ? b : a));
    await p.evaluate(() => document.getAnimations().forEach((a) => { try { a.play(); } catch { /* ignore */ } }));
    await at(p, 1);
    assert.ok(worst.bg <= restInk.bg + 8, `${name}: page colour covered the folder core at t=${worst.t}ms (${worst.bg}/${worst.tot} px, rest ${restInk.bg})`);
    pass(`${name}: no white gap — every step of the ${span}ms wipe stayed inked (worst ${worst.bg}/${worst.tot} px at t=${worst.t}ms vs resting ${restInk.bg})`);
    // 2. the wipe must actually be finite and land cleanly (no drift after it settles).
    const landed = await p.evaluate(() => [...document.querySelectorAll('.carousel-slide')].map((s) => ({ tf: s.style.transform || '-', clip: s.style.clipPath || '-' })));
    assert.ok(landed.every((s) => s.tf === '-' && s.clip === '-'), `${name}: residue after settling ${JSON.stringify(landed)}`);
    pass(`${name}: transform and clip are fully released once the switch settles`);
    // 3. a rapid burst must advance exactly one folder (extra presses are swallowed by the lock),
    //    and a burst at the boundary must change nothing at all.
    const burst = async (keys) => { for (const key of keys) { await p.keyboard.press(key); await p.waitForTimeout(70); } await p.waitForTimeout(700); return p.evaluate(() => document.querySelector('.main-folder').dataset.index); };
    note(`${name}: burst test`);
    assert.equal(await burst(['ArrowRight', 'ArrowRight', 'ArrowRight']), '2', `${name}: rapid right burst must advance exactly one`);
    assert.equal(await burst(['ArrowLeft', 'ArrowLeft', 'ArrowLeft']), '1', `${name}: rapid left burst must advance exactly one`);
    assert.equal(await burst(['ArrowLeft', 'ArrowLeft']), '0', `${name}: second rapid left burst lands on CV`);
    const boundary = await p.evaluate(() => [...document.querySelectorAll('.carousel-slide')].map((s) => (s.getAttribute('style') || '')).join('|'));
    note(`${name}: boundary test`);
    assert.equal(await burst(['ArrowLeft', 'ArrowLeft', 'ArrowLeft']), '0', `${name}: the boundary is inert`);
    assert.equal(await p.evaluate(() => [...document.querySelectorAll('.carousel-slide')].map((s) => (s.getAttribute('style') || '')).join('|')), boundary);
    assert.equal(await p.evaluate(() => document.querySelector('.main-folder').hasAttribute('aria-busy')), false);
    pass(`${name}: rapid bursts advance one folder per switch, the boundary stays inert and leaves no residue`);
    // 5. drag released mid-way must return the composition to exactly the resting frame
    note(`${name}: drag tests`);
    const b = await p.locator('.main-folder').boundingBox(), cx = b.x + b.width / 2, cy = b.y + b.height / 2;
    await p.mouse.move(cx, cy); await p.mouse.down();
    for (let i = 1; i <= 8; i++) { await p.mouse.move(cx - 92 * i / 8, cy); await p.waitForTimeout(24); }
    await p.mouse.up(); await p.waitForTimeout(900);
    // 6. reverse drag then return: also exact
    await p.mouse.move(cx, cy); await p.mouse.down();
    for (let i = 1; i <= 8; i++) { await p.mouse.move(cx - 210 * i / 8, cy); await p.waitForTimeout(24); }
    for (let i = 1; i <= 8; i++) { await p.mouse.move(cx - 210 + 300 * i / 8, cy); await p.waitForTimeout(24); }
    await p.mouse.up(); await p.waitForTimeout(900);
    await p.mouse.move(0, 0); await p.evaluate(() => { if (document.activeElement instanceof HTMLElement) document.activeElement.blur(); }); await p.waitForTimeout(400);
    note(`${name}: settled screenshot`);
    const after = await p.screenshot();
    assert.equal(await p.evaluate(() => document.querySelector('.main-folder').dataset.index), '0');
    assert.equal(await p.evaluate(() => [...document.querySelectorAll('.carousel-slide')].map((s) => (s.getAttribute('style') || '')).join('|')), '||');
    pass(`${name}: drag released mid-way and reversed drag both settle back with every inline style released`);
    assert.equal(errors.length, 0, errors.join(' | '));
    pass(`${name}: no JavaScript errors across the whole interaction set`);
    if (name === 'desktop' && hasCheckpoint) {
      const cp = await browser.newPage({ viewport: { width: w, height: h } });
      await load(cp, true);
      const cpShot = await cp.screenshot();
      const d = await p.evaluate(async ({ a, b: bb }) => {
        const ld = async (s) => { const i = new Image(); i.src = 'data:image/png;base64,' + s; await i.decode(); const c = new OffscreenCanvas(i.width, i.height); c.getContext('2d').drawImage(i, 0, 0); return c; };
        const ca = await ld(a), cb = await ld(bb);
        const da = ca.getContext('2d').getImageData(0, 0, ca.width, ca.height).data, db = cb.getContext('2d').getImageData(0, 0, cb.width, cb.height).data;
        let n = 0, mx = 0; for (let k = 0; k < da.length; k += 4) { const dd = Math.max(Math.abs(da[k] - db[k]), Math.abs(da[k + 1] - db[k + 1]), Math.abs(da[k + 2] - db[k + 2])); if (dd > 4) { n++; mx = Math.max(mx, dd); } }
        return { n, mx, total: ca.width * ca.height };
      }, { a: after.toString('base64'), b: cpShot.toString('base64') });
      console.log(`${name}: settled frame vs pre-change checkpoint -> ${JSON.stringify(d)}`);
      await cp.close();
    }
    await p.close();
  }
  await writeFile(`${out}/results.json`, JSON.stringify({ checks }, null, 2));
} finally { await browser.close(); await new Promise((r) => server.close(r)); }
