import {folders,FolderIllustration} from './folder-art.js';
const actor=/** @type {HTMLDivElement} */(document.querySelector('.hand-actor'));
const anchor=/** @type {HTMLDivElement} */(document.querySelector('.hand-anchor'));
const scene=/** @type {HTMLElement} */(document.querySelector('#scene'));
const folder=/** @type {HTMLDivElement} */(document.querySelector('.main-folder'));
const playButton=/** @type {HTMLButtonElement} */(document.querySelector('#play'));
const scrub=/** @type {HTMLInputElement} */(document.querySelector('#scrub'));
const clock=/** @type {HTMLOutputElement} */(document.querySelector('#clock'));
const motionStatus=/** @type {HTMLElement} */(document.querySelector('#motion-status'));
const reduce=matchMedia('(prefers-reduced-motion: reduce)');
const shape=new URLSearchParams(location.search).get('view')==='shape';
document.querySelectorAll('[data-folder]').forEach((el,i)=>el.innerHTML=FolderIllustration(folders[0],i));
actor.innerHTML=await (await fetch('retro-hand.svg')).text();
if(shape){document.body.classList.add('shape-view');document.querySelector('.shape-scene')?.removeAttribute('hidden');}
let handWidth=0,handHeight=0,folderWidth=0;
/** @type {Animation|null} */let animation=null;
let raf=0;
const DURATION=3400;
/** @param {number} time @param {number} x @param {number} y @param {number} angle @param {number} [opacity] @param {string} [easing] */
function key(time,x,y,angle,opacity=1,easing='cubic-bezier(.3,0,.2,1)'){return{offset:time/DURATION,transform:`translate(${x*folderWidth-handWidth*.35}px,${(y+(innerWidth>700?.06:0))*handHeight}px) rotate(${angle}deg)`,opacity,easing};}
function trajectory(){return[
key(0,-.10,.94,-10,0),key(230,-.10,.72,-9,1),
key(650,-.08,.02,2,1,'cubic-bezier(.3,0,.32,1)'),
key(1180,.07,-.02,14),key(1350,.075,-.01,15,1,'cubic-bezier(.38,0,.2,1)'),
key(1650,-.095,.01,-14,1,'cubic-bezier(.22,.8,.2,1)'),key(1770,-.085,.015,-12),
key(2130,.07,-.015,14),key(2250,.075,-.005,15,1,'cubic-bezier(.4,0,.22,1)'),
key(2510,-.095,.025,-14),key(2670,-.085,.04,-12),
key(2910,-.06,.18,4,1,'cubic-bezier(.45,0,.7,1)'),key(3400,.025,.98,8,0)
];}
function layout(){folderWidth=folder.getBoundingClientRect().width*388/460;handWidth=folderWidth*.95*480/464;handHeight=handWidth*620/480;anchor.style.width=`${handWidth}px`;anchor.style.bottom=`${-handHeight*(innerWidth<=700?.22:.4)}px`;scene.dataset.handWidth=String(handWidth);scene.dataset.folderWidth=String(folderWidth);}
function drawClock(){const time=Number(animation?.currentTime||0);scrub.value=String(time);clock.value=`${(time/1000).toFixed(2)}s`;scene.dataset.time=String(time);if(animation?.playState==='running')raf=requestAnimationFrame(drawClock);}
function build(){animation?.cancel();animation=actor.animate(trajectory(),{duration:DURATION,fill:'both',iterations:1});animation.pause();animation.onfinish=()=>{scene.dataset.state='exited';drawClock();};}
/** @param {number} time */
function seek(time){cancelAnimationFrame(raf);if(!animation)build();animation?.pause();if(animation)animation.currentTime=Math.max(0,Math.min(DURATION,time));scene.dataset.state='paused';drawClock();}
function reducedPose(){animation?.cancel();animation=null;actor.style.transform=key(1180,.07,-.02,14).transform;actor.style.opacity='1';scene.dataset.state='reduced';motionStatus.textContent='减少动态模式：静态姿势，无自动运动';playButton.disabled=true;scrub.disabled=true;clock.value='静态';}
function play(){if(reduce.matches||shape)return;actor.style.removeProperty('transform');actor.style.removeProperty('opacity');build();if(animation){animation.currentTime=0;animation.play();}scene.dataset.state='running';drawClock();}
playButton.addEventListener('click',play);
scrub.addEventListener('input',()=>seek(Number(scrub.value)));
window.addEventListener('hand-preview-seek',e=>{if(!reduce.matches)seek(Number(/** @type {CustomEvent} */(e).detail));});
window.addEventListener('hand-preview-play',play);
window.addEventListener('resize',()=>{const t=Number(animation?.currentTime||1180);layout();if(reduce.matches)reducedPose();else{build();seek(t);}});
reduce.addEventListener('change',()=>{if(reduce.matches)reducedPose();else{playButton.disabled=false;scrub.disabled=false;motionStatus.textContent='一次完整轨迹，无循环';build();seek(1180);}});
await document.fonts.ready;layout();scene.dataset.ready='true';
if(!shape){if(reduce.matches)reducedPose();else if(new URLSearchParams(location.search).get('autoplay')==='0')seek(0);else play();}

