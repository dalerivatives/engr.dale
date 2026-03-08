function rCard(it,i,k){const vis=SS[k]?SS[k].vis:3;const vid=eu(it.video||'');const hv='video'in it;
  return`<div class="card"><div class="ci"><div class="c-hd"><div class="clogo" onclick="ifEM(()=>{const u=prompt('Paste Facebook or direct image URL for logo:');if(u&&u.trim())hLg('${k}',${i},u);})">${it.logo?`<img src="${it.logo}" onerror="this.style.opacity='.3'" />`:`<span class="clph">◈</span>`}</div><div class="cmeta"><div class="cprd">${esc(it.period||it.year||it.cat||'')}</div><div class="ctit">${esc(it.title)}</div><div class="csub">${esc(it.institution||it.cat||it.org||'')}</div></div></div><div class="cdesc">${esc(it.desc)}</div>${(it.tags||[]).length?`<div class="ctags">${it.tags.map(t=>`<span class="ctag">${esc(t)}</span>`).join('')}</div>`:''}${hv?`<div class="cvid">${vid?`<div class="cvid-wrap" id="cvw-${k}-${i}"><iframe src="${ytSrc(vid,true)}" frameborder="0" allow="autoplay;encrypted-media" loading="lazy"></iframe><div class="cvid-block"></div><button class="cvid-del" onclick="ifEM(()=>{D['${k}'][${i}].video='';rAll();})"><svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>remove</button></div>`:`<div class="cvid-ph"><svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg><span>paste YouTube link in Edit</span></div>`}</div>`:''}${hv&&vid?`<div class="cvid-mute-row"><button class="cvid-mute-btn" id="mb-${k}-${i}" onclick="toggleMute('${vid}','${k}',${i})"><svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" viewBox="0 0 24 24"><polygon points="11,5 6,9 2,9 2,15 6,15 11,19" fill="currentColor" stroke="none" opacity=".7"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg></button></div>`:''}<div class="cnum">${String(i+1).padStart(2,'0')}</div></div></div>`;}

function rAch(it,i){return`<div class="card"><div class="ai"><div class="ai-ic">${it.icon||'⭐'}</div><div style="flex:1"><div class="ai-yr">${esc(it.year)}</div><div class="ai-tit">${esc(it.title)}</div><div class="ai-desc">${esc(it.desc)}</div></div><div class="ai-n">${String(i+1).padStart(2,'0')}</div></div></div>`;}

function rSw(k,data,fn){const vis=gv();const pi=SS[k]?SS[k].idx:0;SS[k]={idx:0,vis,total:data.length};$(k+'T').innerHTML=data.map((d,i)=>fn(d,i,k)).join('');uSw(k);eTouch(k+'W',k);}
function rSk(){
  $('skGrid').innerHTML=D.sk.map((c,ci)=>`
    <div class="sk-cat" data-ci="${ci}">
      <canvas class="sk-canvas" data-ci="${ci}"></canvas>
      <div class="sk-tit">${esc(c.cat)}</div>
      <div class="sk-tags">${c.tags.map((t,ti)=>`<span class="sk-tag" data-ti="${ti}">${esc(t)}</span>`).join('')}</div>
    </div>`).join('');
  initSkRouting();
}

function initSkRouting(){
  const ACCENT_SETS=[
    ['#6c63ff','#00d4ff','#06d6a0'],
    ['#00d4ff','#06d6a0','#ffd166'],
    ['#ff6b9d','#6c63ff','#00d4ff'],
    ['#ffd166','#ff9a3c','#ff6b9d'],
    ['#06d6a0','#00d4ff','#6c63ff']
  ];

  document.querySelectorAll('.sk-cat').forEach((card,ci)=>{
    const canvas = card.querySelector('.sk-canvas');
    const ctx = canvas.getContext('2d');
    const colors = ACCENT_SETS[ci % ACCENT_SETS.length];
    let raf = null, active = false;

    // Build routing path: orthogonal L-shaped segments between tag centers
    function getTagCenters(){
      const cardR = card.getBoundingClientRect();
      return Array.from(card.querySelectorAll('.sk-tag')).map(tag=>{
        const r = tag.getBoundingClientRect();
        return {
          x: r.left - cardR.left + r.width/2,
          y: r.top  - cardR.top  + r.height/2
        };
      });
    }

    // Build segments: each tag connects to next with an L-route (horizontal then vertical)
    function buildSegments(pts){
      const segs=[];
      for(let i=0;i<pts.length-1;i++){
        const a=pts[i], b=pts[i+1];
        const mid = {x: b.x, y: a.y}; // corner point
        segs.push({ax:a.x,ay:a.y, cx:mid.x,cy:mid.y, bx:b.x,by:b.y});
      }
      return segs;
    }

    let progress=0; // 0..1 across total path
    let hue=0;

    function totalPathLen(segs){
      return segs.reduce((s,sg)=>s+Math.abs(sg.cx-sg.ax)+Math.abs(sg.cy-sg.ax)+Math.abs(sg.bx-sg.cx)+Math.abs(sg.by-sg.cy),0)||1;
    }

    function draw(){
      const W=card.offsetWidth, H=card.offsetHeight;
      canvas.width=W; canvas.height=H;
      ctx.clearRect(0,0,W,H);

      const pts=getTagCenters();
      if(pts.length<2){raf=requestAnimationFrame(draw);return;}
      const segs=buildSegments(pts);

      hue=(hue+1.2)%360;
      progress=(progress+0.004)%1;

      // Draw full path (dim)
      ctx.save();
      ctx.globalAlpha=0.10;
      ctx.strokeStyle=colors[0];
      ctx.lineWidth=1;
      ctx.setLineDash([3,5]);
      ctx.beginPath();
      pts.forEach((p,i)=>{
        if(i===0) ctx.moveTo(p.x,p.y);
        else {
          const prev=pts[i-1];
          ctx.lineTo(p.x, prev.y); // horizontal
          ctx.lineTo(p.x, p.y);    // vertical
        }
      });
      ctx.stroke();
      ctx.restore();

      // Animated RGB pulse travelling along path
      // Flatten all points of the L-route into a polyline
      const poly=[];
      poly.push({x:pts[0].x,y:pts[0].y});
      for(let i=1;i<pts.length;i++){
        poly.push({x:pts[i].x, y:pts[i-1].y}); // corner
        poly.push({x:pts[i].x, y:pts[i].y});     // next tag
      }

      // Compute cumulative lengths
      const dists=[0];
      for(let i=1;i<poly.length;i++){
        const dx=poly[i].x-poly[i-1].x, dy=poly[i].y-poly[i-1].y;
        dists.push(dists[i-1]+Math.sqrt(dx*dx+dy*dy));
      }
      const total=dists[dists.length-1]||1;

      // Draw 3 staggered pulses
      for(let p=0;p<3;p++){
        const t=((progress+(p/3))%1)*total;
        const tailLen=total*0.18;

        // Find head position on polyline
        function posAt(dist){
          dist=Math.max(0,Math.min(dist,total));
          for(let i=1;i<poly.length;i++){
            if(dists[i]>=dist){
              const seg=dists[i]-dists[i-1];
              const frac=(dist-dists[i-1])/seg;
              return{x:poly[i-1].x+(poly[i].x-poly[i-1].x)*frac,
                     y:poly[i-1].y+(poly[i].y-poly[i-1].y)*frac};
            }
          }
          return poly[poly.length-1];
        }

        const head=posAt(t);
        const tail=posAt(t-tailLen);

        // Gradient along the tail→head
        const grad=ctx.createLinearGradient(tail.x,tail.y,head.x,head.y);
        const c=colors[p%colors.length];
        grad.addColorStop(0,'transparent');
        grad.addColorStop(0.6,c+'55');
        grad.addColorStop(1,c);

        ctx.save();
        ctx.globalAlpha=0.85;
        ctx.strokeStyle=grad;
        ctx.lineWidth=1.5;
        ctx.shadowColor=c;
        ctx.shadowBlur=6;
        ctx.setLineDash([]);
        ctx.beginPath();

        // Draw the polyline segment from tail to head
        const tDist=t-tailLen, hDist=t;
        let started=false;
        for(let i=1;i<poly.length;i++){
          const segStart=dists[i-1], segEnd=dists[i];
          if(segEnd<tDist||segStart>hDist) continue;
          const fromD=Math.max(segStart,tDist), toD=Math.min(segEnd,hDist);
          const seg=segEnd-segStart||1;
          const p1={x:poly[i-1].x+(poly[i].x-poly[i-1].x)*(fromD-segStart)/seg,
                    y:poly[i-1].y+(poly[i].y-poly[i-1].y)*(fromD-segStart)/seg};
          const p2={x:poly[i-1].x+(poly[i].x-poly[i-1].x)*(toD-segStart)/seg,
                    y:poly[i-1].y+(poly[i].y-poly[i-1].y)*(toD-segStart)/seg};
          if(!started){ctx.moveTo(p1.x,p1.y);started=true;}
          ctx.lineTo(p2.x,p2.y);
        }
        ctx.stroke();
        ctx.restore();

        // Glowing dot at head
        ctx.save();
        ctx.globalAlpha=0.9;
        ctx.fillStyle=c;
        ctx.shadowColor=c;
        ctx.shadowBlur=10;
        ctx.beginPath();
        ctx.arc(head.x,head.y,2.5,0,Math.PI*2);
        ctx.fill();
        ctx.restore();
      }

      // Node dots on each tag center
      pts.forEach((p,i)=>{
        const c=colors[i%colors.length];
        ctx.save();
        ctx.globalAlpha=0.35;
        ctx.fillStyle=c;
        ctx.shadowColor=c;
        ctx.shadowBlur=8;
        ctx.beginPath();
        ctx.arc(p.x,p.y,3,0,Math.PI*2);
        ctx.fill();
        ctx.restore();
      });

      if(active) raf=requestAnimationFrame(draw);
    }

    card.addEventListener('mouseenter',()=>{
      active=true;
      progress=0;
      draw();
    });
    card.addEventListener('mouseleave',()=>{
      active=false;
      if(raf) cancelAnimationFrame(raf);
      const W=card.offsetWidth,H=card.offsetHeight;
      canvas.width=W;canvas.height=H;
      ctx.clearRect(0,0,W,H);
    });
  });
}
function rCt(){$('ctGrid').innerHTML=D.ct.map(c=>`<div class="ct-item"><div class="ct-lbl">${esc(c.lbl)}</div><div class="ct-val">${c.link&&c.link!='#'?`<a href="${esc(c.link)}" target="_blank">${esc(c.val)}</a>`:esc(c.val)}</div></div>`).join('');}

const DEF={edu:{period:'',title:'New Entry',institution:'',desc:'',logo:''},cert:{period:'',title:'New Certificate',institution:'',desc:'',logo:''},proj:{title:'New Project',cat:'',desc:'',tags:[],logo:'',video:''},ach:{icon:'⭐',title:'New Achievement',year:'',desc:''},sem:{period:'',title:'New Seminar',institution:'',desc:'',logo:''},exp:{period:'',title:'New Experience',institution:'',desc:'',logo:''}};
function add(k){D[k].push({...DEF[k]});rAll();}
function del(k,i){D[k].splice(i,1);rAll();}
function addSkCat(){D.sk.push({cat:'New Category',tags:[]});rAll();}
function delSkCat(i){D.sk.splice(i,1);rAll();}
function addCt(){D.ct.push({lbl:'',val:'',link:''});rAll();}
function delCt(i){D.ct.splice(i,1);rAll();}

function rEds(){
  ['edu','cert','sem','exp'].forEach(k=>{
    const el=$(k+'EL');if(!el)return;
    el.innerHTML=D[k].map((it,i)=>`<div class="ei"><button class="eidel" onclick="del('${k}',${i})">×</button><div class="f2"><div class="fg"><label>Period/Date</label><input value="${esc(it.period||it.year||'')}" oninput="D['${k}'][${i}].period=this.value;D['${k}'][${i}].year=this.value;rSw('${k}',D['${k}'],rCard)"/></div><div class="fg"><label>Title</label><input value="${esc(it.title)}" oninput="D['${k}'][${i}].title=this.value;rSw('${k}',D['${k}'],rCard)"/></div></div><div class="fg"><label>Institution/Org</label><input value="${esc(it.institution||it.org||'')}" oninput="D['${k}'][${i}].institution=this.value;D['${k}'][${i}].org=this.value;rSw('${k}',D['${k}'],rCard)"/></div><div class="fg"><label>Description</label><textarea rows="3" oninput="D['${k}'][${i}].desc=this.value;rSw('${k}',D['${k}'],rCard)">${esc(it.desc)}</textarea></div><div class="fg"><label>Logo URL <span style="opacity:.5;font-size:9px">(Facebook or direct image link)</span>${it.logo?` <button class="btn-clr" onclick="hLg('${k}',${i},'');rAll()">✕ clear</button>`:''}</label><input value="${esc(it.logo||'')}" placeholder="https://..." oninput="hLg('${k}',${i},this.value)"/></div></div>`).join('');
  });
  const pEL=$('projEL');
  if(pEL)pEL.innerHTML=D.proj.map((it,i)=>`<div class="ei"><button class="eidel" onclick="del('proj',${i})">×</button><div class="f2"><div class="fg"><label>Title</label><input value="${esc(it.title)}" oninput="D.proj[${i}].title=this.value;rSw('proj',D.proj,rCard)"/></div><div class="fg"><label>Category</label><input value="${esc(it.cat)}" oninput="D.proj[${i}].cat=this.value;rSw('proj',D.proj,rCard)"/></div></div><div class="fg"><label>Description</label><textarea rows="3" oninput="D.proj[${i}].desc=this.value;rSw('proj',D.proj,rCard)">${esc(it.desc)}</textarea></div><div class="fg"><label>Tags (comma separated)</label><input value="${esc((it.tags||[]).join(', '))}" oninput="D.proj[${i}].tags=this.value.split(',').map(s=>s.trim()).filter(Boolean);rSw('proj',D.proj,rCard)"/></div><div class="fg"><label>Demo Video — YouTube Link <button class="btn-clr" onclick="D.proj[${i}].video='';rAll()">✕ clear</button></label><input value="${esc(it.video||'')}" placeholder="https://www.youtube.com/watch?v=..." oninput="D.proj[${i}].video=this.value;rSw('proj',D.proj,rCard)"/></div><div class="fg"><label>Logo URL <span style="opacity:.5;font-size:9px">(Facebook or direct image link)</span>${it.logo?` <button class="btn-clr" onclick="hLg('proj',${i},'');rAll()">✕ clear</button>`:''}</label><input value="${esc(it.logo||'')}" placeholder="https://..." oninput="hLg('proj',${i},this.value)"/></div></div>`).join('');
  const aEL=$('achEL');
  if(aEL)aEL.innerHTML=D.ach.map((it,i)=>`<div class="ei"><button class="eidel" onclick="del('ach',${i})">×</button><div class="f2"><div class="fg"><label>Icon/Emoji</label><input value="${esc(it.icon)}" oninput="D.ach[${i}].icon=this.value;rSw('ach',D.ach,rAch)"/></div><div class="fg"><label>Year</label><input value="${esc(it.year)}" oninput="D.ach[${i}].year=this.value;rSw('ach',D.ach,rAch)"/></div></div><div class="fg"><label>Title</label><input value="${esc(it.title)}" oninput="D.ach[${i}].title=this.value;rSw('ach',D.ach,rAch)"/></div><div class="fg"><label>Description</label><textarea rows="3" oninput="D.ach[${i}].desc=this.value;rSw('ach',D.ach,rAch)">${esc(it.desc)}</textarea></div></div>`).join('');
  const sEL=$('skillsEL');
  if(sEL)sEL.innerHTML=D.sk.map((c,ci)=>`<div class="ei"><button class="eidel" onclick="delSkCat(${ci})">×</button><div class="fg"><label>Category Name</label><input value="${esc(c.cat)}" oninput="D.sk[${ci}].cat=this.value;rSk()"/></div><div class="fg"><label>Skills (comma separated)</label><input value="${esc(c.tags.join(', '))}" oninput="D.sk[${ci}].tags=this.value.split(',').map(s=>s.trim()).filter(Boolean);rSk()"/></div></div>`).join('');
  const cEL=$('ctEL');
  if(cEL)cEL.innerHTML=D.ct.map((c,i)=>`<div class="ei"><button class="eidel" onclick="delCt(${i})">×</button><div class="f2"><div class="fg"><label>Label</label><input value="${esc(c.lbl)}" oninput="D.ct[${i}].lbl=this.value;rCt()"/></div><div class="fg"><label>Value</label><input value="${esc(c.val)}" oninput="D.ct[${i}].val=this.value;rCt()"/></div></div><div class="fg"><label>Link URL</label><input value="${esc(c.link||'')}" placeholder="https://..." oninput="D.ct[${i}].link=this.value;rCt()"/></div></div>`).join('');
}

function rAll(){rSw('edu',D.edu,rCard);rSw('cert',D.cert,rCard);rSw('proj',D.proj,rCard);rSw('ach',D.ach,rAch);rSw('sem',D.sem,rCard);rSw('exp',D.exp,rCard);rSk();rCt();rEds();if(typeof syncStats==='function')syncStats();setTimeout(bindTilt,100);
}
