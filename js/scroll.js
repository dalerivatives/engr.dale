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

  const phrases = [
    'Embedded Systems Developer',
    'Software Engineer',
    'Robotics Enthusiast',
    'Full-Stack Developer',
    'Multimedia Producer',
    'Hardware · Software · Everything'
  ];

  // Create cursor element
  const cursor = document.createElement('span');
  cursor.className = 'typed-cursor';
  el.textContent = '';
  el.appendChild(cursor);

  let phraseIdx = 0, charIdx = 0, deleting = false, paused = false;

  function type(){
    if(paused) return;
    const current = phrases[phraseIdx];

    if(!deleting){
      charIdx++;
      el.textContent = current.slice(0, charIdx);
      el.appendChild(cursor);
      if(charIdx === current.length){
        paused = true;
        setTimeout(function(){ paused = false; deleting = true; type(); }, 2200);
        return;
      }
      setTimeout(type, 55 + Math.random() * 45);
    } else {
      charIdx--;
      el.textContent = current.slice(0, charIdx);
      el.appendChild(cursor);
      if(charIdx === 0){
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        setTimeout(type, 400);
        return;
      }
      setTimeout(type, 28);
    }
  }

  // Start after hero animation settles
  setTimeout(type, 1400);
})();
