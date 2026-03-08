function bindTilt(){
  // tilt removed — cards use CSS hover lift only
}
window.addEventListener('load',()=>{loadS();rAll();rPh();try{var _d=JSON.parse(localStorage.getItem('jpe_v9')||'{}');if(!_d.ambientYT){_d.ambientYT="https://youtu.be/44kgMBXSFXM";localStorage.setItem('jpe_v9',JSON.stringify(_d));}}catch(e){}
  try{
    const d=JSON.parse(localStorage.getItem('jpe_v9')||'{}');
    if(d.formulas&&d.formulas.length){window.FORMULAS=d.formulas;if(window.refreshFormulas)window.refreshFormulas();}
  }catch(e){}
});
  window.addEventListener('resize',()=>rAll());


  // ════════════════════════════════════════════════════════
  // ██████████████  GOD MODE ENGINE  ███████████████████████
  // ════════════════════════════════════════════════════════

  // ── CANVAS: Particle Network + Floating Formulas ──
  (function initCanvas(){
    const canvas = document.getElementById('bgCanvas');
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, particles, formulas, sparks, animId;

    const COLORS = ['rgba(108,99,255,1)','rgba(0,212,255,1)','rgba(255,107,157,1)','rgba(6,214,160,1)','rgba(255,209,102,1)'];
    function colA(col, a){ return col.replace(/,[^,)]+\)$/, `,${a})`); }
    window.FORMULAS = ["E = mc²","F = ma","V = IR","P = IV","τ = RC","f = 1/T","λ = v/f","∇²φ = 0","Σ F = 0","η = W/Q","int(f)dx","lim x→∞","Δx·Δp ≥ ℏ/2","A = πr²","PV = nRT","Q = CV","01101001","0xFF","if(err){}","sudo rm -rf","git commit","pinMode()","digitalWrite()","while(1){}","#include","bool done=false","int main(){}"] || [
      'E = mc²', 'F = ma', 'V = IR', 'P = IV',
      'τ = RC', 'f = 1/T', 'λ = v/f',
      '∇²φ = 0', 'Σ F = 0', 'η = W/Q',
      'int(f)dx', 'lim x→∞', 'Δx·Δp ≥ ℏ/2',
      'A = πr²', 'PV = nRT', 'Q = CV',
      '01101001', '0xFF', 'if(err){}',
      'sudo rm -rf', 'git commit',
      'pinMode()', 'digitalWrite()',
      'while(1){}', '#include',
      'bool done=false', 'int main(){}'
    ];

    function resize(){
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }

    function mkParticles(){
      sparks = [];
      const count = Math.min(80, Math.floor(W*H/14000));
      particles = Array.from({length:count}, () => ({
        x: Math.random()*W, y: Math.random()*H,
        vx: (Math.random()-.5)*.35, vy: (Math.random()-.5)*.35,
        r: Math.random()*1.8+.6,
        col: COLORS[Math.floor(Math.random()*COLORS.length)],
        pulse: Math.random()*Math.PI*2,
        pulseSpeed: .015+Math.random()*.02
      }));
    }

    function mkFormulas(){
      formulas = Array.from({length:18}, () => ({
        text: window.FORMULAS[Math.floor(Math.random()*window.FORMULAS.length)],
        x: Math.random()*W, y: Math.random()*H,
        vx: (Math.random()-.5)*.18, vy: (Math.random()-.5)*.18,
        opacity: .14 + Math.random()*.18,
        size: 10 + Math.random()*8,
        rot: (Math.random()-.5)*.4,
        rotSpeed: (Math.random()-.5)*.003,
        col: COLORS[Math.floor(Math.random()*COLORS.length)]
      }));
    }
    window.refreshFormulas = function(){ mkFormulas(); };

    function draw(){
      ctx.clearRect(0,0,W,H);

      // Draw formula floaters
      formulas.forEach(f => {
        ctx.save();
        ctx.translate(f.x, f.y);
        ctx.rotate(f.rot);
        ctx.font = `${f.size}px 'JetBrains Mono', monospace`;
        ctx.fillStyle = colA(f.col, f.opacity);
        ctx.fillText(f.text, 0, 0);
        ctx.restore();
        f.x += f.vx; f.y += f.vy; f.rot += f.rotSpeed;
        if(f.x < -200) f.x = W+50;
        if(f.x > W+200) f.x = -100;
        if(f.y < -50) f.y = H+20;
        if(f.y > H+50) f.y = -20;
      });

      // ── LED SPARKLE: traveling light pulses along connecting lines ──
      const CONN_DIST = 160;
      // Collect all active connections this frame
      const conns = [];
      for(let i=0; i<particles.length; i++){
        for(let j=i+1; j<particles.length; j++){
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          if(dist < CONN_DIST){
            conns.push({i, j, dist});
          }
        }
      }

      // Draw base lines (dim)
      conns.forEach(({i, j, dist}) => {
        const alpha = (1 - dist/CONN_DIST) * 0.18;
        const pi = particles[i], pj = particles[j];
        ctx.beginPath();
        ctx.moveTo(pi.x, pi.y);
        ctx.lineTo(pj.x, pj.y);
        ctx.strokeStyle = `rgba(108,99,255,${alpha})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      });

      // Draw LED sparks traveling along lines
      sparks.forEach(sp => {
        // Find if its connection still exists
        const pi = particles[sp.i], pj = particles[sp.j];
        if(!pi || !pj) return;
        const dx = pj.x - pi.x, dy = pj.y - pi.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if(dist >= CONN_DIST){ sp.life = 0; return; }

        // Position along line
        const t = sp.dir === 1 ? sp.t : 1 - sp.t;
        const x = pi.x + dx * t;
        const y = pi.y + dy * t;

        // Fade in/out
        const fade = Math.sin(sp.t * Math.PI);
        const alpha = fade * sp.brightness;

        // Core bright dot
        ctx.beginPath();
        ctx.arc(x, y, sp.size * 1.2, 0, Math.PI*2);
        ctx.fillStyle = colA(sp.col, alpha);
        ctx.fill();

        // Glow ring 1
        const g1 = ctx.createRadialGradient(x, y, 0, x, y, sp.size * 5);
        g1.addColorStop(0, colA(sp.col, alpha * 0.7));
        g1.addColorStop(1, colA(sp.col, 0));
        ctx.beginPath();
        ctx.arc(x, y, sp.size * 5, 0, Math.PI*2);
        ctx.fillStyle = g1;
        ctx.fill();

        // Glow ring 2 (larger, softer)
        const g2 = ctx.createRadialGradient(x, y, 0, x, y, sp.size * 11);
        g2.addColorStop(0, colA(sp.col, alpha * 0.25));
        g2.addColorStop(1, colA(sp.col, 0));
        ctx.beginPath();
        ctx.arc(x, y, sp.size * 11, 0, Math.PI*2);
        ctx.fillStyle = g2;
        ctx.fill();

        // Advance
        sp.t += sp.speed;
        sp.life -= sp.speed;
        if(sp.life <= 0) sp.active = false;
      });

      // Cull dead sparks
      for(let k = sparks.length-1; k >= 0; k--){
        if(!sparks[k].active) sparks.splice(k, 1);
      }

      // Spawn new sparks on random connections
      if(conns.length > 0 && sparks.length < 60 && Math.random() < 0.35){
        const c = conns[Math.floor(Math.random()*conns.length)];
        sparks.push({
          i: c.i, j: c.j,
          t: 0, life: 1,
          speed: 0.008 + Math.random() * 0.018,
          dir: Math.random() < 0.5 ? 1 : -1,
          size: 1.2 + Math.random() * 1.8,
          brightness: 0.6 + Math.random() * 0.4,
          col: COLORS[Math.floor(Math.random()*COLORS.length)],
          active: true
        });
      }

      // Draw particles
      particles.forEach(p => {
        p.pulse += p.pulseSpeed;
        const glow = .4 + Math.sin(p.pulse) * .3;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
        ctx.fillStyle = colA(p.col, glow);
        ctx.fill();
        // Soft glow ring
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r*3, 0, Math.PI*2);
        ctx.fillStyle = colA(p.col, glow * 0.14);
        ctx.fill();
        // Move
        p.x += p.vx; p.y += p.vy;
        if(p.x < 0) p.x = W;
        if(p.x > W) p.x = 0;
        if(p.y < 0) p.y = H;
        if(p.y > H) p.y = 0;
      });

      animId = requestAnimationFrame(draw);
    }

    window.addEventListener('resize', () => { resize(); mkParticles(); mkFormulas(); });
    resize(); mkParticles(); mkFormulas(); draw();
  })();

  // ── NAV SCROLL SHRINK ──
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY > 60;
    document.querySelector('nav').classList.toggle('scrolled', scrolled);
    const prog = document.getElementById('scroll-prog');
    if(prog) prog.style.top = scrolled ? '50px' : '60px';
  }, {passive:true});

  // ── HERO NAME CHAR REVEAL ──
  function wrapChars(el, baseDelay){
    if(!el||!el.textContent.trim()) return;
    const txt = el.textContent;
    const isGrad = el.classList.contains('nl2');
    el.innerHTML = [...txt].map((c,i) =>
      c === ' ' ? '&nbsp;' : `<span class="ch" style="animation-delay:${baseDelay+i*0.04}s${isGrad?';background:var(--grad-txt);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text':''}">${c}</span>`
    ).join('');
  }

  // ── CARD HOVER — lift only, no tilt ──
  document.querySelectorAll('.ci,.ai').forEach(card => {
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.boxShadow = '';
    });
  });

  // ── AUTO-SLIDE GALLERY ──
  let gaTimer = null, gaProg = 0, gaInterval = 4000, gaPaused = false, gaAuto = true;

  function gaSetIcon(){
    const icon = $('gaIcon');
    const btn  = $('gaToggle');
    if(!icon || !btn) return;
    if(gaAuto){
      // Pause icon — auto is ON, click will pause
      icon.innerHTML = '<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>';
      btn.style.color = 'var(--a2)';
      btn.title = 'Auto-play ON — click to pause';
    } else {
      // Play icon — auto is OFF, click will resume
      icon.innerHTML = '<polygon points="5,3 19,12 5,21"/>';
      btn.style.color = 'var(--txt3)';
      btn.title = 'Auto-play OFF — click to enable';
    }
  }

  function toggleAuto(){
    gaAuto = !gaAuto;
    if(gaAuto){
      gaPaused = false;
      gaStart();
    } else {
      gaPaused = true;
      if(gaTimer){ clearInterval(gaTimer); gaTimer = null; }
      const progEl = $('gprog');
      if(progEl){ progEl.style.width = '0%'; progEl.style.opacity = '.3'; }
    }
    gaSetIcon();
  }

  function gaStart(){
    if(!gaAuto) return;
    if(gaTimer) clearInterval(gaTimer);
    gaProg = 0;
    const progEl = $('gprog');
    if(progEl){ progEl.style.width = '0%'; progEl.style.opacity = '1'; }
    const startTime = Date.now();
    gaTimer = setInterval(() => {
      if(gaPaused || !PH.length || !gaAuto) return;
      const elapsed = Date.now() - startTime + gaProg * gaInterval / 100;
      const pct = ((elapsed % gaInterval) / gaInterval) * 100;
      if(progEl) progEl.style.width = pct + '%';
      if(pct > 99) { sph(1); gaProg = 0; }
    }, 60);
    gaSetIcon();
  }
  function gaPause(){ if(!gaAuto) return; gaPaused = true; if($('gprog')) $('gprog').style.opacity='.4'; }
  function gaResume(){ if(!gaAuto) return; gaPaused = false; if($('gprog')) $('gprog').style.opacity='1'; }

  // Hook gallery hover
  window.addEventListener('load', () => {
    const gsw = $('gsw');
    if(gsw){
      gsw.addEventListener('mouseenter', gaPause);
      gsw.addEventListener('mouseleave', gaResume);
      gsw.addEventListener('touchstart', gaPause, {passive:true});
      gsw.addEventListener('touchend', () => setTimeout(gaResume, 2000), {passive:true});
    }
    gaStart();
    setTimeout(gaSetIcon, 100);
    // Char reveal
    const nl1 = document.querySelector('.nl1');
    if(nl1) wrapChars(nl1, 0.5);
    // nl2 (last name) uses CSS gradient - animated via CSS, not charWrap
    // Safety fallback: ensure text is always visible
    setTimeout(()=>{
      document.querySelectorAll('.ch').forEach(s=>{s.style.opacity='1';s.style.transform='none';});
    }, 2200);
  });

  // Restart auto-slide when photos change
  const _origRPh = rPh;
  // Patch: call gaStart after rPh

  window.addEventListener('beforeunload',()=>{if(EM)save();});

  // ── Video: simple iframe, muted autoplay, custom unmute overlay ──
  function euYT(u){
    if(!u||!u.trim())return'';
    const yt=u.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
    if(yt)return yt[1];
    const em=u.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]+)/);
    if(em)return em[1];
    return'';
  }
  function eu(u){return euYT(u);}
  function hLg(k,i,url){D[k][i].logo=url.trim();rAll();}

  function ytSrc(id,muted){
    return`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=${muted?1:0}&controls=0&rel=0&modestbranding=1&loop=1&playlist=${id}&iv_load_policy=3&fs=0&showinfo=0&enablejsapi=0`;
  }
  // muted state per video: key = k+'-'+i, value = true(muted)/false(unmuted)
  const MuteState={};
  const SVG_MUTED=`<svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" viewBox="0 0 24 24"><polygon points="11,5 6,9 2,9 2,15 6,15 11,19" fill="currentColor" stroke="none" opacity=".7"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>`;
  const SVG_SOUND=`<svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" viewBox="0 0 24 24"><polygon points="11,5 6,9 2,9 2,15 6,15 11,19" fill="currentColor" stroke="none" opacity=".7"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>`;
  function toggleMute(vid,k,i){
    const key=k+'-'+i;
    const isMuted=MuteState[key]!==false;
    const nowMuted=!isMuted;
    MuteState[key]=nowMuted;
    const wrap=document.getElementById('cvw-'+k+'-'+i);
    const iframe=wrap&&wrap.querySelector('iframe');
    if(iframe)iframe.src=ytSrc(vid,nowMuted);
    const btn=document.getElementById('mb-'+k+'-'+i);
    if(btn){
      btn.innerHTML=nowMuted ? SVG_MUTED : SVG_SOUND;
      btn.classList.toggle('on',!nowMuted);
    }
  }
