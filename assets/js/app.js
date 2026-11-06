'use strict';
/* ===== Sân khấu ===== */
const cv=$('#cv'),dev=$('#device'),stage=$('#stage'),sheet=$('#sheet'),grip=$('#grip');
let cssW=0,cssH=0,dpr=1,raf=0,tab='tpl',uploadTarget=null,pid=1;
const mob=()=>innerWidth<900;
function fitStage(){
  const r=stage.getBoundingClientRect(),ar=ratio();dev.className='';document.body.classList.toggle('inv',S.mode==='invite');
  const top=60,bot=16,side=12;
  let h=r.height-top-bot,w=h/ar;if(w>r.width-2*side){w=r.width-2*side;h=w*ar}
  w=Math.max(40,w);h=Math.max(40,h);cssW=w;cssH=h;dev.style.width=w+'px';dev.style.height=h+'px';dev.style.top=(top+(r.height-top-bot)/2)+'px';
  dpr=Math.min(2.5,devicePixelRatio||1);cv.width=Math.round(w*dpr);cv.height=Math.round(h*dpr);
  const z=sz();$('#szlabel').textContent=z.n;$('#szsub').textContent=z.sub;draw(true);
}
function draw(now){cancelAnimationFrame(raf);if(now===true)doDraw();else raf=requestAnimationFrame(doDraw)}
function doDraw(){lastSlots=render(cv.getContext('2d'),cssW,cssH,{preview:1,sel,dpr});syncSlotbar();stripSoon()}
new ResizeObserver(()=>fitStage()).observe(stage);

/* Safari can smart-zoom the page on a second tap even inside the canvas.
   Cancel only the preview's native gesture; Pointer Events still pan/pinch photos. */
dev.addEventListener('touchend',ev=>{if(ev.cancelable)ev.preventDefault()},{passive:false});
dev.addEventListener('dblclick',ev=>ev.preventDefault());

/* ===== Chạm · kéo · zoom ảnh trong khung ===== */
const ptrs=new Map();let drag=null,pinch=null;
const toD=ev=>{const r=cv.getBoundingClientRect();return{x:(ev.clientX-r.left)/r.width*1000,y:(ev.clientY-r.top)/r.width*1000}};
function hit(pt){for(let i=lastSlots.length-1;i>=0;i--){const e=lastSlots[i],cx=e.x+e.w/2,cy=e.y+e.h/2,a=-(e.rot||0),dx=pt.x-cx,dy=pt.y-cy,
  lx=dx*Math.cos(a)-dy*Math.sin(a),ly=dx*Math.sin(a)+dy*Math.cos(a);if(Math.abs(lx)<=e.w/2&&Math.abs(ly)<=e.h/2)return i}return null}
const ens=i=>{const m=slotsOf(curSlide());return m[i]||(m[i]={pid:null,z:1,ox:0,oy:0})};
cv.addEventListener('pointerdown',ev=>{cv.setPointerCapture(ev.pointerId);ptrs.set(ev.pointerId,ev);
  if(ptrs.size===1){const pt=toD(ev),h=hit(pt);drag={h,idx:h==null?null:lastSlots[h]._i,last:pt,start:pt,moved:false}}
  else if(ptrs.size===2&&sel!=null){const[a,b]=[...ptrs.values()];pinch={d:Math.hypot(a.clientX-b.clientX,a.clientY-b.clientY),z:ens(sel).z};drag=null}});
cv.addEventListener('pointermove',ev=>{if(!ptrs.has(ev.pointerId))return;ptrs.set(ev.pointerId,ev);
  if(pinch&&ptrs.size===2){const[a,b]=[...ptrs.values()],d=Math.hypot(a.clientX-b.clientX,a.clientY-b.clientY);ens(sel).z=clamp(pinch.z*d/pinch.d,1,4);draw();return}
  if(!drag||drag.h==null)return;const pt=toD(ev);if(!drag.moved&&Math.hypot(pt.x-drag.start.x,pt.y-drag.start.y)<8)return;
  drag.moved=true;if(drag.idx!==sel)return;
  const e=lastSlots[drag.h],src=srcFor(curSlide(),drag.idx,slideIndex(curSlide()));if(!e||!src)return;const st=ens(drag.idx);
  let dx=pt.x-drag.last.x,dy=pt.y-drag.last.y;const G=coverGeom(e,src,st);if(G.ex>.5)st.ox=clamp(st.ox+2*dx/G.ex,-1,1);if(G.ey>.5)st.oy=clamp(st.oy+2*dy/G.ey,-1,1);drag.last=pt;draw()});
const endP=ev=>{if(!ptrs.has(ev.pointerId))return;ptrs.delete(ev.pointerId);if(ptrs.size<2)pinch=null;
  if(drag&&!drag.moved&&ptrs.size===0){if(drag.idx==null)sel=null;else{sel=drag.idx;if(!photos.length&&!S.demo){uploadTarget=sel;$('#file').click()}}hideHint();draw();if(tab==='photo')renderPanel()}
  if(ptrs.size===0)drag=null};
cv.addEventListener('pointerup',endP);cv.addEventListener('pointercancel',endP);
function syncSlotbar(){const v=sel!=null;$('#slotbar').classList.toggle('show',v);document.body.classList.toggle('has-sel',v);if(v){const z=$('#sbZoom'),val=(slotsOf(curSlide())[sel]||{}).z||1;if(+z.value!==val)z.value=val}}
$('#sbZoom').oninput=e=>{if(sel==null)return;ens(sel).z=+e.target.value;draw()};
$('#sbRep').onclick=()=>{if(sel==null)return;if(photos.length){tab='photo';setMode(mob()?'peek':'full')}else{uploadTarget=sel;$('#file').click()}};
$('#sbCtr').onclick=()=>{if(sel==null)return;Object.assign(ens(sel),{z:1,ox:0,oy:0});draw()};
$('#sbX').onclick=()=>{sel=null;draw();if(tab==='photo')renderPanel()};

/* ===== Đổi slide: vuốt · nút · phím ===== */
const tplName=$('#tplname');let tnT=0,sw=null,swiping=false;
function showName(){const sl=curSlide(),inv=S.mode==='invite',L=inv?INVT:S.slides,k=inv?INVT.findIndex(t=>t.id===sl.tpl):S.cur;tplName.innerHTML=`<b>${tplById(sl.tpl).n}</b><span>${k+1} / ${L.length}</span>`;tplName.classList.add('show');clearTimeout(tnT);tnT=setTimeout(()=>tplName.classList.remove('show'),1500)}
function goSlide(i,anim){let dir;
  if(S.mode==='invite'){const L=INVT,k=L.findIndex(t=>t.id===S.invite.tpl),n=L.length;dir=i>S.cur?1:-1;const j=((k+dir)%n+n)%n;
    const apply=()=>{S.invite.tpl=L[j].id;save();draw(true);if(tab==='tpl')renderPanel();showName()};return animSwap(dir,anim,apply)}
  i=(i+S.slides.length)%S.slides.length;if(i===S.cur)return;dir=i>S.cur?1:-1;
  const apply=()=>{S.cur=i;sel=null;save();draw(true);syncStrip();if(tab==='tpl'||tab==='verse'||tab==='photo')renderPanel();showName()};return animSwap(dir,anim,apply)}
function animSwap(dir,anim,apply){
  if(!anim||swiping)return apply();swiping=true;const base='translate(-50%,-50%)';
  dev.animate([{transform:base,opacity:1},{transform:`${base} translateX(${-dir*70}px)`,opacity:0}],{duration:140,easing:'ease-in'}).onfinish=()=>{apply();
    dev.animate([{transform:`${base} translateX(${dir*70}px)`,opacity:0},{transform:base,opacity:1}],{duration:230,easing:'cubic-bezier(.2,.8,.2,1)'}).onfinish=()=>{swiping=false}}}
stage.addEventListener('pointerdown',e=>{if(e.target.closest('.navbtn'))return;if(e.target===cv&&sel!=null){const h=hit(toD(e));if(h!=null&&lastSlots[h]._i===sel)return}sw={x:e.clientX,y:e.clientY,id:e.pointerId}});
stage.addEventListener('pointerup',e=>{if(!sw||e.pointerId!==sw.id)return;const dx=e.clientX-sw.x,dy=e.clientY-sw.y;sw=null;if(Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy)*1.4)goSlide(S.cur+(dx<0?1:-1),true)});
stage.addEventListener('pointercancel',()=>{sw=null});
$('#navPrev').onclick=()=>goSlide(S.cur-1,true);$('#navNext').onclick=()=>goSlide(S.cur+1,true);
addEventListener('keydown',e=>{if(/INPUT|TEXTAREA/.test(document.activeElement?.tagName)||$('#modal').classList.contains('show'))return;
  if($('#play').classList.contains('show')){if(e.key==='ArrowRight'||e.key===' '||e.key==='PageDown')playGo(1);else if(e.key==='ArrowLeft'||e.key==='PageUp')playGo(-1);else if(e.key==='Escape')playStop();return}
  if(e.key==='ArrowRight')goSlide(S.cur+1,true);else if(e.key==='ArrowLeft')goSlide(S.cur-1,true)});

/* ===== Dải slide ===== */
let stT=0;const stripSoon=()=>{clearTimeout(stT);stT=setTimeout(renderStrip,220)};
function renderStrip(){
  const el=$('#strip'),ar=ratio(),th=mob()?54:66,tw=Math.round(Math.min(th/ar,th*1.9)),hh=Math.round(tw*ar),d=Math.min(2,devicePixelRatio||1);
  if(S.mode==='invite')return;
  if(el.children.length!==S.slides.length||el.dataset.ar!=ar){el.dataset.ar=ar;
    el.innerHTML=S.slides.map((s,i)=>`<div class="thumb" data-i="${i}"><canvas style="width:${tw}px;height:${hh}px" width="${tw*d}" height="${hh*d}"></canvas></div>`).join('');
    el.querySelectorAll('.thumb').forEach(t=>t.onclick=()=>goSlide(+t.dataset.i))}
  el.querySelectorAll('.thumb').forEach((t,i)=>{t.classList.toggle('on',i===S.cur);const c=t.querySelector('canvas');render(c.getContext('2d'),tw,hh,{dpr:d,slide:S.slides[i],idx:i})});
}
function syncStrip(){const el=$('#strip');el.querySelectorAll('.thumb').forEach((t,i)=>t.classList.toggle('on',i===S.cur));const on=el.querySelector('.thumb.on');if(on)on.scrollIntoView({inline:'nearest',block:'nearest'})}
/* ===== Nạp ảnh ===== */
$('#file').addEventListener('change',async ev=>{
  const files=[...ev.target.files];ev.target.value='';if(!files.length)return;toast('Đang nạp ảnh…');const added=[];
  for(const f of files){try{added.push(await loadPhoto(f))}catch(e){}}
  photos.push(...added);if(uploadTarget!=null&&added[0])Object.assign(ens(uploadTarget),{pid:added[0].id,z:1,ox:0,oy:0});
  uploadTarget=null;toast(added.length?`Đã thêm ${added.length} ảnh ✦`:'Không đọc được ảnh này');draw();renderStrip();if(tab==='photo')renderPanel()});
function loadPhoto(file){return new Promise((res,rej)=>{const url=URL.createObjectURL(file),img=new Image();
  img.onload=()=>{const MAX=isIOS?2400:3600,k=Math.min(1,MAX/Math.max(img.naturalWidth,img.naturalHeight)),c=document.createElement('canvas');
    c.width=Math.round(img.naturalWidth*k);c.height=Math.round(img.naturalHeight*k);c.getContext('2d').drawImage(img,0,0,c.width,c.height);
    const t=document.createElement('canvas'),tk=180/Math.min(c.width,c.height);t.width=Math.round(c.width*tk);t.height=Math.round(c.height*tk);t.getContext('2d').drawImage(c,0,0,t.width,t.height);
    URL.revokeObjectURL(url);res({id:pid++,src:c,thumb:t.toDataURL('image/jpeg',.8)})};
  img.onerror=()=>{URL.revokeObjectURL(url);rej()};img.src=url})}

/* ===== Tab & ngăn kéo ===== */
const ICO={
 tpl:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linejoin="round"><rect x="3" y="5" width="18" height="11" rx="1.5"/><path d="M9 20h6M12 16v4"/></svg>',
 photo:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linejoin="round"><rect x="3.5" y="5" width="17" height="14" rx="2"/><circle cx="9" cy="10" r="1.8"/><path d="M4 17l5-4.5 4 3.5 3-2.5 4 3.5"/></svg>',
 text:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round"><path d="M5 6.5V5h14v1.5M12 5v14M9.5 19h5"/></svg>',
 verse:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linejoin="round" stroke-linecap="round"><path d="M12 6.5C10 5 7 4.5 4 5v13c3-.5 6 0 8 1.5 2-1.5 5-2 8-1.5V5c-3-.5-6 0-8 1.5zM12 6.5v13"/><path d="M16 8.5v4M14.5 10h3"/></svg>',
 color:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 3.5a8.5 8.5 0 1 0 0 17c1.2 0 1.8-.8 1.8-1.7 0-1.5-1.3-1.6-1.3-3s1-2 2.4-2H17a3.5 3.5 0 0 0 3.5-3.5c0-3.8-3.8-6.8-8.5-6.8z"/><circle cx="7.8" cy="11" r="1.1" fill="currentColor"/><circle cx="10.5" cy="7.5" r="1.1" fill="currentColor"/><circle cx="15" cy="7.8" r="1.1" fill="currentColor"/></svg>',
 show:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linejoin="round" stroke-linecap="round"><rect x="3" y="4" width="18" height="12" rx="1.5"/><path d="M10 8v4l3.5-2z" fill="currentColor"/><path d="M8 20h8"/></svg>',
};
const TABS=[['tpl','Mẫu'],['photo','Ảnh'],['text','Nội dung'],['verse','Lời Chúa'],['color','Phong cách'],['show','Kích thước']];
function buildTabs(){const inv=S.mode==='invite',list=inv?[['tpl','Kiểu thiệp'],['photo','Ảnh'],['text','Nội dung'],['verse','Lời Chúa'],['show','Kích thước']]:TABS;
  if(!list.some(([k])=>k===tab))tab='tpl';$("#tabs").style.setProperty("--tc",list.length);
  $('#tabs').innerHTML=list.map(([k,n])=>`<button class="tab" data-t="${k}">${ICO[k]}<span>${n}</span></button>`).join('')}
buildTabs();
const PEEK={tpl:1,photo:1,verse:1,color:1};
function sheetH(m){if(m==='closed')return 0;const max=Math.round(innerHeight*(m==='peek'?.42:.6)),P=$('#panel');if(sheet.dataset.mode!==m)return m==='peek'?220:max;
  const top=P.getBoundingClientRect().top;let b=0;for(const el of P.children)b=Math.max(b,el.getBoundingClientRect().bottom);return Math.min(max,Math.round(grip.offsetHeight+b-top+P.scrollTop+20))}
function setMode(m,keep){if(!mob())m='full';sheet.dataset.mode=m;renderPanel();sheet.style.setProperty('--dh',sheetH(m)+'px');syncTabs();if(!keep)$('#panel').scrollTop=0}
function openTab(k,keep){tab=k;setMode(mob()&&PEEK[k]?'peek':'full',keep)}
function syncTabs(){const closed=sheet.dataset.mode==='closed';document.querySelectorAll('.tab').forEach(b=>b.classList.toggle('on',b.dataset.t===tab&&!closed))}
$('#tabs').addEventListener('click',ev=>{const b=ev.target.closest('.tab');if(!b)return;const k=b.dataset.t;if(mob()&&k===tab&&sheet.dataset.mode!=='closed'){setMode('closed');return}openTab(k)});
let gd=null;
grip.addEventListener('pointerdown',e=>{if(!mob())return;gd={y:e.clientY,h:sheet.getBoundingClientRect().height,moved:false};sheet.classList.add('drag');grip.setPointerCapture(e.pointerId)});
grip.addEventListener('pointermove',e=>{if(!gd)return;const dy=e.clientY-gd.y;if(Math.abs(dy)>5)gd.moved=true;if(gd.moved)sheet.style.setProperty('--dh',clamp(gd.h-dy,0,innerHeight*.8)+'px')});
const gEnd=()=>{if(!gd)return;sheet.classList.remove('drag');const h=sheet.getBoundingClientRect().height,cur=sheet.dataset.mode;
  if(!gd.moved)setMode(cur==='full'&&PEEK[tab]?'peek':'full',true);else{const pk=PEEK[tab]?220:0,fl=innerHeight*.6;setMode(h<(pk||fl)*.5?'closed':pk&&h<(pk+fl)/2?'peek':'full',true)}gd=null};
grip.addEventListener('pointerup',gEnd);grip.addEventListener('pointercancel',gEnd);

function symIcon(c,kind){const x=c.getContext('2d'),d=2;c.width=58*d;c.height=58*d;x.scale(d,d);drawSymbol(x,kind,29,29,48,'gold',pal(tplById(curSlide().tpl).pal||{bg:'#fff',text:'#2e1a21',accent:'#b8324a'}))}
function renderPanel(){
  const P=$('#panel'),peek=mob()&&sheet.dataset.mode==='peek',sl=curSlide();
  const inv=S.mode==='invite',LT=inv?INVT:TPL;
  const T0={tpl:inv?['Kiểu thiệp',`${INVT.length} kiểu`]:['Mẫu ảnh',`${TPL.length} mẫu`],photo:['Ảnh',photos.length?`${photos.length} ảnh`:'đang dùng ảnh mẫu'],text:['Nội dung',inv?'cha mẹ hai bên · thánh lễ':'tên thánh · họ tên · thánh lễ'],verse:['Lời Chúa & biểu tượng',inv?'trên thiệp':'của ảnh này'],color:['Phong cách','màu · font'],show:['Kích thước',inv?'thiệp điện tử · in thiệp':'tivi · mạng xã hội · in']}[tab];
  $('#ptitle').textContent=T0[0];$('#psub').textContent=T0[1];
  if(tab==='tpl'){
    const wide=ratio()<1?' wide':'';
    P.innerHTML=peek?`<div class="hstrip">${LT.map(t=>`<button class="tcard sm${wide}${t.id===sl.tpl?' on':''}" data-id="${t.id}"><div class="tthumb"><canvas></canvas></div><b>${t.n}</b></button>`).join('')}</div>`
      :`<div class="tgrid${wide}">${LT.map(t=>`<button class="tcard${wide}${t.id===sl.tpl?' on':''}" data-id="${t.id}"><div class="tthumb"><canvas></canvas></div><b>${t.n}</b><small>${t.d}</small></button>`).join('')}</div>`;
    P.querySelectorAll('.tcard').forEach(b=>b.onclick=()=>{curSlide().tpl=b.dataset.id;sel=null;save();P.querySelectorAll('.tcard').forEach(x=>x.classList.toggle('on',x===b));draw();renderStrip()});
    const on=P.querySelector('.tcard.on');if(peek&&on)on.scrollIntoView({inline:'center',block:'nearest'});thumbs();
  }
  else if(tab==='photo'){
    const st=sel!=null?ens(sel):null,cur=sel!=null?(st.pid||(photos.length?photos[photoIndex(curSlide(),sel,photos.length)].id:null)):null;
    const lib=photos.map(q=>`<div class="ph${q.id===cur?' pick':''}" data-id="${q.id}"><img src="${q.thumb}" alt=""><button class="x" data-del="${q.id}" aria-label="Xoá">×</button></div>`).join('');
    P.innerHTML=peek?`<div class="hstrip phs"><button class="addph" id="upAll"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg><span>Thêm ảnh</span></button>${lib}
        <div class="pnote">${sel!=null?(photos.length?'Chạm một ảnh để đặt vào khung đang chọn':'Thêm ảnh để thay vào khung đang chọn'):(photos.length?'Ảnh tự xếp vào các slide · chạm khung để chọn':'Chọn nhiều ảnh cưới — tự xếp vào tất cả slide')}</div></div>`
      :`<button class="upl" id="upAll"><span class="pl">${ICO.photo}</span><span><b>Chọn ảnh cưới</b><small>Chọn nhiều ảnh — tự xếp vào tất cả slide</small></span></button>
       <p class="note" style="margin:14px 0">✦ Chạm một khung trên slide để chọn, rồi chạm ảnh bên dưới để đặt vào. Kéo để căn, 2 ngón để zoom.</p><div class="lib">${lib}</div>
       <div class="toggle" style="margin-top:8px"><span>Hiện ảnh mẫu ở khung trống</span><button class="sw2${S.demo?' on':''}" id="demo"></button></div>`;
    $('#upAll').onclick=()=>{uploadTarget=sel;$('#file').click()};
    P.querySelectorAll('.ph').forEach(el=>el.onclick=ev=>{const d=ev.target.dataset.del;
      if(d){photos=photos.filter(q=>q.id!=d);Object.values(SLOTS).forEach(m=>Object.values(m).forEach(s=>{if(s.pid==d)s.pid=null}));renderPanel();draw();renderStrip();return}
      if(sel!=null){Object.assign(ens(sel),{pid:+el.dataset.id,z:1,ox:0,oy:0});renderPanel();draw()}else toast('Chạm vào một khung ảnh trên slide trước nhé')});
    if($('#demo'))$('#demo').onclick=()=>{S.demo=!S.demo;save();renderPanel();draw();renderStrip()};
  }
  else if(tab==='text'){
    const f=texts();
    P.innerHTML=(inv?FIELDS_INV:FIELDS_SLIDE).map(([g,list])=>`<div class="lbl2">${g}</div>`+list.map(([k,l,t])=>t==='area'?`<label class="field"><span>${l}</span><textarea data-k="${k}" rows="2">${esc(f[k])}</textarea></label>`:`<label class="field"><span>${l}</span><input data-k="${k}" value="${esc(f[k])}" enterkeyhint="done"></label>`).join('')).join('')+
      `<div class="range" style="margin-top:8px"><span>Cỡ chữ</span><input type="range" id="ts" min=".75" max="1.3" step=".01" value="${S.tscale}"><em id="tsv">${Math.round(S.tscale*100)}%</em></div>`;
    P.querySelectorAll('[data-k]').forEach(el=>{el.oninput=()=>{S.texts[el.dataset.k]=el.value;save();draw()};if(el.tagName==='INPUT')el.onkeydown=e=>{if(e.key==='Enter')el.blur()}});
    $('#ts').oninput=ev=>{S.tscale=+ev.target.value;$('#tsv').textContent=Math.round(S.tscale*100)+'%';save();draw()};
  }
  else if(tab==='verse'){
    const vc=(v,i)=>`<button class="vcard${sl.v===i?' on':''}" data-v="${i}">“${esc(v.t)}”<small>${esc(v.r)}</small></button>`;
    const syms=`<div class="syms">${Object.entries(SYMBOLS).map(([k,n])=>`<button class="symb${sl.sym===k?' on':''}" data-s="${k}"><canvas></canvas>${n}</button>`).join('')}</div>`;
    P.innerHTML=peek?`${syms}<div class="hstrip">${VERSES.map(vc).join('')}<button class="more" data-full>Tự nhập<br>câu khác ›</button></div>`
      :`<div class="lbl2" style="margin-top:4px">Biểu tượng ${inv?'trên thiệp':'của ảnh này'}</div>${syms}<div class="lbl2">Câu Lời Chúa</div><div class="vlist">${VERSES.map(vc).join('')}
        <button class="vcard${sl.v===-1?' on':''}" data-v="-1">✎ Tự nhập câu khác<small>dùng bản dịch giáo xứ bạn quen dùng</small></button></div>
        <div id="custom" style="${sl.v===-1?'':'display:none'};margin-top:12px"><label class="field"><span>Câu Lời Chúa</span><textarea id="vt" rows="3">${esc(sl.vt)}</textarea></label><label class="field"><span>Trích dẫn (vd: Mt 19,6)</span><input id="vr" value="${esc(sl.vr)}"></label></div>
        <p class="note" style="margin-top:12px">Các câu trích theo bản dịch Kinh Thánh Công giáo của Nhóm Phiên dịch các Giờ Kinh Phụng vụ (CGKPV).</p>`;
    P.querySelectorAll('.symb').forEach(b=>{symIcon(b.querySelector('canvas'),b.dataset.s);b.onclick=()=>{curSlide().sym=b.dataset.s;save();P.querySelectorAll('.symb').forEach(x=>x.classList.toggle('on',x===b));draw()}});
    P.querySelectorAll('[data-v]').forEach(b=>b.onclick=()=>{curSlide().v=+b.dataset.v;save();P.querySelectorAll('[data-v]').forEach(x=>x.classList.toggle('on',x===b));if($('#custom'))$('#custom').style.display=curSlide().v===-1?'':'none';draw()});
    if($('#vt')){$('#vt').oninput=e=>{curSlide().vt=e.target.value;save();draw()};$('#vr').oninput=e=>{curSlide().vr=e.target.value;save();draw()}}
  }
  else if(tab==='color'){
    const sws=Object.entries(PALS).map(([k,v])=>`<button class="sw${k===S.pal?' on':''}" data-p="${k}"><i style="background:${v.bg};--t:${v.text};--a:${v.accent}"></i>${v.n}</button>`).join('');
    P.innerHTML=peek?`<div class="hstrip sws">${sws}<button class="more" data-full>Font &<br>tuỳ chọn ›</button></div>`
     :`<div class="sec"><label>Bảng màu</label><div class="swgrid">${sws}</div></div>
       <div class="sec"><label>Bộ font</label><div class="chips">${Object.entries(FP).map(([k,v])=>`<button class="fp${k===S.fp?' on':''}" data-f="${k}"><span class="s1" style="font-family:'${v.display}';font-weight:${v.dw}">Minh Khang</span><span class="s2" style="font-family:'${v.script}'">Thảo Vy</span><small>${v.n}</small></button>`).join('')}</div></div>
       <div class="sec"><label>Bố cục</label><div class="range"><span>Khoảng cách ảnh</span><input type="range" data-r="gap" min="0" max="40" step="1" value="${S.gap}"><em>${S.gap}</em></div>
       <div class="range"><span>Bo góc ảnh</span><input type="range" data-r="radius" min="0" max="40" step="1" value="${S.radius}"><em>${S.radius}</em></div></div>
       <button class="bigbtn alt" data-reset>↺ Khôi phục cài đặt mặc định</button>`;
    P.querySelectorAll('[data-p]').forEach(b=>b.onclick=()=>{S.pal=b.dataset.p;save();P.querySelectorAll('[data-p]').forEach(x=>x.classList.toggle('on',x===b));draw();renderStrip()});
    P.querySelectorAll('[data-f]').forEach(b=>b.onclick=()=>{S.fp=b.dataset.f;save();P.querySelectorAll('[data-f]').forEach(x=>x.classList.toggle('on',x===b));draw();renderStrip()});
    P.querySelectorAll('[data-r]').forEach(i=>i.oninput=()=>{S[i.dataset.r]=+i.value;i.nextElementSibling.textContent=i.value;save();draw()});
  }
  else if(tab==='show'){
    const SZ=inv?ISIZES:SIZES,key=inv?'isize':'size',groups={};Object.entries(SZ).forEach(([k,v])=>(groups[v.g]=groups[v.g]||[]).push([k,v]));
    const card=([k,v])=>{const r=v.h/v.w,h=r>=1?Math.min(34,22*r):22*r,w=r>=1?h/r:26;return`<button class="szc${k===S[key]?' on':''}" data-s="${k}"><span class="ic"><i style="width:${w}px;height:${h}px"></i></span><span><b>${v.n}</b><small>${v.sub}</small></span></button>`};
    P.innerHTML=Object.entries(groups).map(([g,l])=>`<div class="group-t">${g}</div><div class="sizes">${l.map(card).join('')}</div>`).join('')+(inv?'':`
      <div class="sec" style="margin-top:6px"><label>Khi trình chiếu</label><div class="range"><span>Tự chuyển sau</span><input type="range" id="dur" min="3" max="30" step="1" value="${S.dur}"><em id="durv">${S.dur}s</em></div>
      <div class="chips"><button class="chip${S.fx==='fade'?' on':''}" data-fx="fade">Mờ dần</button><button class="chip${S.fx==='slide'?' on':''}" data-fx="slide">Trượt ngang</button><button class="chip${S.fx==='none'?' on':''}" data-fx="none">Chuyển ngay</button></div>
      <div class="toggle"><span>Hiệu ứng ảnh chuyển động nhẹ</span><button class="sw2${S.kb?' on':''}" id="kb"></button></div></div>`);
    if($('#dur')){$('#dur').oninput=e=>{S.dur=+e.target.value;$('#durv').textContent=S.dur+'s';save()};
      P.querySelectorAll('[data-fx]').forEach(b=>b.onclick=()=>{S.fx=b.dataset.fx;save();P.querySelectorAll('[data-fx]').forEach(x=>x.classList.toggle('on',x===b))});
      $('#kb').onclick=()=>{S.kb=!S.kb;save();$('#kb').classList.toggle('on',S.kb)}}
    P.querySelectorAll('[data-s]').forEach(b=>b.onclick=()=>{S[key]=b.dataset.s;save();P.querySelectorAll('[data-s]').forEach(x=>x.classList.toggle('on',x===b));$('#strip').innerHTML='';fitStage();renderStrip()});
  }
  P.querySelectorAll('[data-full]').forEach(b=>b.onclick=()=>setMode('full'));
  P.querySelectorAll('[data-reset]').forEach(b=>b.onclick=askReset);
}
let thT=0,thJob=0;
function thumbs(){clearTimeout(thT);thT=setTimeout(()=>{if(tab!=='tpl')return;const job=++thJob,cards=[...document.querySelectorAll('.tcard')],ar=ratio(),d=Math.min(2,devicePixelRatio||1),sl=curSlide();let i=0;
  const step=()=>{if(job!==thJob)return;const t0=performance.now();
    while(i<cards.length&&performance.now()-t0<24){const c=cards[i++],cnv=c.querySelector('canvas'),box=c.querySelector('.tthumb'),pad=c.classList.contains('sm')?9:13,bw=Math.max(20,box.clientWidth-2*pad),bh=Math.max(20,box.clientHeight-2*pad);
      let h=bh,w=h/ar;if(w>bw){w=bw;h=w*ar}w=Math.round(w);h=Math.round(h);cnv.width=Math.round(w*d);cnv.height=Math.round(h*d);cnv.style.width=w+'px';cnv.style.height=h+'px';
      render(cnv.getContext('2d'),w,h,{dpr:d,slide:{...sl,tpl:c.dataset.id},idx:S.cur})}
    if(i<cards.length)requestAnimationFrame(step)};step()},0)}

/* ===== Trình chiếu toàn màn hình ===== */
const play=$('#play');let pIdx=0,pTimer=0,pAuto=true,pCanv=[],pFront=0,uiT=0,wake=null,pT0=0,pRaf=0;
function playSize(){const ar=ratio();let w=innerWidth,h=w*ar;if(h>innerHeight){h=innerHeight;w=h/ar}return{w,h}}
function playRender(c,i){const{w,h}=playSize(),d=Math.min(2,devicePixelRatio||1);c.width=Math.round(w*d);c.height=Math.round(h*d);c.style.width=w+'px';c.style.height=h+'px';render(c.getContext('2d'),w,h,{dpr:d,slide:S.slides[i],idx:i})}
function playShow(i,dir=1){pIdx=(i+S.slides.length)%S.slides.length;const next=pCanv[1-pFront],cur=pCanv[pFront];playRender(next,pIdx);
  next.style.transition='none';next.style.transform='translate(-50%,-50%) scale(1)';next.style.marginLeft=S.fx==='slide'?(dir*40)+'px':'0';next.offsetWidth;next.style.transition='';
  next.classList.add('on');next.style.marginLeft='0';cur.classList.remove('on');if(S.fx==='slide')cur.style.marginLeft=(-dir*40)+'px';
  if(S.kb){next.style.transition+=(next.style.transition?',':'')+`transform ${S.dur+1}s linear`;requestAnimationFrame(()=>next.style.transform='translate(-50%,-50%) scale(1.045)')}
  pFront=1-pFront;$('#pCnt').textContent=`${pIdx+1} / ${S.slides.length} · ${tplById(S.slides[pIdx].tpl).n}`;schedule()}
function schedule(){clearTimeout(pTimer);cancelAnimationFrame(pRaf);$('#pBar').style.width='0';if(!pAuto)return;pT0=performance.now();
  const tick=()=>{const k=(performance.now()-pT0)/(S.dur*1000);$('#pBar').style.width=Math.min(100,k*100)+'%';if(k<1)pRaf=requestAnimationFrame(tick)};tick();
  pTimer=setTimeout(()=>playShow(pIdx+1,1),S.dur*1000)}
function playGo(d){playShow(pIdx+d,d);pokeUI()}
function syncAuto(){$('#pAuto').innerHTML=pAuto?'❚❚ Tạm dừng':'▶ Tự chạy'}
function pokeUI(){play.classList.add('ui');clearTimeout(uiT);uiT=setTimeout(()=>play.classList.remove('ui'),2600)}
async function playStart(i){
  play.querySelectorAll('canvas').forEach(c=>c.remove());pCanv=[document.createElement('canvas'),document.createElement('canvas')];pCanv.forEach(c=>play.insertBefore(c,play.firstChild));pFront=0;
  play.className='show fx-'+S.fx;sel=null;pAuto=true;syncAuto();
  try{if(document.documentElement.requestFullscreen)await document.documentElement.requestFullscreen({navigationUI:'hide'})}catch(e){}
  try{wake=await navigator.wakeLock?.request('screen')}catch(e){}
  setTimeout(()=>{playShow(i,1);$('#pTip').textContent=(innerHeight>innerWidth&&ratio()<1?'Xoay ngang điện thoại để xem lớn hơn · ':'')+'Chạm hai bên hoặc vuốt để chuyển · chạm giữa để hiện điều khiển';$('#pTip').classList.add('show');setTimeout(()=>$('#pTip').classList.remove('show'),3500)},120)}
function playStop(){clearTimeout(pTimer);cancelAnimationFrame(pRaf);play.className='';try{if(document.fullscreenElement)document.exitFullscreen()}catch(e){}try{wake&&wake.release()}catch(e){}wake=null;
  S.cur=pIdx;save();draw(true);syncStrip()}
$('#pX').onclick=e=>{e.stopPropagation();playStop()};
$('#pAuto').onclick=e=>{e.stopPropagation();pAuto=!pAuto;syncAuto();schedule();pokeUI()};
let ps=null;
play.addEventListener('pointerdown',e=>{if(e.target.closest('.pctl'))return;ps={x:e.clientX,y:e.clientY}});
play.addEventListener('pointerup',e=>{if(!ps||e.target.closest('.pctl'))return;const dx=e.clientX-ps.x,dy=e.clientY-ps.y;ps=null;
  if(Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy))return playGo(dx<0?1:-1);
  const x=e.clientX/innerWidth;if(x<.28)playGo(-1);else if(x>.72)playGo(1);else{if(play.classList.contains('ui'))play.classList.remove('ui');else pokeUI()}});
play.addEventListener('pointermove',e=>{if(e.pointerType==='mouse')pokeUI()});
document.addEventListener('fullscreenchange',()=>{if(!document.fullscreenElement&&play.classList.contains('show'))setTimeout(()=>{pCanv.forEach((c,k)=>{if(c.classList.contains('on'))playRender(c,pIdx)})},100)});
addEventListener('resize',()=>{if(play.classList.contains('show'))pCanv.forEach(c=>{if(c.classList.contains('on'))playRender(c,pIdx)})});
$('#btnPlay').onclick=()=>playStart(S.cur);

/* ===== Xuất ảnh ===== */
function exportDims(){const z=sz();let w,h;if(z.u==='cm'){w=z.w/2.54*S.dpi;h=z.h/2.54*S.dpi}else{w=z.w;h=z.h}
  const cap=isIOS?16e6:64e6;let k=1;if(w*h>cap)k=Math.sqrt(cap/(w*h));k=Math.min(k,16000/Math.max(w,h));return{w:Math.round(w*k),h:Math.round(h*k)}}
async function renderBlob(i){
  await document.fonts.ready;const d=exportDims(),c=document.createElement('canvas');c.width=d.w;c.height=d.h;
  try{render(c.getContext('2d'),d.w,d.h,i<0?{slide:S.invite,idx:0}:{slide:S.slides[i],idx:i});
    const b=await new Promise(r=>c.toBlob(r,S.fmt,.93));if(!b)throw new Error('Không tạo được tệp ảnh');return b;
  }finally{c.width=c.height=1}
}
const fname=i=>i<0?`ThiepMoi-HonPhoi.${S.fmt==='image/png'?'png':'jpg'}`:`HonPhoi-${String(i+1).padStart(2,'0')}-${S.slides[i].tpl}.${S.fmt==='image/png'?'png':'jpg'}`;
function exportMenu(){const d=exportDims(),n=S.slides.length;if(S.mode==='invite')return exportOne();
  $('#mbox').innerHTML=`<h3>Xuất ảnh</h3><p>${sz().n} · ${d.w} × ${d.h} px</p>
    <div class="chips" style="margin-bottom:12px"><button class="chip${S.fmt==='image/jpeg'?' on':''}" data-fm="image/jpeg">JPG</button><button class="chip${S.fmt==='image/png'?' on':''}" data-fm="image/png">PNG</button></div>
    <div class="xopts"><button class="xopt" id="x1"><span class="ic">1</span><span><b>Ảnh đang xem</b><small>${tplById(curSlide().tpl).n}</small></span></button>
    <button class="xopt" id="xa"><span class="ic">${n}</span><span><b>Cả bộ ${n} ảnh</b><small>Lưu tất cả vào Ảnh hoặc tải file ZIP</small></span></button>
    <button class="xopt" id="xp2"><span class="ic">▶</span><span><b>Trình chiếu toàn màn hình</b><small>Chiếu cả bộ lên tivi, tự chuyển ảnh</small></span></button></div>
    <p class="note">Mẹo: chép các ảnh vào USB rồi cắm vào tivi, hoặc mở trang này trên máy tính nối tivi và chọn <b>Trình chiếu</b>.</p><button class="bigbtn ghost" id="xc">Đóng</button>`;
  $('#modal').classList.add('show');
  $('#mbox').querySelectorAll('[data-fm]').forEach(b=>b.onclick=()=>{S.fmt=b.dataset.fm;save();exportMenu()});
  $('#x1').onclick=exportOne;$('#xa').onclick=exportAll;$('#xp2').onclick=()=>{$('#modal').classList.remove('show');playStart(S.cur)};$('#xc').onclick=()=>$('#modal').classList.remove('show')}
let urls=[];const freeUrls=()=>{urls.forEach(u=>URL.revokeObjectURL(u));urls=[]};
async function exportOne(){$('#busytxt').textContent='Đang xuất ảnh…';$('#busy').classList.add('show');await new Promise(r=>setTimeout(r,50));
  try{const ix=S.mode==='invite'?-1:S.cur,b=await renderBlob(ix);freeUrls();const u=URL.createObjectURL(b);urls.push(u);const file=new File([b],fname(ix),{type:S.fmt}),share=!!(navigator.canShare&&navigator.canShare({files:[file]}));
    $('#mbox').innerHTML=`<h3>${ix<0?'Thiệp mời':'Ảnh'} đã sẵn sàng ✦</h3><p>${exportDims().w} × ${exportDims().h} px · ${(b.size/1048576).toFixed(1)} MB</p><div class="mprev"><img src="${u}" alt=""></div>
      ${share?'<button class="bigbtn" id="shr">Lưu vào Ảnh / Chia sẻ</button>':''}<a class="bigbtn ${share?'alt':''}" href="${u}" download="${fname(ix)}">Tải file về máy</a><button class="bigbtn ghost" id="cls">Đóng</button>`;
    $('#modal').classList.add('show');
    if(share)$('#shr').onclick=()=>navigator.share({files:[file]}).catch(()=>{});$('#cls').onclick=()=>$('#modal').classList.remove('show')}
  catch(e){console.error('Xuất ảnh thất bại:',e);toast('Không xuất được ảnh — thử lại nhé')}finally{$('#busy').classList.remove('show')}}
function loadZip(){return window.JSZip?Promise.resolve():new Promise((res,rej)=>{const s=document.createElement('script');s.src='https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';s.onload=res;s.onerror=rej;document.head.appendChild(s)})}
async function exportAll(){const n=S.slides.length;
  $('#mbox').innerHTML=`<h3>Đang xuất ${n} ảnh…</h3><p id="xp">0 / ${n}</p><div class="prog"><i id="xbar"></i></div>`;
  const files=[];for(let i=0;i<n;i++){try{const b=await renderBlob(i);files.push(new File([b],fname(i),{type:S.fmt}))}catch(e){}$('#xp').textContent=`${i+1} / ${n}`;$('#xbar').style.width=((i+1)/n*100)+'%';await new Promise(r=>setTimeout(r,10))}
  freeUrls();const prev=files.slice(0,9).map(f=>{const u=URL.createObjectURL(f);urls.push(u);return`<img src="${u}" alt="">`}).join('');const share=!!(navigator.canShare&&navigator.canShare({files}));
  $('#mbox').innerHTML=`<h3>Đã xuất ${files.length} ảnh ✦</h3><p>${(files.reduce((a,f)=>a+f.size,0)/1048576).toFixed(1)} MB</p><div class="multi">${prev}</div>
    ${share?'<button class="bigbtn" id="shr">Lưu tất cả vào Ảnh / Chia sẻ</button>':''}<button class="bigbtn ${share?'alt':''}" id="zip">Tải file ZIP</button><button class="bigbtn ghost" id="cls">Đóng</button>`;
  if(share)$('#shr').onclick=()=>navigator.share({files}).catch(()=>{});
  $('#zip').onclick=async()=>{$('#zip').textContent='Đang nén…';try{await loadZip();const z=new JSZip();files.forEach(f=>z.file(f.name,f));const b=await z.generateAsync({type:'blob'}),u=URL.createObjectURL(b);urls.push(u);
      const a=document.createElement('a');a.href=u;a.download='HonPhoi-slides.zip';document.body.appendChild(a);a.click();a.remove();$('#zip').textContent='Tải lại file ZIP'}
    catch(e){$('#zip').textContent='Tải từng ảnh';$('#zip').onclick=()=>files.forEach((f,i)=>setTimeout(()=>{const u=URL.createObjectURL(f);const a=document.createElement('a');a.href=u;a.download=f.name;a.click()},i*400))}};
  $('#cls').onclick=()=>$('#modal').classList.remove('show')}
$('#btnExport').onclick=exportMenu;

/* ===== Khôi phục mặc định ===== */
function askReset(){$('#mbox').innerHTML=`<h3>Khôi phục mặc định?</h3><p>Bộ slide, nội dung, Lời Chúa, màu, font, khổ màn hình và ảnh đã thêm đều trở về như lần đầu truy cập.</p>
  <button class="bigbtn danger" id="rsY">↺ Khôi phục</button><button class="bigbtn ghost" id="rsN">Huỷ</button>`;$('#modal').classList.add('show');
  $('#rsN').onclick=()=>$('#modal').classList.remove('show');$('#rsY').onclick=()=>{try{localStorage.removeItem(STORE)}catch(e){}location.replace(location.pathname)}}

/* ===== Khởi động ===== */
$('#modal').addEventListener('click',e=>{if(e.target.id==='modal')$('#modal').classList.remove('show')});
$('#szbtn').onclick=()=>openTab('show');
function setAppMode(m){if(S.mode===m)return;S.mode=m;sel=null;save();document.querySelectorAll('.modesw button').forEach(b=>b.classList.toggle('on',b.dataset.m===m));
  buildTabs();$('#strip').innerHTML='';fitStage();renderStrip();openTab(tab)}
document.querySelectorAll('.modesw button').forEach(b=>{b.classList.toggle('on',b.dataset.m===S.mode);b.onclick=()=>setAppMode(b.dataset.m)});
$('#brand').onclick=()=>{$('#mbox').innerHTML=`<h3>PaNIC Thánh Lễ Hôn Phối</h3><p>Tạo ảnh cho thánh lễ hôn phối — tên thánh, họ tên, Lời Chúa, biểu tượng đức tin — để chiếu trên tivi, đăng mạng xã hội, và tạo thiệp mời tham dự thánh lễ.</p>
  <div class="actions"><button class="bigbtn rose" id="bp">▶ Trình chiếu cả bộ ảnh</button><button class="bigbtn alt" data-reset>↺ Khôi phục cài đặt mặc định</button><button class="bigbtn ghost" id="bc">Đóng</button></div>`;$('#modal').classList.add('show');
  $('#bp').onclick=()=>{$('#modal').classList.remove('show');playStart(0)};$('#bc').onclick=()=>$('#modal').classList.remove('show');$('#mbox').querySelector('[data-reset]').onclick=askReset};
let tT=0;function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(tT);tT=setTimeout(()=>t.classList.remove('show'),2200)}
function hideHint(){$('#hint').classList.remove('show')}
const FL=['400 40px "Cormorant Garamond"','500 40px "Cormorant Garamond"','italic 400 40px "Cormorant Garamond"','300 40px "Noto Serif Display"','400 40px "Playfair Display"','italic 400 40px "Playfair Display"',
  '400 40px "Great Vibes"','500 40px "Dancing Script"','300 40px "Montserrat"','500 40px "Montserrat"','400 40px "Lora"','italic 400 40px "Lora"','500 40px "Be Vietnam Pro"','400 40px "Noto Serif"','700 40px "Noto Serif"','italic 400 40px "Noto Serif"','400 40px "Ephesis"'];
Promise.allSettled(FL.map(f=>document.fonts.load(f,'AaĐđẤấỡễ&“”'))).then(()=>{draw();renderStrip();if(tab==='tpl')thumbs()});
if(document.fonts.addEventListener)document.fonts.addEventListener('loadingdone',()=>{draw();renderStrip()});
S.cur=clamp(S.cur,0,S.slides.length-1);
openTab('tpl');fitStage();renderStrip();
if(!S.invite||!S.invite.tpl)S.invite={id:'invite',tpl:'inv_rose',v:0,sym:DEFAULT_SYMBOL,vt:'',vr:''};
if(mob()){$('#hint').classList.add('show');setTimeout(hideHint,5000)}
addEventListener('resize',()=>{if(!gd)sheet.style.setProperty('--dh',sheetH(mob()?sheet.dataset.mode:'full')+'px');syncTabs();$('#strip').innerHTML='';renderStrip()});
