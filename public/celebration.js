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
// Animate only digits that change. The countdown stays readable without motion.
if('MutationObserver'in window){const watcher=new MutationObserver(records=>{if(!motion)return;for(const r of records){const el=r.target.nodeType===3?r.target.parentElement:r.target;if(el.matches&&el.matches('#countdown div>span')){el.classList.remove('digit-change');void el.offsetWidth;el.classList.add('digit-change');}}});for(const el of document.querySelectorAll('#countdown div>span'))watcher.observe(el,{childList:true,characterData:true,subtree:true});}
})();
