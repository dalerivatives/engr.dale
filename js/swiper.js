const SS={};
function gv(){const w=window.innerWidth;return w<600?1:w<1000?2:3;}
function sw(k,d){const s=SS[k];if(!s)return;const pages=Math.ceil(s.total/s.vis)||1;s.idx=(s.idx+d+pages)%pages;uSw(k,true);}
function uSw(k,animate){
  const s=SS[k];if(!s)return;
  const tr=$(k+'T'),dots=$(k+'D'),pg=$(k+'Pg');if(!tr)return;
  const cards=Array.from(tr.children);const n=cards.length;s.total=n;
  const pages=Math.ceil(n/s.vis)||1;
  const start=s.idx*s.vis;
  const doSwap=()=>{
    cards.forEach((c,i)=>{
      c.classList.remove('pg-out');
      const vis=i>=start&&i<start+s.vis;
      c.classList.toggle('pg-vis',vis);
      if(vis){c.style.animationDelay=((i-start)*0.07)+'s';}
    });
    if(dots){dots.innerHTML='';for(let i=0;i<pages;i++){const d=document.createElement('div');d.className='swdot'+(i===s.idx?' on':'');d.onclick=()=>{s.idx=i;uSw(k,true);};dots.appendChild(d);}}
    if(pg)pg.textContent=`${s.idx+1}/${pages}`;
  };
  if(animate){
    const visible=cards.filter(c=>c.classList.contains('pg-vis'));
    if(visible.length){
      visible.forEach(c=>c.classList.add('pg-out'));
      setTimeout(doSwap,200);
    } else {doSwap();}
  } else {doSwap();}
}
function eTouch(wid,k){const w=$(wid);if(!w)return;let sx=0,dr=false;w.addEventListener('touchstart',e=>{sx=e.touches[0].clientX;dr=true;},{passive:true});w.addEventListener('touchend',e=>{if(!dr)return;if(Math.abs(sx-e.changedTouches[0].clientX)>40)sw(k,sx>e.changedTouches[0].clientX?1:-1);dr=false;});w.addEventListener('mousedown',e=>{sx=e.clientX;dr=true;e.preventDefault();});window.addEventListener('mouseup',e=>{if(!dr)return;if(Math.abs(sx-e.clientX)>56)sw(k,sx>e.clientX?1:-1);dr=false;});}
const esc=s=>(s||'').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

