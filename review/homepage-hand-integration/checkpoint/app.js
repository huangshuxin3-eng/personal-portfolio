// Data and SVG are kept separate so the same illustration can serve all three folders.
export const folders = [
  { id: "cv", title: "my cv", subtitle: "A little about me.", route: "/cv", colors: ["#98EBE9", "#7978E3", "#4229E8"] },
  { id: "portfolio", title: "selected work", subtitle: "LegalTrace — product case study", route: "/portfolio", colors: ["#E9A0D9", "#F06B76", "#D9485C"] },
  { id: "demo", title: "watch the demo", subtitle: "See LegalTrace in action.", route: "/demo", colors: ["#BCAAF5", "#7978E3", "#4229E8"] },
];

// Editable layers: back tab, angled side, two paper sheets, front tab/cover.
// Noise is clipped to the cover and blends into its colour, rather than the page.
export function FolderIllustration(folder, instance) {
  const [light, mid, dark] = folder.colors;
  const id = `folder-${instance}`;
  // Visible silhouette: 388 × 292 (1.33:1). The side is a narrow connected fold.
  const front = "M36 100H151Q172 100 180 125H357L387 322H76Z";
  return `<svg class="folder-illustration" viewBox="0 0 460 350" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs>
      <linearGradient id="${id}-front" x1=".7" y1=".08" x2=".12" y2="1"><stop offset="0" stop-color="${light}"/><stop offset=".48" stop-color="${light}"/><stop offset="1" stop-color="${mid}"/></linearGradient>
      <linearGradient id="${id}-side" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${mid}"/><stop offset=".4" stop-color="${dark}"/><stop offset="1" stop-color="${dark}"/></linearGradient>
      <filter id="${id}-grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".6" numOctaves="1" seed="17" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncR type="linear" slope="2.8" intercept="-.9"/><feFuncG type="linear" slope="2.8" intercept="-.9"/><feFuncB type="linear" slope="2.8" intercept="-.9"/><feFuncA type="linear" slope=".82"/></feComponentTransfer><feComposite in2="SourceAlpha" operator="in"/><feBlend in2="SourceGraphic" mode="soft-light"/></filter>
      <clipPath id="${id}-clip"><path d="${front}"/></clipPath>
    </defs>
    <path d="M98 65H185L194 30H294Q323 30 332 63L398 70L424 87L398 322H76Z" fill="${dark}" filter="url(#${id}-grain)"/>
    <path d="m398 87 26 0-26 235h-11Z" fill="url(#${id}-side)"/>
    <path d="m105 85 289-10 2 237-301 3Z" fill="#E6E0DC"/>
    <path d="m93 91 292-7 9 229-299 3Z" fill="#F0EBE5"/>
    <path d="m82 97 292-9 14 225-297 5Z" fill="#FFFCF5"/>
    <g stroke="#756E76" stroke-width="1.6" opacity=".5"><path d="m199 99 1 14m21-15 1 14m21-15 1 14m21-15 1 14m21-15 1 14m21-15 1 14m21-15 1 14"/></g>
    <path d="${front}" fill="url(#${id}-front)"/>
    <g clip-path="url(#${id}-clip)"><path d="${front}" fill="url(#${id}-front)" filter="url(#${id}-grain)"/></g>
  </svg>`;
}

document.querySelectorAll("[data-folder]").forEach((element, index) => {
  const folder = folders.find((item) => item.id === element.getAttribute('data-folder'));
  if (folder) element.innerHTML = FolderIllustration(folder, index);
});

// Slice 1: finite carousel. The SVG drawing above remains unchanged.
/** @type {HTMLDivElement} */
const stage = /** @type {HTMLDivElement} */ (document.querySelector('.main-folder'));
/** @type {HTMLElement} */
const sticker = /** @type {HTMLElement} */ (document.querySelector('.title-sticker'));
const strong = /** @type {HTMLElement} */ (sticker.querySelector('strong'));
const number = /** @type {HTMLElement} */ (document.querySelector('.folder-caption > span'));
const caption = /** @type {HTMLElement} */ (document.querySelector('.folder-caption p'));
const backgrounds = /** @type {HTMLElement[]} */ ([...document.querySelectorAll('.floating-folder')]);
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const initialCaption = caption.innerHTML;
const initialTitle = strong.innerHTML;
let stickerHeight = getComputedStyle(sticker).height;
const slides = folders.map((folder, index) => {
  const svg = index === 0 ? stage.querySelector('svg') : (() => {
    const template = document.createElement('template');
    template.innerHTML = FolderIllustration(folder, `slide-${index}`);
    return template.content.firstElementChild;
  })();
  const slide = /** @type {SVGSVGElement} */ (svg);
  slide.classList.add('carousel-slide');
  slide.toggleAttribute('hidden', index !== 0);
  if (index !== 0) stage.append(slide);
  return slide;
});
stage.setAttribute('role', 'group');
stage.setAttribute('aria-roledescription', 'carousel');
stage.setAttribute('aria-label', '文件夹：CV。左右方向键切换，共三个文件夹');
stage.tabIndex = 0;
const status = document.createElement('span');
status.className = 'carousel-status';
status.setAttribute('aria-live', 'polite');
status.setAttribute('aria-atomic', 'true');
stage.after(status);
let current = 0, locked = false, wheelTotal = 0, wheelUsed = false;
/** @type {ReturnType<typeof setTimeout> | undefined} */
let wheelQuiet;
/** @type {Animation[]} */
let animations = [];
/** @type {{id:number,startX:number,startY:number,dx:number,axis:string,samples:{x:number,t:number}[]} | null} */
let drag = null;
/** @type {number | null} */
let dragFrame = null;
const duration = 640;
const ease = 'cubic-bezier(.22, 1.08, .36, 1)';
const titles = [initialTitle, 'my<br>work', 'my<br>demo'];
const labels = ['CV', 'Portfolio', 'Demo'];
const subtitles = [initialCaption, 'Selected work.<br><span>Product thinking / Digital making</span>', 'Watch the demo.<br><span>Ideas in motion / Products in action</span>'];
function travel() { return stage.clientWidth * 1.14; }
/** @param {SVGSVGElement} slide @param {number} x @param {number} scale @param {number} rotate @param {number} opacity */
function pose(slide, x, scale = 1, rotate = 0, opacity = 1) {
  slide.style.transform = `translateX(${x}px) scale(${scale}) rotate(${rotate}deg)`;
  slide.style.opacity = String(opacity);
}
/** @param {number} dx */
function parallax(dx) {
  if (reduced.matches) return;
  backgrounds.forEach((el, i) => { el.style.translate = `${dx * [0.018, -0.012, 0.008, -0.022, 0.014][i]}px 0`; });
}
function reset() {
  slides.forEach((slide, i) => { slide.toggleAttribute('hidden', i !== current); slide.style.removeProperty('transform'); slide.style.removeProperty('opacity'); });
  backgrounds.forEach(el => el.style.removeProperty('translate'));
  stage.classList.remove('is-dragging');
  stage.removeAttribute('aria-busy');
  stage.dataset.index = String(current);
}
function updateText() {
  // Keep the original sticker's reserved height even when a label has different glyphs.
  sticker.style.height = stickerHeight;
  strong.innerHTML = titles[current];
  number.textContent = `${String(current + 1).padStart(2, '0')} / 03`;
  caption.innerHTML = subtitles[current];
  stage.setAttribute('aria-label', `文件夹：${labels[current]}。左右方向键切换，共三个文件夹`);
  status.textContent = `${current + 1} / 3，${labels[current]}`;
}
/** @param {number} target @param {number} [dx] */
async function settle(target, dx = 0) {
  if (locked) return;
  target = Math.max(0, Math.min(folders.length - 1, target));
  const previous = current, direction = Math.sign(target - previous), distance = travel();
  locked = true; stage.setAttribute('aria-busy', 'true');
  if (!reduced.matches) {
    const outgoing = slides[previous];
    const from = { transform: outgoing.style.transform || 'translateX(0px) scale(1) rotate(0deg)', opacity: outgoing.style.opacity || '1' };
    animations.push(outgoing.animate([from, { transform: `translateX(${-direction * distance}px) scale(${direction ? .9 : 1}) rotate(${-direction * 8}deg)`, opacity: direction ? 0 : 1 }], { duration: direction ? duration : 550, easing: ease, fill: 'both' }));
    if (direction) {
      const incoming = slides[target]; incoming.removeAttribute('hidden');
      const progress = Math.min(1, Math.abs(dx) / distance);
      animations.push(incoming.animate([
        { transform: incoming.style.transform || `translateX(${direction * distance + dx}px) scale(${.9 + progress * .1}) rotate(${direction * 8 * (1 - progress)}deg)`, opacity: incoming.style.opacity || String(progress) },
        { transform: 'translateX(0px) scale(1) rotate(0deg)', opacity: 1 }
      ], { duration, easing: ease, fill: 'both' }));
    }
    if (!direction) slides.forEach((slide, i) => {
      if (i !== current && !slide.hasAttribute('hidden')) animations.push(slide.animate([{ transform: slide.style.transform, opacity: slide.style.opacity }, { transform: 'translateX(' + (i > current ? distance : -distance) + 'px) scale(.9)', opacity: 0 }], { duration: 550, easing: ease, fill: 'both' }));
    });
    backgrounds.forEach((el, i) => {
      const offset = -direction * [11, -7, 4, -13, 8][i];
      animations.push(el.animate([{ translate: el.style.translate || '0px 0' }, { translate: `${offset}px 0`, offset: .45 }, { translate: '0px 0' }], { duration: direction ? duration : 550, easing: ease, fill: 'both' }));
    });
    // Text switches at the midpoint without changing the layout.
    if (direction) {
      const text = [strong, number, caption];
      const fades = text.map(el => el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, fill: 'both' }));
      animations.push(...fades);
      await Promise.all(fades.map(a => a.finished.catch(() => {})));
      current = target; updateText(); fades.forEach(a => a.cancel()); animations = animations.filter(a => !fades.includes(a));
      animations.push(...text.map(el => el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 220, fill: 'both' })));
    }
    await Promise.all(animations.map(a => a.finished.catch(() => {})));
  } else { current = target; if (direction) updateText(); }
  animations.forEach(a => a.cancel()); animations = [];
  reset(); locked = false;
}
/** @param {number} direction */
function step(direction) { if (!locked && !drag && current + direction >= 0 && current + direction < folders.length) void settle(current + direction); }
window.addEventListener('wheel', event => {
  if (event.ctrlKey) return; // Preserve pinch-to-zoom.
  event.preventDefault();
  clearTimeout(wheelQuiet);
  wheelQuiet = setTimeout(() => { wheelTotal = 0; wheelUsed = false; }, 220);
  if (locked || drag || wheelUsed) { wheelUsed = true; return; }
  const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
  const pixels = delta * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? innerHeight : 1);
  if (Math.sign(pixels) !== Math.sign(wheelTotal)) wheelTotal = 0;
  wheelTotal += pixels;
  if (Math.abs(wheelTotal) >= 80) { wheelUsed = true; step(Math.sign(wheelTotal)); }
}, { passive: false });
window.addEventListener('keydown', event => {
  if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement || (event.target instanceof HTMLElement && event.target.isContentEditable)) return;
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); if (!event.repeat) step(event.key === 'ArrowRight' ? 1 : -1); }
});
stage.addEventListener('pointerdown', event => {
  if (locked || drag || !event.isPrimary || event.button !== 0) return;
  drag = { id: event.pointerId, startX: event.clientX, startY: event.clientY, dx: 0, axis: '', samples: [{ x: event.clientX, t: performance.now() }] };
});
/** @param {number} dx */
function follow(dx) {
  const direction = dx < 0 ? 1 : -1, target = current + direction, distance = travel();
  const hasNext = target >= 0 && target < folders.length;
  const offset = hasNext ? Math.sign(dx) * distance * (1 - Math.exp(-Math.abs(dx) / distance)) : dx * .2;
  const progress = Math.min(.92, Math.abs(offset) / distance);
  slides.forEach((s, i) => { s.toggleAttribute('hidden', i !== current && i !== target); });
  pose(slides[current], offset, 1 - progress * .08, offset / distance * 8, 1 - progress * .65);
  if (hasNext) pose(slides[target], direction * distance + offset, .9 + progress * .1, direction * 8 * (1 - progress), progress);
  parallax(offset);
}
window.addEventListener('pointermove', event => {
  if (!drag || drag.id !== event.pointerId) return;
  const dx = event.clientX - drag.startX, dy = event.clientY - drag.startY;
  if (!drag.axis && Math.max(Math.abs(dx), Math.abs(dy)) > 7) {
    drag.axis = Math.abs(dx) > Math.abs(dy) * 1.15 ? 'x' : 'y';
    if (drag.axis === 'x') { stage.setPointerCapture(event.pointerId); stage.classList.add('is-dragging'); }
  }
  if (drag.axis !== 'x') return;
  drag.dx = dx; const now = performance.now();
  drag.samples.push({ x: event.clientX, t: now }); drag.samples = drag.samples.filter(s => now - s.t <= 100);
  if (dragFrame === null) dragFrame = requestAnimationFrame(() => { dragFrame = null; if (drag) follow(drag.dx); });
});
/** @param {PointerEvent} event @param {boolean} [cancelled] */
function release(event, cancelled = false) {
  if (!drag || event.pointerId !== drag.id) return;
  const gesture = drag; drag = null;
  if (dragFrame !== null) { cancelAnimationFrame(dragFrame); dragFrame = null; }
  if (stage.hasPointerCapture(event.pointerId)) stage.releasePointerCapture(event.pointerId);
  stage.classList.remove('is-dragging');
  if (gesture.axis !== 'x') return;
  const now = performance.now(), recent = gesture.samples.filter(s => now - s.t <= 100), first = recent[0];
  const velocity = first ? (event.clientX - first.x) / Math.max(1, now - first.t) : 0;
  const distancePassed = Math.abs(gesture.dx) >= Math.min(100, stage.clientWidth * .18);
  const velocityPassed = Math.abs(gesture.dx) >= 18 && Math.abs(velocity) > .5 && Math.sign(velocity) === Math.sign(gesture.dx);
  const direction = gesture.dx < 0 ? 1 : -1;
  const target = !cancelled && (distancePassed || velocityPassed) ? current + direction : current;
  void settle(target, gesture.dx);
}
window.addEventListener('pointerup', event => release(event));
window.addEventListener('pointercancel', event => release(event, true));
reduced.addEventListener('change', () => { if (reduced.matches) animations.forEach(a => a.finish()); });
window.addEventListener('resize', () => {
  // Restore the responsive sticker's natural height after the viewport changes.
  sticker.style.removeProperty('height');
  const title = strong.innerHTML; strong.innerHTML = initialTitle; stickerHeight = getComputedStyle(sticker).height; strong.innerHTML = title; if (current !== 0) sticker.style.height = stickerHeight;
});
reset();



