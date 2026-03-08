let EM=false;
function openPw(){
  if(EM){exitEdit();return;}
  const fn=(gt('hFirst')||'').trim();
  const mn=(gt('hMid')||'').trim();
  const ln=(gt('hLast')||'').trim();
  const fullName=[fn,mn,ln].filter(Boolean).join(' ');
  const initials=((fn[0]||'')+(ln[0]||'')).toUpperCase()||'O';
  const role=gt('hBadge')||'Portfolio Owner';
  const nm=$('pwOwnerName');const av=$('pwOwnerAv');const rl=$('pwOwnerRole');
  if(nm)nm.textContent=fullName||'Portfolio Owner';
  if(av)av.textContent=initials;
  if(rl)rl.textContent=role;
  $('pwM').classList.add('on');setTimeout(()=>$('pwIn').focus(),80);
}
function closePw(){$('pwM').classList.remove('on');$('pwIn').value='';$('pwErr').style.display='none';}
async function chkPw(){
  const val=$('pwIn').value;
  $('pwIn').value=''; // clear immediately so it's not in memory
  const h=await _hash(val);
  if(h===_H){closePw();enterEdit();}
  else{$('pwErr').style.display='block';setTimeout(()=>$('pwIn').focus(),50);}
}
function enterEdit(){
  EM=true;window.__EM__=true;
  document.body.style.filter='';document.body.style.pointerEvents='';document.body.style.userSelect='';
  document.body.classList.add('em');$('ebar').classList.add('on');$('edBtn').classList.add('on');
  $('edBtn').lastChild.textContent='exit owner';
  const db=$('drawerOwnerBtn');if(db)db.lastChild.textContent=' exit owner mode';
  $('hero-ed').classList.add('on');
  // Stop typing animation if user has saved a custom hSpec
  (function(){try{const _d=JSON.parse(localStorage.getItem('jpe_v9')||'{}');if(_d.h&&_d.h.sp&&window.__setHSpec)window.__setHSpec(_d.h.sp);}catch(e){}})();
  $('hedwrap').style.paddingTop='32px';$('hedwrap').style.paddingBottom='32px';
  const f=(id,v)=>{const e=$(id);if(e)e.value=v||'';};
  f('efn',gt('hFirst'));f('emn',gt('hMid'));f('eln',gt('hLast'));f('ebd',gt('hBadge'));
  f('ecp',gt('hChip'));f('esp',(function(){try{const _d=JSON.parse(localStorage.getItem('jpe_v9')||'{}');return(_d.h&&_d.h.sp)||gt('hSpec')||'';}catch(e){return gt('hSpec');}})());f('eab',gt('hAbout'));
  // Stats auto-sync from sections — no manual inputs needed
  f('egh',$('lgh').href);f('ewb',$('lweb').href);
  try{const d=JSON.parse(localStorage.getItem('jpe_v9')||'{}');if(d.ambientYT)f('esnd',d.ambientYT);}catch(e){}
  const fEl=$('eformulas');if(fEl)fEl.value=(window.FORMULAS||[]).join('\n');
}
function exitEdit(){
  EM=false;window.__EM__=false;
  document.body.classList.remove('em');$('ebar').classList.remove('on');
  $('edBtn').classList.remove('on');$('edBtn').lastChild.textContent='Owner Access';
  const db=$('drawerOwnerBtn');if(db)db.lastChild.textContent=' owner access';
  document.querySelectorAll('.edp.on').forEach(e=>e.classList.remove('on'));save();
}
function ifEM(fn){if(EM)fn();}
function tog(id){if(!EM)return;$(id).classList.toggle('on');}
function gt(id){const e=$(id);return e?e.textContent:'';}
function lv(id,v){const e=$(id);if(e)e.textContent=v;}
function sa(id,attr,v){const e=$(id);if(e)e.setAttribute(attr,v);}

const DEFAULT_FORMULAS = [
  'E = mc²','F = ma','V = IR','P = IV','τ = RC','f = 1/T','λ = v/f',
  '∇²φ = 0','Σ F = 0','η = W/Q','int(f)dx','lim x→∞','Δx·Δp ≥ ℏ/2',
  'A = πr²','PV = nRT','Q = CV','01101001','0xFF','if(err){}',
  'sudo rm -rf','git commit','pinMode()','digitalWrite()',
  'while(1){}','#include','bool done=false','int main(){}'
];
function getDefaultFormulas(){ return DEFAULT_FORMULAS.join('\n'); }
function updateFormulas(val){
  const lines = val.split('\n').map(s=>s.trim()).filter(Boolean);
  if(lines.length === 0) return;
  window.FORMULAS = lines;
  if(window.refreshFormulas) window.refreshFormulas();
  try{ const d=JSON.parse(localStorage.getItem('jpe_v9')||'{}'); d.formulas=lines; localStorage.setItem('jpe_v9',JSON.stringify(d)); }catch(e){}
}

