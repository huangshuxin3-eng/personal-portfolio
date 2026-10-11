// The hand is a decorative foreground whose motion is driven by the carousel's published
// interaction state (direction / drag progress / switch timing). It never consumes input and
// never drives the carousel. States: loading → intro → interactive | swipe | spring → exited,
// plus a frozen reduced-motion pose.
const canvas = /** @type {HTMLElement} */ (document.querySelector('.stationery'));
const anchor = /** @type {HTMLDivElement} */ (document.querySelector('.hand-guide-anchor'));
const actor = /** @type {HTMLDivElement} */ (document.querySelector('.hand-guide-actor'));
const artwork = /** @type {HTMLImageElement} */ (actor.querySelector('img'));
const folder = /** @type {HTMLElement} */ (document.querySelector('.main-folder'));
const reduce = matchMedia('(prefers-reduced-motion: reduce)');

const INTERACTION = 'folder:interaction';
const INTRO = 3400; // frozen Step 2 length
const SWIPE = 380; // fallback only: the carousel publishes its real switch duration on the event
const SPRING = 520;
const TAIL = 140; // extra convergence time after a scripted shape ends
const DRAG_SWEEP = 1.35; // maps the carousel's normalised drag progress onto the hand's own coefficient space

/**
 * @typedef {{x: number, y: number, rot: number, opacity: number}} Pose
 * @typedef {{kind: 'swipe' | 'spring', sign: number, push: number, duration: number, t0: number, fromX: number, fromRot: number}} Gesture
 */

// Frozen Step 2 coefficient space: translate(x*visibleWidth - handWidth*.35, (y+vertical)*handHeight) rotate(rot).
const READY = { x: -.02, y: .04, rot: -5, opacity: 1 };
const BELOW = { x: READY.x, y: READY.y + .52, rot: READY.rot, opacity: 0 };

let visibleWidth = 0, handWidth = 0, handHeight = 0;
/** @type {Animation | null} */ let motion = null;
let raf = 0, lastFrame = 0, orphanAt = 0;
let interacted = false, introDone = false, reducedDismissed = false;
/** @type {Pose} */ let pose = { ...BELOW };
/** @type {Gesture | null} */ let gesture = null;
let dragging = false, dragProgress = 0, dragSign = 0;
let rampStart = 0; // responsiveness fades in so a takeover starts from the live pose, never with a snap

const clamp = (/** @type {number} */ v, /** @type {number} */ a, /** @type {number} */ b) => Math.min(b, Math.max(a, v));
const easeOut = (/** @type {number} */ t) => 1 - Math.pow(1 - t, 3);
const easeOutBack = (/** @type {number} */ t) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };
const vertical = () => innerWidth > 700 ? .06 : 0;

/** @param {number} time @param {number} x @param {number} y @param {number} angle @param {number} [opacity] @param {string} [easing] */
function key(time, x, y, angle, opacity = 1, easing = 'cubic-bezier(.3,0,.2,1)') {
  return { offset: time / INTRO, transform: `translate(${x * visibleWidth - handWidth * .35}px,${(y + (innerWidth > 700 ? .06 : 0)) * handHeight}px) rotate(${angle}deg)`, opacity, easing };
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
  visibleWidth = folder.getBoundingClientRect().width * 388 / 460;
  handWidth = visibleWidth * .95 * 480 / 464; handHeight = handWidth * 620 / 480;
  anchor.style.width = `${handWidth}px`;
  anchor.style.bottom = `${-handHeight * (innerWidth <= 700 ? .22 : .4)}px`;
}
/** @param {Pose} p */
function toTransform(p) { return `translate(${p.x * visibleWidth - handWidth * .35}px,${(p.y + vertical()) * handHeight}px) rotate(${p.rot}deg)`; }
/** @param {string} name */
function setState(name) { anchor.dataset.state = name; }
function show() {
  if (anchor.hidden) { layout(); pose = { ...BELOW }; }
  anchor.hidden = false; canvas.classList.add('hand-guiding');
}
function hide() {
  stopLoop();
  // A finished intro keeps applying its final keyframe (fill: both) over any inline style,
  // so it must be cancelled before the foreground can be driven by interaction again.
  if (motion) { motion.cancel(); motion = null; }
  anchor.hidden = true; canvas.classList.remove('hand-guiding');
  actor.style.removeProperty('transform'); actor.style.removeProperty('opacity');
  pose = { ...BELOW };
}
// Reads the rendered pose so an interrupted intro can be taken over without a jump.
/** @returns {Pose} */
function readPose() {
  const fallback = { ...READY, opacity: 1 };
  if (!visibleWidth || !handHeight) return fallback;
  const computed = getComputedStyle(actor);
  const matrix = computed.transform;
  const alpha = parseFloat(computed.opacity);
  if (!matrix || matrix === 'none') return Number.isNaN(alpha) ? fallback : { ...fallback, opacity: alpha };
  const parts = matrix.match(/-?[\d.]+(?:[eE][-+]?\d+)?/g);
  if (!parts || parts.length < 6) return fallback;
  const [a, b, , , e, f] = parts.map(Number);
  return {
    x: (e + handWidth * .35) / visibleWidth,
    y: f / handHeight - vertical(),
    rot: Math.atan2(b, a) * 180 / Math.PI,
    opacity: Number.isNaN(alpha) ? 1 : alpha,
  };
}
/** @returns {Pose} */
function targetPose() {
  if (dragging) {
    // Driven by the carousel's normalised drag progress, so the hand keeps the same sweep whatever
    // lateral travel the carousel's wipe uses. Reversing the drag reverses the sign.
    const p = clamp(dragSign * dragProgress * DRAG_SWEEP, -1.4, 1.4);
    return { x: READY.x + p * .20, y: READY.y + Math.min(1, Math.abs(p)) * .03, rot: p * 15, opacity: 1 };
  }
  if (gesture) {
    const t = clamp((performance.now() - gesture.t0) / gesture.duration, 0, 1);
    const out = easeOut(clamp(t / .42, 0, 1));
    const back = easeOutBack(clamp((t - .38) / .44, 0, 1));
    const sink = clamp((t - .58) / .42, 0, 1);
    const decay = out - back;
    return {
      x: READY.x + gesture.fromX * (1 - back) + gesture.sign * gesture.push * decay,
      y: READY.y + sink * sink * .70,
      rot: READY.rot + gesture.fromRot * (1 - back) + gesture.sign * 15 * decay,
      opacity: 1 - sink * sink,
    };
  }
  return { ...READY };
}
/** @param {number} now */
function frame(now) {
  if (!raf) return;
  raf = requestAnimationFrame(frame);
  const dt = lastFrame ? Math.min(64, now - lastFrame) : 16.7;
  lastFrame = now;
  const target = targetPose();
  const response = dragging ? .46 : .30;
  // After a takeover the responsiveness fades in, so the first frames continue the live pose
  // instead of snapping onto the drag target.
  const ramp = rampStart ? Math.min(1, (now - rampStart) / 280) : 1;
  const k = 1 - Math.pow(1 - response * (.16 + .84 * ramp), dt / 16.7);
  pose.x += (target.x - pose.x) * k;
  pose.y += (target.y - pose.y) * k;
  pose.rot += (target.rot - pose.rot) * k;
  pose.opacity += (target.opacity - pose.opacity) * k;
  actor.style.transform = toTransform(pose);
  actor.style.opacity = String(pose.opacity);
  if (gesture && now - gesture.t0 >= gesture.duration + TAIL) { gesture = null; hide(); setState('exited'); return; }
  // Safety net: never leave the foreground parked over the composition.
  if (!dragging && !gesture && !motion) {
    if (!orphanAt) orphanAt = now + 700;
    else if (now > orphanAt) { hide(); setState('exited'); }
  } else orphanAt = 0;
}
function startLoop() { orphanAt = 0; if (!raf) { lastFrame = 0; raf = requestAnimationFrame(frame); } }
function stopLoop() { if (raf) cancelAnimationFrame(raf); raf = 0; lastFrame = 0; orphanAt = 0; }
/** @param {number} sign @param {number} push @param {number} duration */
function startGesture(sign, push, duration) {
  show(); startLoop();
  gesture = { kind: sign ? 'swipe' : 'spring', sign, push, duration, t0: performance.now(), fromX: pose.x - READY.x, fromRot: pose.rot - READY.rot };
}
// Intro hands over to interaction without freezing: capture the rendered pose, then ease from it.
function takeOverIntro() {
  if (!motion) return;
  pose = readPose();
  motion.cancel(); motion = null; introDone = true;
  rampStart = performance.now();
  actor.style.transform = toTransform(pose); actor.style.opacity = String(pose.opacity);
  show();
}
function finishIntro() { const done = motion; motion = null; done?.cancel(); introDone = true; hide(); setState('exited'); }
function reducedPose() {
  if (interacted || reducedDismissed) return;
  motion?.cancel(); motion = null; gesture = null; dragging = false; stopLoop();
  layout();
  actor.style.transform = key(1180, .07, -.02, 14).transform;
  actor.style.opacity = '1'; anchor.hidden = false; canvas.classList.add('hand-guiding');
  pose = { x: .07, y: -.02, rot: 14, opacity: 1 };
  setState('reduced');
}
function unavailable() { introDone = true; hide(); setState('unavailable'); }

/** @param {any} detail */
function onDragMove(detail) {
  if (reduce.matches) return;
  if (motion) takeOverIntro();
  gesture = null; dragging = true;
  // The emitted offset sign equals the drag sign, which is opposite the target's direction.
  dragSign = -Math.sign(Number(detail.direction) || 0);
  dragProgress = clamp(Number(detail.progress) || 0, 0, 1);
  show(); startLoop(); setState('interactive');
}
/** @param {any} detail */
function onDragEnd(detail) {
  if (reduce.matches) return;
  dragging = false;
  if (anchor.hidden) return;
  // A release that switches is completed by the switch-start that follows in the same task.
  if (detail.willSwitch) return;
  startGesture(0, 0, SPRING); setState('spring');
}
/** @param {any} detail */
function onSwitchStart(detail) {
  if (reduce.matches) return;
  if (motion) takeOverIntro();
  dragging = false;
  const direction = Math.sign(Number(detail.direction) || 0);
  if (!direction) return;
  // Next folder: the hand sweeps left, pushing the current folder away. Previous: it sweeps right.
  const sign = -direction;
  startGesture(sign, detail.dx ? .20 : .30, Number(detail.duration) || SWIPE);
  setState('swipe');
}
function onSwitchCancel() {
  if (reduce.matches) return;
  if (dragging || gesture || anchor.hidden) return;
  startGesture(0, 0, SPRING); setState('spring');
}
// Raw input only has to end the intro gracefully; real motion comes from the carousel events.
function onUserInput() {
  interacted = true;
  if (reduce.matches) { if (!reducedDismissed) { reducedDismissed = true; hide(); setState('exited'); } return; }
  if (motion) { takeOverIntro(); startGesture(0, 0, SPRING); setState('spring'); }
}

folder.addEventListener(INTERACTION, event => {
  const detail = /** @type {any} */ (event).detail;
  if (!detail) return;
  if (detail.type === 'drag-move') onDragMove(detail);
  else if (detail.type === 'drag-end') onDragEnd(detail);
  else if (detail.type === 'switch-start') onSwitchStart(detail);
  else if (detail.type === 'switch-cancel') onSwitchCancel();
});
// Capture observers run before the carousel handlers; they never preventDefault or stop propagation.
const inputs = new AbortController();
window.addEventListener('wheel', event => {
  if (!event.ctrlKey && (event.deltaX || event.deltaY)) onUserInput();
}, { capture: true, passive: true, signal: inputs.signal });
window.addEventListener('keydown', event => {
  if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || event.repeat || event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement || (event.target instanceof HTMLElement && event.target.isContentEditable)) return;
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') onUserInput();
}, { capture: true, signal: inputs.signal });
folder.addEventListener('pointerdown', event => {
  if (event.isPrimary && event.button === 0) onUserInput();
}, { capture: true, passive: true, signal: inputs.signal });
window.addEventListener('resize', () => {
  if (anchor.hidden) return; // nothing on screen; the next show() re-measures
  if (anchor.dataset.state === 'reduced') { reducedPose(); return; }
  if (!motion) { layout(); return; } // drag / swipe re-render from coefficient space
  const time = Number(motion.currentTime || 0);
  layout(); (/** @type {KeyframeEffect | null} */ (motion.effect))?.setKeyframes(trajectory()); motion.currentTime = time;
}, { signal: inputs.signal });
reduce.addEventListener('change', () => { if (reduce.matches) reducedPose(); }, { signal: inputs.signal });

setState('loading');
try {
  await artwork.decode();
  // Bounded: an unreachable webfont host must never be able to suppress the intro entirely.
  await Promise.race([document.fonts.ready, new Promise(resolve => setTimeout(resolve, 1200))]);
  if (interacted) { if (anchor.hidden) setState('exited'); } // a real gesture already took over
  else if (reduce.matches) reducedPose(); // Frozen Step 2 static fallback, dismissed by input.
  else {
    show(); setState('intro');
    motion = actor.animate(trajectory(), { duration: INTRO, fill: 'both', iterations: 1 });
    motion.finished.catch(() => {}); // taking over cancels it; that must not surface as a rejection
    motion.onfinish = finishIntro;
  }
} catch { unavailable(); } // A missing decorative asset must not affect the page.
export {};
