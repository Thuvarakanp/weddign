'use strict';
(()=>{
const select=s=>document.querySelector(s);
const media=matchMedia('(prefers-reduced-motion: reduce)');
let motion=!media.matches;
try{if(sessionStorage.getItem('ns-motion')==='off')motion=false;}catch{}
let introTimer;
const opening=select('#opening');
function closeIntro(){opening.hidden=true;clearTimeout(introTimer);}
function setMotion(on){motion=on&&!media.matches;document.documentElement.classList.toggle('motion-paused',!motion);if(!motion)closeIntro();}
setMotion(motion);
media.addEventListener('change',()=>setMotion(!media.matches));
function showIntro(){if(!motion)return;closeIntro();opening.hidden=false;for(const el of opening.querySelectorAll('.panel,.opening-seal')){el.style.animation='none';void el.offsetWidth;el.style.animation='';}introTimer=setTimeout(closeIntro,1900);}
select('#skip-opening').addEventListener('click',closeIntro);
select('#replay-invitation').addEventListener('click',()=>{if(!motion){select('#replay-invitation').textContent='Motion is paused';setTimeout(()=>select('#replay-invitation').textContent='↻ Replay the invitation',1800);return;}window.scrollTo({top:0,behavior:'instant'});showIntro();});
let ticking=false;
function updateScroll(){const length=document.documentElement.scrollHeight-innerHeight;const progress=length>0?Math.min(1,Math.max(0,scrollY/length)):0;select('.reading-progress span').style.transform='scaleX('+progress+')';if(motion&&innerWidth>1000&&scrollY<innerHeight){select('.hero-aura').style.translate='0 '+Math.min(scrollY*.08,45)+'px';}ticking=false;}
addEventListener('scroll',()=>{if(!ticking){ticking=true;requestAnimationFrame(updateScroll);}},{passive:true});addEventListener('resize',updateScroll);updateScroll();
// Gentle pointer depth on background rings only, without moving the couple.
const art=select('.hero-art'),rings=select('.ring-art');
art.addEventListener('pointermove',event=>{if(!motion||event.pointerType!=='mouse'||innerWidth<1000)return;const bounds=art.getBoundingClientRect();const x=(event.clientX-bounds.left)/bounds.width-.5,y=(event.clientY-bounds.top)/bounds.height-.5;rings.style.transform='translate('+x*12+'px,'+y*10+'px) rotate('+x*2+'deg)';});
art.addEventListener('pointerleave',()=>{rings.style.transition='transform .6s';rings.style.transform='';setTimeout(()=>rings.style.transition='',650);});
// Animate only digits that change. The countdown stays readable without motion.
if('MutationObserver'in window){const watcher=new MutationObserver(records=>{if(!motion)return;for(const r of records){const el=r.target.nodeType===3?r.target.parentElement:r.target;if(el.matches&&el.matches('#countdown div>span')){el.classList.remove('digit-change');void el.offsetWidth;el.classList.add('digit-change');}}});for(const el of document.querySelectorAll('#countdown div>span'))watcher.observe(el,{childList:true,characterData:true,subtree:true});}
// Keyboard-accessible portrait gallery with a native modal focus boundary.
const dialog=select('#gallery-dialog');let current=0,lastTrigger=null;
const portraits=[{src:window.EVENT.images.beginning,alt:'Nirosan and Sajitha standing together beside sunlit windows',caption:'A beautiful beginning'},{src:window.EVENT.images.floral,alt:'Nirosan and Sajitha holding hands under an elegant floral arrangement',caption:'Our next chapter, together'},{src:window.EVENT.images.hero,alt:'Full-length portrait of Nirosan and Sajitha in navy and silver attire',caption:'The start of our forever'}];
function displayPortrait(index){current=(index+portraits.length)%portraits.length;const portrait=portraits[current];const img=select('#gallery-image');img.src=portrait.src;img.alt=portrait.alt;img.style.animation='none';void img.offsetWidth;img.style.animation='';select('#gallery-caption').textContent=portrait.caption;select('#gallery-counter').textContent=String(current+1).padStart(2,'0')+' / 03';for(const thumb of dialog.querySelectorAll('[data-gallery]'))thumb.setAttribute('aria-pressed',String(Number(thumb.dataset.gallery)===current));}
for(const trigger of document.querySelectorAll('[data-gallery]'))trigger.addEventListener('click',()=>{displayPortrait(Number(trigger.dataset.gallery));if(!dialog.open){lastTrigger=trigger;if(typeof dialog.showModal==='function'){dialog.showModal();select('#gallery-close').focus();}else{window.open(portraits[current].src,'_blank','noopener');}}});
function closeGallery(){dialog.close();}
select('#gallery-close').addEventListener('click',closeGallery);dialog.addEventListener('close',()=>{lastTrigger?.focus();});
select('#gallery-prev').addEventListener('click',()=>displayPortrait(current-1));select('#gallery-next').addEventListener('click',()=>displayPortrait(current+1));
dialog.addEventListener('keydown',event=>{if(event.key==='ArrowLeft'){event.preventDefault();displayPortrait(current-1);}if(event.key==='ArrowRight'){event.preventDefault();displayPortrait(current+1);}});
dialog.addEventListener('click',event=>{if(event.target===dialog){const b=dialog.getBoundingClientRect();if(event.clientX<b.left||event.clientX>b.right||event.clientY<b.top||event.clientY>b.bottom)closeGallery();}});
// Touch swipe navigation, with normal vertical scrolling preserved.
let touchStart=null;select('.gallery-stage').addEventListener('touchstart',event=>{if(event.touches.length===1)touchStart={x:event.touches[0].clientX,y:event.touches[0].clientY};},{passive:true});select('.gallery-stage').addEventListener('touchend',event=>{if(!touchStart)return;const touch=event.changedTouches[0],dx=touch.clientX-touchStart.x,dy=touch.clientY-touchStart.y;if(Math.abs(dx)>60&&Math.abs(dx)>Math.abs(dy)*1.5)displayPortrait(current+(dx<0?1:-1));touchStart=null;},{passive:true});
})();
