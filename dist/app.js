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
    <path class="folder-paper" d="m105 85 289-10 2 237-301 3Z" fill="#E6E0DC"/>
    <path class="folder-paper" d="m93 91 292-7 9 229-299 3Z" fill="#F0EBE5"/>
    <path class="folder-paper" d="m82 97 292-9 14 225-297 5Z" fill="#FFFCF5"/>
    <g class="folder-paper" stroke="#756E76" stroke-width="1.6" opacity=".5"><path d="m199 99 1 14m21-15 1 14m21-15 1 14m21-15 1 14m21-15 1 14m21-15 1 14m21-15 1 14"/></g>
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
// The decorative hand foreground subscribes to this bus, so its motion is driven by the
// carousel's real direction / drag progress / switch timing instead of a second timer.
const INTERACTION = 'folder:interaction';
/** @param {string} type @param {Record<string, unknown>} [detail] */
function emit(type, detail = {}) { stage.dispatchEvent(new CustomEvent(INTERACTION, { detail: { type, index: current, ...detail } })); }
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
/** @type {{x:number,y:number,index:number} | null} */
let activation = null;
const entryFeedback = document.createElement('div');
entryFeedback.className = 'entry-feedback'; entryFeedback.hidden = true;
entryFeedback.setAttribute('role', 'status'); stage.closest('main').append(entryFeedback);
/** @type {ReturnType<typeof setTimeout> | undefined} */
let feedbackTimer;
function openEntry() {
  if (locked || drag) return;
  if (current === 0) { location.assign('/cv/'); return; }
  if (current === 1) { location.assign('/portfolio/'); return; }
  if (current === 2) { location.assign('/demo/'); return; }
}
stage.addEventListener('click', () => {
  const allowed = activation && activation.index === current;
  activation = null;
  if (allowed) openEntry();
});
stage.addEventListener('keydown', event => {
  if (event.target !== stage || !['Enter', ' '].includes(event.key)) return;
  event.preventDefault(); if (!event.repeat) openEntry();
});
// Hover only marks existing paper layers; SVG paths and paint order stay intact.
const paperHover = matchMedia('(min-width: 1024px) and (hover: hover) and (pointer: fine)');
stage.addEventListener('pointerenter', event => {
  if (event.pointerType !== 'mouse' || !paperHover.matches || locked || drag) return;
  // SVG transforms use viewBox units: compensate for the rendered scale to lift 15 screen px.
  stage.style.setProperty('--paper-lift', `${15 * 460 / stage.clientWidth}px`);
  stage.classList.add('is-paper-hover');
});
stage.addEventListener('pointerleave', () => stage.classList.remove('is-paper-hover'));
// Motion refinement 1: the switch is a short, forceful lateral wipe (reference ~1.40-1.70s), not the
// long crossfade carousel it replaces. One cut edge sweeps across the folder and both sheets stay
// fully opaque underneath it, so the frame never empties, never blends and never flashes. Timing and
// travel live here, and the hand gesture reads `duration` / `distance` straight off the emitted event.
const duration = 380;                          // main wipe stage (was 640)
const RETURN = 420;                            // a release that commits nothing settles back (was 550)
const PUSH = 0.09;                             // the outgoing sheet's own drift, as a fraction of the stage
const DRAG_SPAN = 0.42;                        // pointer travel, as a fraction of the stage, that completes the wipe
const ease = 'cubic-bezier(.2, .88, .22, 1)';  // forceful start, decelerating, no overshoot to settle on
const titles = [initialTitle, 'my<br>work', 'my<br>demo'];
const labels = ['CV', 'Portfolio', 'Demo'];
const subtitles = [initialCaption, '精选作品', '演示视频'];
/** @type {HTMLDivElement | null} */
let titleRoll = null;
/** @param {number} from @param {number} to @param {number} direction */
function rollTitle(from, to, direction) {
  titleRoll?.remove();
  const css = getComputedStyle(sticker);
  // Preserve the original line boxes and padding; only the temporary inner content moves.
  if (!sticker.style.height) stickerHeight = css.height;
  sticker.style.height = stickerHeight;
  titleRoll = document.createElement('div');
  titleRoll.className = 'sticker-roll-window';
  titleRoll.setAttribute('aria-hidden', 'true');
  titleRoll.style.inset = '0';
  const track = document.createElement('div'); track.className = 'sticker-roll-track';
  [from, to].forEach((index, i) => {
    const face = document.createElement('div'); face.className = 'sticker-roll-face';
    face.style.padding = css.padding;
    const prefix = /** @type {HTMLElement} */ (sticker.querySelector(':scope > span')).cloneNode(true);
    const heading = document.createElement('strong'); heading.innerHTML = titles[index];
    face.append(prefix, heading);
    face.style.transform = `translateY(${i * direction * 100}%)`;
    track.append(face);
  });
  titleRoll.append(track); sticker.append(titleRoll); sticker.classList.add('is-rolling');
  // Same animation batch, duration, easing and lock as the folder wipe; no separate timer.
  animations.push(track.animate([
    { transform: 'translateY(0%)' },
    { transform: `translateY(${-direction * 100}%)` }
  ], { duration, easing: ease, fill: 'both' }));
}
/** @param {number} direction @param {number} t 0..1 @returns {{ from: string, to: string, incoming: string, incomingEnd: string }} */
// One cut edge sweeping from the entry side to the exit side is the whole transition. `t` is the eased
// advance. The outgoing drifts by PUSH while it is cut, so its own cut is offset by that drift
// (`100 * t * (1 - PUSH)`) — that keeps both cut edges on a single line and leaves no seam to flash.
function cuts(direction, t) {
  const out = (100 * t * (1 - PUSH)).toFixed(4), inc = (100 * (1 - t)).toFixed(4);
  return direction > 0
    ? { from: `inset(0 ${out}% 0 0)`, to: `inset(0 ${(100 * (1 - PUSH)).toFixed(4)}% 0 0)`, incoming: `inset(0 0 0 ${inc}%)`, incomingEnd: 'inset(0 0 0 0%)' }
    : { from: `inset(0 0 0 ${out}%)`, to: `inset(0 0 0 ${(100 * (1 - PUSH)).toFixed(4)}%)`, incoming: `inset(0 ${inc}% 0 0)`, incomingEnd: 'inset(0 0% 0 0)' };
}
/** @param {number} direction @param {number} t 0..1 */
// Live drag pose: the outgoing only drifts, everything else is the shared cut. Reversing the drag
// reverses the drift and rewinds the edge, exactly like dragging the sheet back.
function wipe(from, to, direction, t) {
  const { from: cutFrom, incoming } = cuts(direction, t);
  from.style.transform = `translateX(${(-direction * stage.clientWidth * PUSH * t).toFixed(2)}px)`;
  from.style.clipPath = cutFrom;
  to.style.clipPath = incoming;
}
/** @param {number} dx */
function parallax(dx) {
  if (reduced.matches) return;
  backgrounds.forEach((el, i) => { el.style.translate = `${dx * [0.018, -0.012, 0.008, -0.022, 0.014][i]}px 0`; });
}
function reset() {
  titleRoll?.remove(); titleRoll = null; sticker.classList.remove('is-rolling');
  slides.forEach((slide, i) => { slide.toggleAttribute('hidden', i !== current); slide.style.removeProperty('transform'); slide.style.removeProperty('opacity'); slide.style.removeProperty('clip-path'); slide.style.removeProperty('z-index'); });
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
  const previous = current, direction = Math.sign(target - previous);
  const push = stage.clientWidth * PUSH;
  const length = direction ? duration : RETURN;
  locked = true; stage.setAttribute('aria-busy', 'true');
  stage.classList.remove('is-paper-hover');
  // Announced before the folder starts moving, so the hand leads/keeps pace with the switch.
  emit(direction ? 'switch-start' : 'switch-cancel', { from: previous, to: target, direction, distance: push, dx, duration: length });
  if (!reduced.matches) {
    const outgoing = slides[previous], incoming = slides[target];
    if (direction) {
      rollTitle(previous, target, direction);
      incoming.removeAttribute('hidden');
      incoming.style.zIndex = '2'; // the arriving sheet is the one that carries the cut
      // Seeded from the live drag pose so a release continues instead of jumping to a fresh start.
      const live = cuts(direction, Math.min(1, Math.abs(dx) / (stage.clientWidth * DRAG_SPAN)));
      const settled = cuts(direction, 1);
      animations.push(outgoing.animate([
        { transform: outgoing.style.transform || 'translateX(0px)' },
        { transform: `translateX(${(-direction * push).toFixed(2)}px)` }
      ], { duration, easing: ease, fill: 'both' }));
      animations.push(outgoing.animate([
        { clipPath: outgoing.style.clipPath || live.from },
        { clipPath: settled.to }
      ], { duration, easing: ease, fill: 'both' }));
      animations.push(incoming.animate([
        { clipPath: incoming.style.clipPath || live.incoming },
        { clipPath: settled.incomingEnd }
      ], { duration, easing: ease, fill: 'both' }));
    }
    if (!direction) {
      // Nothing is arriving, so the wipe only rewinds: both sheets return to the resting cut state.
      const rest = cuts(1, 0);
      animations.push(outgoing.animate([
        { transform: outgoing.style.transform || 'translateX(0px)', clipPath: outgoing.style.clipPath || rest.from },
        // The current sheet reopens; only the uncommitted incoming sheet closes.
        { transform: 'translateX(0px)', clipPath: rest.from }
      ], { duration: RETURN, easing: ease, fill: 'both' }));
      slides.forEach((slide, i) => {
        if (i !== current && !slide.hasAttribute('hidden')) animations.push(slide.animate([{ transform: slide.style.transform, clipPath: slide.style.clipPath }, { transform: 'translateX(0px)', clipPath: rest.incoming }], { duration: RETURN, easing: ease, fill: 'both' }));
      });
    }
    backgrounds.forEach((el, i) => {
      const offset = -direction * [11, -7, 4, -13, 8][i];
      animations.push(el.animate([{ translate: el.style.translate || '0px 0' }, { translate: `${offset}px 0`, offset: .45 }, { translate: '0px 0' }], { duration: length, easing: ease, fill: 'both' }));
    });
    // Text switches at the midpoint without changing the layout.
    if (direction) {
      const text = [number, caption];
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
  emit('switch-end', { from: previous, to: target, direction });
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
  activation = null;
  if (locked || drag || !event.isPrimary || event.button !== 0) return;
  activation = { x: event.clientX, y: event.clientY, index: current };
  stage.classList.remove('is-paper-hover');
  drag = { id: event.pointerId, startX: event.clientX, startY: event.clientY, dx: 0, axis: '', samples: [{ x: event.clientX, t: performance.now() }] };
  emit('drag-begin', {});
});
/** @param {number} dx */
function follow(dx) {
  const direction = dx < 0 ? 1 : -1, target = current + direction, span = stage.clientWidth * DRAG_SPAN;
  const hasNext = target >= 0 && target < folders.length;
  // Direct, two-way progress: reversing the drag rewinds the cut and the drift along with it.
  const progress = Math.min(hasNext ? 1 : .4, Math.abs(dx) / span);
  const drift = -direction * stage.clientWidth * PUSH * progress;
  slides.forEach((s, i) => { s.toggleAttribute('hidden', i !== current && i !== target); });
  if (hasNext) wipe(slides[current], slides[target], direction, progress);
  else {
    // At a boundary nothing arrives: the sheet only resists, and no cut is opened.
    slides[current].style.transform = `translateX(${drift.toFixed(2)}px)`;
    slides[current].style.removeProperty('clip-path');
    if (slides[target]) slides[target].style.clipPath = cuts(1, 0).incoming;
  }
  parallax(drift);
  // Published for the hand: it tracks this drag progress, not a timeline of its own.
  emit('drag-move', { offset: drift, progress, direction, to: hasNext ? target : current, distance: span, atBoundary: !hasNext });
}
window.addEventListener('pointermove', event => {
  if (!drag || drag.id !== event.pointerId) return;
  const dx = event.clientX - drag.startX, dy = event.clientY - drag.startY;
  if (Math.max(Math.abs(dx), Math.abs(dy)) > 7) activation = null;
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
  if (cancelled || gesture.axis) activation = null;
  if (dragFrame !== null) { cancelAnimationFrame(dragFrame); dragFrame = null; }
  if (stage.hasPointerCapture(event.pointerId)) stage.releasePointerCapture(event.pointerId);
  stage.classList.remove('is-dragging');
  if (gesture.axis !== 'x') { emit('drag-end', { axis: gesture.axis, cancelled, dx: 0, willSwitch: false, direction: 0, to: current }); return; }
  const now = performance.now(), recent = gesture.samples.filter(s => now - s.t <= 100), first = recent[0];
  const velocity = first ? (event.clientX - first.x) / Math.max(1, now - first.t) : 0;
  const distancePassed = Math.abs(gesture.dx) >= Math.min(100, stage.clientWidth * .18);
  const velocityPassed = Math.abs(gesture.dx) >= 18 && Math.abs(velocity) > .5 && Math.sign(velocity) === Math.sign(gesture.dx);
  const direction = gesture.dx < 0 ? 1 : -1;
  const target = !cancelled && (distancePassed || velocityPassed) ? current + direction : current;
  emit('drag-end', { axis: 'x', cancelled, dx: gesture.dx, willSwitch: target !== current, direction: target !== current ? direction : 0, to: target });
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



