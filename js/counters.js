/* ══ 1. COUNT-UP STATS (looping) ══ */
(function(){
  function rollCounter(el, target, delay){
    if(!el || isNaN(target) || target === 0) return;
    var st = el.closest('.st');

    function runOnce(onDone){
      if(st) st.classList.add('counting');
      var current = 0;
      el.textContent = '0';

      function tick(){
        current++;
        el.textContent = current;
        if(current < target){
          setTimeout(tick, 1000);
        } else {
          el.textContent = target;
          if(st) st.classList.remove('counting');
          if(onDone) onDone();
        }
      }
      setTimeout(tick, 1000);
    }

    function loop(){
      el.textContent = '0';
      runOnce(function(){
        setTimeout(function(){ loop(); }, 3200);
      });
    }

    setTimeout(loop, delay);
  }

  function animateBadge(el){
    if(!el) return;
    var st = el.closest('.st');
    function pulse(){
      if(st) st.classList.add('counting');
      setTimeout(function(){ if(st) st.classList.remove('counting'); }, 900);
      setTimeout(pulse, 4000);
    }
    setTimeout(pulse, 1000);
  }

  window.addEventListener('load', function(){
    // Compute counts from live D arrays (set by data.js + loadS)
    var nP = (typeof D !== 'undefined' && D.proj) ? D.proj.length : parseInt((document.getElementById('sP')||{}).textContent)||0;
    var nA = (typeof D !== 'undefined' && D.ach)  ? D.ach.length  : parseInt((document.getElementById('sA')||{}).textContent)||0;
    var nL = 0;
    if(typeof D !== 'undefined' && D.sk){
      D.sk.forEach(function(c){ if(c.cat && c.cat.toLowerCase().indexOf('language')>=0 && c.tags) nL = c.tags.length; });
    }
    if(!nL) nL = parseInt((document.getElementById('sL')||{}).textContent)||0;
    // Write counts to DOM so counters animate to the right target
    var spEl=document.getElementById('sP'), saEl=document.getElementById('sA'), slEl=document.getElementById('sL');
    if(spEl) spEl.textContent = nP;
    if(saEl) saEl.textContent = nA;
    if(slEl) slEl.textContent = nL;
    setTimeout(function(){
      rollCounter(document.getElementById('sP'), nP, 0);
      rollCounter(document.getElementById('sA'), nA, 280);
      rollCounter(document.getElementById('sL'), nL, 560);
      animateBadge(document.getElementById('sY'));
    }, 700);
  });
})();

/* ══ DIRECT MESSAGE ══ */
(function(){
  window.sendDM = function(){
    const name  = ($('dmName') ||{}).value.trim();
    const email = ($('dmEmail')||{}).value.trim();
    const subj  = ($('dmSubj') ||{}).value.trim();
    const msg   = ($('dmMsg')  ||{}).value.trim();
    const status = $('dmStatus');
    const btn    = $('dmSend');
    const btnTxt = $('dmBtnTxt');

    // Validate
    if(!name || !email || !msg){
      status.textContent = '✕ Please fill in Name, Email & Message.';
      status.className = 'dm-status err';
      setTimeout(()=>{ status.textContent=''; status.className='dm-status'; }, 3500);
      return;
    }
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
      status.textContent = '✕ Invalid email address.';
      status.className = 'dm-status err';
      setTimeout(()=>{ status.textContent=''; status.className='dm-status'; }, 3500);
      return;
    }

    // Build mailto link
    const to = 'johndaleverthpechanova@gmail.com';
    const subject = encodeURIComponent(subj || 'Portfolio Message from ' + name);
    const body = encodeURIComponent(
      'From: ' + name + '\nEmail: ' + email + '\n\n' + msg
    );

    // Animate button
    btn.disabled = true;
    btnTxt.textContent = 'Opening Mail...';

    window.location.href = 'mailto:' + to + '?subject=' + subject + '&body=' + body;

    // Show success + reset after short delay
    setTimeout(function(){
      status.textContent = '✓ Mail client opened!';
      status.className = 'dm-status ok';
      btn.disabled = false;
      btnTxt.textContent = 'Send Message';
      // Clear fields
      ['dmName','dmEmail','dmSubj','dmMsg'].forEach(function(id){
        var el = $(id); if(el) el.value = '';
      });
      setTimeout(function(){ status.textContent=''; status.className='dm-status'; }, 4000);
    }, 1200);
  };
})();
(function(){
  const y = document.getElementById('ft-year');
  if(y) y.textContent = new Date().getFullYear();

  // Sync footer social links from hero links
  function syncFooterLinks(){
    const gh  = document.getElementById('lgh');
    const web = document.getElementById('lweb');
    const ftGh  = document.getElementById('ft-gh');
    const ftWeb = document.getElementById('ft-web');
    if(gh && ftGh)   ftGh.href  = gh.href  || '#';
    if(web && ftWeb) ftWeb.href = web.href || '#';
  }
  window.addEventListener('load', syncFooterLinks);
})();
