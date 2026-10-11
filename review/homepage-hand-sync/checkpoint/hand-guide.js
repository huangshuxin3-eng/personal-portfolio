// Isolated, once-per-page intro. Never drives the carousel or consumes input.
const canvas = /** @type {HTMLElement} */ (document.querySelector('.stationery'));
const anchor = /** @type {HTMLDivElement} */ (document.querySelector('.hand-guide-anchor'));
const actor = /** @type {HTMLDivElement} */ (document.querySelector('.hand-guide-actor'));
const artwork = /** @type {HTMLImageElement} */ (actor.querySelector('img'));
const folder = /** @type {HTMLDivElement} */ (document.querySelector('.main-folder'));
const reduce = matchMedia('(prefers-reduced-motion: reduce)');
let handWidth = 0, handHeight = 0, folderWidth = 0;
/** @type {Animation | null} */ let motion = null;
let ended = false;
const duration = 3400;
const inputs = new AbortController();
/** @param {number} time @param {number} x @param {number} y @param {number} angle @param {number} [opacity] @param {string} [easing] */
function key(time, x, y, angle, opacity = 1, easing = 'cubic-bezier(.3,0,.2,1)') {
  return { offset: time / duration, transform: `translate(${x * folderWidth - handWidth * .35}px,${(y + (innerWidth > 700 ? .06 : 0)) * handHeight}px) rotate(${angle}deg)`, opacity, easing };
}
// Frozen Step 2 trajectory, including both pauses and directional changes.
function trajectory() { return [
  key(0,-.10,.94,-10,0),key(230,-.10,.72,-9,1),
  key(650,-.08,.02,2,1,'cubic-bezier(.3,0,.32,1)'),
  key(1180,.07,-.02,14),key(1350,.075,-.01,15,1,'cubic-bezier(.38,0,.2,1)'),
  key(1650,-.095,.01,-14,1,'cubic-bezier(.22,.8,.2,1)'),key(1770,-.085,.015,-12),
  key(2130,.07,-.015,14),key(2250,.075,-.005,15,1,'cubic-bezier(.4,0,.22,1)'),
  key(2510,-.095,.025,-14),key(2670,-.085,.04,-12),
  key(2910,-.06,.18,4,1,'cubic-bezier(.45,0,.7,1)'),key(3400,.025,.98,8,0)
]; }
function layout() {
  folderWidth = folder.getBoundingClientRect().width * 388 / 460;
  handWidth = folderWidth * .95 * 480 / 464; handHeight = handWidth * 620 / 480;
  anchor.style.width = `${handWidth}px`;
  anchor.style.bottom = `${-handHeight * (innerWidth <= 700 ? .22 : .4)}px`;
}
/** @param {string} reason */
function stop(reason) {
  ended = true; motion?.cancel(); motion = null; anchor.hidden = true;
  actor.style.removeProperty('transform'); actor.style.removeProperty('opacity');
  canvas.classList.remove('hand-guiding'); anchor.dataset.state = reason;
  inputs.abort();
}
function reducedPose() {
  if (ended) return;
  motion?.cancel(); motion = null; layout();
  actor.style.transform = key(1180,.07,-.02,14).transform;
  actor.style.opacity = '1'; anchor.hidden = false;
  canvas.classList.add('hand-guiding'); anchor.dataset.state = 'reduced';
}
// Capture observers run before existing handlers; they never preventDefault.
window.addEventListener('wheel', event => {
  if (!event.ctrlKey && (event.deltaX || event.deltaY)) stop('user-input');
}, { capture: true, passive: true, signal: inputs.signal });
window.addEventListener('keydown', event => {
  if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || event.repeat || event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement || (event.target instanceof HTMLElement && event.target.isContentEditable)) return;
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') stop('user-input');
}, { capture: true, signal: inputs.signal });
folder.addEventListener('pointerdown', event => {
  if (event.isPrimary && event.button === 0) stop('user-input');
}, { capture: true, passive: true, signal: inputs.signal });
window.addEventListener('resize', () => {
  if (ended) return;
  if (!motion) { if (anchor.dataset.state === 'reduced') reducedPose(); return; }
  const time = Number(motion.currentTime || 0);
  layout(); (/** @type {KeyframeEffect | null} */ (motion.effect))?.setKeyframes(trajectory()); motion.currentTime = time;
}, { signal: inputs.signal });
reduce.addEventListener('change', () => { if (reduce.matches) reducedPose(); }, { signal: inputs.signal });
anchor.dataset.state = 'loading';
try {
  await artwork.decode(); await document.fonts.ready;
  if (!ended) {
    if (reduce.matches) reducedPose(); // Frozen Step 2 static fallback, dismissed by input.
    else {
      layout(); anchor.hidden = false; canvas.classList.add('hand-guiding');
      anchor.dataset.state = 'running';
      motion = actor.animate(trajectory(), { duration, fill: 'both', iterations: 1 });
      motion.onfinish = () => stop('exited');
    }
  }
} catch { stop('unavailable'); } // A missing decorative asset must not affect the page.
export {};
