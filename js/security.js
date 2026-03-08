const $=id=>document.getElementById(id);
const isTouch = window.matchMedia('(pointer:coarse)').matches;
const CD=$('cd'),CR=$('cr');
let mx=0,my=0,rx=0,ry=0;
if(!isTouch){
document.addEventListener('mousemove',e=>{
  mx=e.clientX;my=e.clientY;
  CD.style.transform=`translate(${mx-4}px,${my-4}px)`;
  // cursor trail
  if(!window._lastTrail||Date.now()-window._lastTrail>45){
    window._lastTrail=Date.now();
    const t=document.createElement('div');
    t.className='ctrail';
    t.style.cssText=`left:${mx}px;top:${my}px;`;
    document.body.appendChild(t);
    setTimeout(()=>t.remove(),520);
  }});
(function tick(){rx+=(mx-rx)*.11;ry+=(my-ry)*.11;CR.style.transform=`translate(${rx-16}px,${ry-16}px)`;requestAnimationFrame(tick);})();
document.querySelectorAll('button,a,input,textarea,.ci,.ai,.clogo,.swb,.gnbtn').forEach(el=>{
  el.addEventListener('mouseenter',()=>CR.classList.add('big'));
  el.addEventListener('mouseleave',()=>CR.classList.remove('big'));
});
}
document.querySelectorAll('.rv').forEach(el=>new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting&&e.target.classList.add('vis')),{threshold:.05}).observe(el));

// ── SECURITY ──────────────────────────────────────────────────────────────
// Password stored as SHA-256 hash only — plaintext never in source
const _H='98e11abb6f0e6eccf43bb0fdb24da848e3093c68d691b6ce5bbb7b4190f4d739';
async function _hash(s){
  const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s));
  return Array.from(new Uint8Array(b)).map(x=>x.toString(16).padStart(2,'0')).join('');
}

// Console warning
(function(){
  console.log('%c⚠ Stop!','font-size:28px;font-weight:bold;color:#ff4444;');
  console.log('%cThis browser feature is intended for developers.\nIf someone told you to paste something here, it is a scam.','font-size:14px;color:#aaa;');
  console.log('%cThis portfolio is owned and managed by its author.','font-size:12px;color:#666;');
})();

// DevTools detection — blur and lock page when opened
(function(){
  let _locked=false;
  const _threshold=160;
  const _check=()=>{
    const w=window.outerWidth-window.innerWidth>_threshold||window.outerHeight-window.innerHeight>_threshold;
    if(w&&!_locked&&!window.__EM__){
      _locked=true;
      document.body.style.filter='blur(12px)';
      document.body.style.pointerEvents='none';
      document.body.style.userSelect='none';
    } else if(!w&&_locked){
      _locked=false;
      document.body.style.filter='';
      document.body.style.pointerEvents='';
      document.body.style.userSelect='';
    }
  };
  setInterval(_check,800);

  // Block F12, Ctrl+Shift+I/J/C/U, Ctrl+U
  document.addEventListener('keydown',e=>{
    if(window.__EM__)return;
    if(e.key==='F12'||(e.ctrlKey&&e.shiftKey&&['I','J','C','i','j','c'].includes(e.key))||(e.ctrlKey&&['u','U'].includes(e.key))){
      e.preventDefault();e.stopPropagation();return false;
    }
  },{capture:true});

  // Block right-click when not in owner mode
  document.addEventListener('contextmenu',e=>{
    if(!window.__EM__){e.preventDefault();return false;}
  });
})();

