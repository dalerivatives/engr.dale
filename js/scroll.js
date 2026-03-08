/* ── 1. SCROLL PROGRESS BAR ── */
(function(){
  const bar = document.getElementById('scroll-prog');
  if(!bar) return;
  window.addEventListener('scroll', function(){
    const scrolled = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? scrolled / max : 0;
    bar.style.transform = 'scaleX(' + pct + ')';
  }, {passive:true});
})();

/* ── 2. HAMBURGER MENU ── */
function toggleDrawer(){
  const ham = document.getElementById('navHam');
  const drawer = document.getElementById('navDrawer');
  if(!ham || !drawer) return;
  const isOpen = drawer.classList.contains('open');
  drawer.classList.toggle('open', !isOpen);
  ham.classList.toggle('open', !isOpen);
}
function closeDrawer(){
  const ham = document.getElementById('navHam');
  const drawer = document.getElementById('navDrawer');
  if(ham) ham.classList.remove('open');
  if(drawer) drawer.classList.remove('open');
}
// Close drawer on outside click
document.addEventListener('click', function(e){
  const ham = document.getElementById('navHam');
  const drawer = document.getElementById('navDrawer');
  if(!drawer || !ham) return;
  if(!drawer.contains(e.target) && !ham.contains(e.target)){
    closeDrawer();
  }
});

/* ── 3. ACTIVE NAV LINK ON SCROLL ── */
(function(){
  const sections = ['hero','education','certifications','skills','projects','achievements','seminars','experience','contact'];
  const navLinks = document.querySelectorAll('.nav-links a');
  const drawerLinks = document.querySelectorAll('.nav-drawer a');

  function getActive(){
    const scrollY = window.scrollY + 80;
    let active = sections[0];
    for(let i = 0; i < sections.length; i++){
      const el = document.getElementById(sections[i]);
      if(el && el.offsetTop <= scrollY) active = sections[i];
    }
    return active;
  }

  function updateNav(){
    const active = getActive();
    navLinks.forEach(a => {
      const href = a.getAttribute('href').replace('#','');
      a.classList.toggle('active', href === active);
    });
    drawerLinks.forEach(a => {
      const href = a.getAttribute('href').replace('#','');
      a.classList.toggle('active', href === active);
    });
  }

  window.addEventListener('scroll', updateNav, {passive:true});
  window.addEventListener('load', updateNav);
})();

/* ── 4. BACK-TO-TOP ── */
(function(){
  const btn = document.getElementById('btt');
  if(!btn) return;
  window.addEventListener('scroll', function(){
    btn.classList.toggle('vis', window.scrollY > 400);
  }, {passive:true});
})();

/* ── 5. TYPED TEXT ANIMATION ── */
(function(){
  const el = document.getElementById('hSpec');
  if(!el) return;

  const defaultPhrases = [
    'Embedded Systems Developer',
    'Software Engineer',
    'Robotics Enthusiast',
    'Full-Stack Developer',
    'Multimedia Producer',
    'Hardware · Software · Everything'
  ];

  // If user has saved a custom hSpec, show it statically into the autotyper (pipe-separated or single)
  window.__typedStop = false;
  window.__setHSpec = function(val){
    if(!val || !val.trim()){ return; }
    var pts = val.split('|').map(function(s){ return s.trim(); }).filter(Boolean);
    if(pts.length > 0){
      window.__hSpecPhrases = pts;
      window.__typedStop = false;
      if(window.__restartTyped) window.__restartTyped();
    }
  };

  const cursor = document.createElement('span');
  cursor.className = 'typed-cursor';
  el.textContent = '';
  el.appendChild(cursor);

  let phraseIdx = 0, charIdx = 0, deleting = false, paused = false;
  let _timer = null;

  function getPhrases(){
    return (window.__hSpecPhrases && window.__hSpecPhrases.length) ? window.__hSpecPhrases : ["Full-Stack Developer"];
  }

  function type(){
    if(window.__typedStop){ el.textContent = el.textContent.replace(/[|▋]/g,''); return; }
    if(paused) return;
    const phrases = getPhrases();
    phraseIdx = phraseIdx % phrases.length;
    const current = phrases[phraseIdx];

    if(!deleting){
      charIdx++;
      el.textContent = current.slice(0, charIdx);
      el.appendChild(cursor);
      if(charIdx === current.length){
        paused = true;
        _timer = setTimeout(function(){ paused = false; deleting = true; type(); }, 2200);
        return;
      }
      _timer = setTimeout(type, 55 + Math.random() * 45);
    } else {
      charIdx--;
      el.textContent = current.slice(0, charIdx);
      el.appendChild(cursor);
      if(charIdx === 0){
        deleting = false;
        phraseIdx = (phraseIdx + 1) % getPhrases().length;
        _timer = setTimeout(type, 400);
        return;
      }
      _timer = setTimeout(type, 28);
    }
  }

  window.__restartTyped = function(){
    if(_timer){ clearTimeout(_timer); _timer = null; }
    phraseIdx = 0; charIdx = 0; deleting = false; paused = false;
    el.textContent = '';
    el.appendChild(cursor);
    type();
  };

  // Start after hero animation settles
  _timer = setTimeout(type, 1400);
})();
