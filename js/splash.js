/* ══════════════════════════════════════════
   TREVELADE SPLASH SCREEN
══════════════════════════════════════════ */
(function(){
  const splash   = document.getElementById('splash');
  const hex      = document.getElementById('splHex');
  const mono     = document.getElementById('splMono');
  const brand    = document.getElementById('splBrand');
  const tag      = document.getElementById('splTag');
  const barWrap  = document.getElementById('splBarWrap');
  const bar      = document.getElementById('splBar');
  const letters  = brand ? brand.querySelectorAll('.sc') : [];

  if(!splash) return;

  // Prevent scroll while splash is showing
  document.body.style.overflow = 'hidden';

  let progress = 0;
  let barInterval;

  function startProgress(){
    barWrap.classList.add('show');
    barInterval = setInterval(function(){
      // Fast at start, slows near end
      const step = progress < 60 ? 2.2 : progress < 85 ? 1 : 0.4;
      progress = Math.min(progress + step, 97);
      bar.style.width = progress + '%';
    }, 40);
  }

  function finishProgress(cb){
    clearInterval(barInterval);
    bar.style.transition = 'width .3s ease';
    bar.style.width = '100%';
    setTimeout(cb, 350);
  }

  function hideSplash(){
    splash.classList.add('hide');
    document.body.style.overflow = '';
    setTimeout(function(){ splash.style.display='none'; }, 900);
  }

  // Timeline
  // t=0     hex appears (CSS animation)
  // t=400   mono letter pops in + hex gets RGB border
  // t=700   letters cascade in
  // t=1100  tagline appears + progress bar starts
  // t=2800  bar finishes → splash hides

  setTimeout(function(){
    mono.classList.add('show');
    hex.classList.add('lit');
  }, 400);

  setTimeout(function(){
    letters.forEach(function(s, i){
      setTimeout(function(){
        s.classList.add('rgb');
        s.classList.add('show');
      }, i * 60);
    });
  }, 700);

  setTimeout(function(){
    tag.classList.add('show');
    startProgress();
  }, 1100);

  setTimeout(function(){
    finishProgress(hideSplash);
  }, 2900);

})();


/* ══════════════════════════════════════════
   AMBIENT SOUNDSCAPE
══════════════════════════════════════════ */
(function(){
  let playing = false;
  let ytReady = false;
  let player = null;
  let ambientVid = ''+extractVid("https://youtu.be/MEkaqZecpUQ");
  const btn = document.getElementById('soundBtn');

  // Hidden YT iframe container
  const ytBox = document.createElement('div');
  ytBox.id = 'yt-ambient-box';
  ytBox.style.cssText = 'position:fixed;width:1px;height:1px;opacity:0;pointer-events:none;bottom:0;left:0;z-index:-1;';
  document.body.appendChild(ytBox);

  // Load YT API once
  function loadYTAPI(){
    if(window.YT && window.YT.Player){ onYTReady(); return; }
    const s = document.createElement('script');
    s.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(s);
  }

  function onYTReady(){
    if(ytReady || !ambientVid) return;
    ytReady = true;
    player = new YT.Player('yt-ambient-box', {
      videoId: ambientVid,
      playerVars:{autoplay:0,controls:0,loop:1,playlist:ambientVid,mute:0,rel:0,iv_load_policy:3,modestbranding:1},
      events:{
        onReady: e => { if(playing){ e.target.setVolume(70); e.target.playVideo(); } },
        onStateChange: e => {
          // loop manually if ended
          if(e.data === YT.PlayerState.ENDED && playing) e.target.playVideo();
        }
      }
    });
  }

  window.onYouTubeIframeAPIReady = function(){ if(ambientVid) onYTReady(); };

  function extractVid(url){
    if(!url) return '';
    const m = url.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/);
    return m ? m[1] : '';
  }

  window.setAmbientYT = function(url){
    const vid = extractVid(url);
    if(!vid) return;
    ambientVid = vid;
    // Save to storage
    try{ const d=JSON.parse(localStorage.getItem('jpe_v9')||'{}'); d.ambientYT=url; localStorage.setItem('jpe_v9',JSON.stringify(d)); }catch(e){}
    // Reload player with new video
    ytReady = false;
    if(player){ try{ player.destroy(); }catch(e){} player=null; }
    ytBox.innerHTML = '';
    const div = document.createElement('div');
    ytBox.appendChild(div);
    loadYTAPI();
    if(window.YT && window.YT.Player) onYTReady();
  };

  window.toggleSound = function(){
    if(!ambientVid){
      alert('Please enter a YouTube URL in the sound field inside Edit mode first.');
      return;
    }
    playing = !playing;
    if(btn) btn.classList.toggle('on', playing);
    if(!player){ loadYTAPI(); return; }
    if(playing){
      player.setVolume(70);
      player.playVideo();
    } else {
      player.pauseVideo();
    }
  };

  // Restore saved URL on load
  window.addEventListener('DOMContentLoaded', ()=>{
    try{
      const d = JSON.parse(localStorage.getItem('jpe_v9')||'{}');
      if(d.ambientYT){
        ambientVid = extractVid(d.ambientYT);
        const inp = document.getElementById('esnd');
        if(inp) inp.value = d.ambientYT;
        loadYTAPI();
      }
    }catch(e){}
  });
})();
