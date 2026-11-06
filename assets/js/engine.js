'use strict';
/* ===== Trạng thái ===== */
const STORE='panic-honphoi-v4';
let uid=1;const newId=()=>'s'+Date.now().toString(36)+(uid++);
const DEFAULT_DECK=SLIDE_TEMPLATE_IDS.map((tpl,i)=>[tpl,0,Object.keys(SYMBOLS)[i%4]]);
function deck(){return DEFAULT_DECK.map(([tpl,v,sym])=>({id:newId(),tpl,v,sym,vt:'',vr:''}))}
const DEF={mode:'slides',isize:'share',invite:{id:'invite',tpl:'inv_rose',v:0,sym:DEFAULT_SYMBOL,vt:'',vr:''},size:'tv169',pal:'ivory',fp:'classic',gap:12,radius:0,tscale:1,demo:true,mock:false,dur:8,fx:'fade',kb:true,fmt:'image/jpeg',dpi:150,texts:{},cur:0,seen:false};
let S=JSON.parse(JSON.stringify(DEF));S.slides=deck();
try{const o=JSON.parse(localStorage.getItem(STORE)||'null');if(o){S={...S,...o,texts:{...(o.texts||{})}};if(!Array.isArray(S.slides)||!S.slides.length)S.slides=deck()}}catch(e){}
// Remove retired catalog entries without resetting personal text or retained slide IDs.
function normalizeCatalogState(state){
 const old=Array.isArray(state.slides)?state.slides:[],active=old[state.cur]?.id;
 let slides=old.filter(sl=>sl&&SLIDE_TEMPLATE_IDS.includes(sl.tpl)).map(sl=>({...sl,id:sl.id||newId(),sym:SYMBOLS[sl.sym]?sl.sym:DEFAULT_SYMBOL}));
 if(!slides.length)slides=deck();
 const invite={...DEF.invite,...(state.invite||{})};
 if(!INVITE_TEMPLATE_IDS.includes(invite.tpl))invite.tpl='inv_rose';
 if(!SYMBOLS[invite.sym])invite.sym=DEFAULT_SYMBOL;
 const selected=slides.findIndex(sl=>sl.id===active),cur=selected>=0?selected:Math.max(0,Math.min(Number.isFinite(state.cur)?state.cur:0,slides.length-1));
 return{...state,slides,invite,cur};
}
S=normalizeCatalogState(S);
try{localStorage.setItem(STORE,JSON.stringify(S))}catch(e){}
const save=()=>{try{localStorage.setItem(STORE,JSON.stringify(S))}catch(e){}};
let photos=[],SLOTS={},sel=null,lastSlots=[];
const isIOS=/iPad|iPhone|iPod/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);

/* ===== Tiện ích ===== */
const $=s=>document.querySelector(s);
const hex=h=>{h=(h||'#000').replace('#','');if(h.length===3)h=[...h].map(c=>c+c).join('');const n=parseInt(h,16);return[n>>16&255,n>>8&255,n&255]};
const rgba=(h,a)=>{const[r,g,b]=hex(h);return`rgba(${r},${g},${b},${a})`};
const mix=(a,b,t)=>{const A=hex(a),B=hex(b);return'#'+A.map((v,i)=>Math.round(v+(B[i]-v)*t).toString(16).padStart(2,'0')).join('')};
const lum=h=>{const[r,g,b]=hex(h);return(.299*r+.587*g+.114*b)/255};
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function rng(seed){let s=seed%2147483647||7;return()=>(s=s*16807%2147483647)/2147483647}
const sz=()=>S.mode==='invite'?(ISIZES[S.isize]||ISIZES.share):(SIZES[S.size]||SIZES.tv169);
const ratio=()=>{const z=sz();return z.h/z.w};
function pal(base){const p={...(base||PALS[S.pal]||PALS.ivory)};p.soft=mix(p.bg,p.text,.06);p.dark=lum(p.bg)<.4;p.gold1=mix(p.accent,'#ffffff',.45);p.gold2=mix(p.accent,'#000000',.18);return p}
function texts(){return{...TEXTS,...S.texts}}
function fam(k){const p=FP[S.fp]||FP.classic;switch(k){case'display':return[p.display,p.dw];case'serif':return[p.serif,400];case'script':return[p.script,p.script==='Dancing Script'?500:400];case'times':return['Noto Serif',400];case'sig':return['Ephesis',400];case'pf':return['Playfair Display',400];case'mont':return['Montserrat',500];case'gv':return['Great Vibes',400];case'cg':return['Cormorant Garamond',500];default:return['Montserrat',500]}}
const slideIndex=sl=>Math.max(0,S.slides.indexOf(sl));
const photoIndex=(sl,i,n,idx=slideIndex(sl))=>(((sl.id===S.invite.id?0:Math.max(0,idx))*3+i)%n+n)%n;
const curSlide=()=>S.mode==='invite'?S.invite:S.slides[clamp(S.cur,0,S.slides.length-1)];
function verseOf(sl){if(sl.v===-1)return{t:sl.vt||'',r:sl.vr||''};return VERSES[sl.v]||VERSES[0]}

/* ===== Ảnh mẫu: đôi uyên ương mờ ảo, nến và ánh sáng nhà thờ ===== */
const NOISE=(()=>{const c=document.createElement('canvas');c.width=c.height=128;const x=c.getContext('2d'),d=x.createImageData(128,128);
  for(let i=0;i<d.data.length;i+=4){const v=Math.random()*255;d.data[i]=d.data[i+1]=d.data[i+2]=v;d.data[i+3]=24}x.putImageData(d,0,0);return c})();
const DEMO_COL=[['#cdc6a6','#efe2bd','#3e4b2f','#fff4d6','#25311c'],['#e7ad86','#f7dcb6','#7d8b93','#fff1d4','#56636b'],['#ebe6dd','#f7f3ed','#ddd5c8','#ffffff','#cbbfae'],
  ['#e9d1ca','#f6e8e1','#bea197','#fff7f1','#a5847a'],['#5a3d22','#c08a4a','#2a1a0c','#ffe2a8','#3a2410'],['#b8c5cd','#e3e9ea','#5f7174','#ffffff','#4a5b5e'],
  ['#a98d6c','#dcc6a3','#4b3b2b','#fff0d6','#3a2c20'],['#c3ccb6','#e8ecdf','#6c7e59','#fbfff2','#4f6040']];
let DEMO=null;
function demos(){if(DEMO)return DEMO;const r=rng(77);DEMO=DEMO_COL.map((c,k)=>makeDemo(c,k,r));return DEMO}
function makeDemo(c,k,rnd){
  const land=k%2===1,w=land?900:660,h=land?620:880,cv=document.createElement('canvas');cv.width=w;cv.height=h;const x=cv.getContext('2d');
  const church=k===4,studio=k===2||k===3,gy=h*(studio?.8:.7);
  let gr=x.createLinearGradient(0,0,0,h);gr.addColorStop(0,c[0]);gr.addColorStop(.62,c[1]);gr.addColorStop(1,c[2]);x.fillStyle=gr;x.fillRect(0,0,w,h);
  if(church){ // vòm & tia sáng
    x.fillStyle=rgba('#ffe7b8',.16);for(let i=0;i<5;i++){x.beginPath();const sx=w*(.3+i*.1);x.moveTo(sx,0);x.lineTo(sx+w*.04,0);x.lineTo(sx+w*.25,h);x.lineTo(sx+w*.12,h);x.closePath();x.fill()}
    x.strokeStyle=rgba('#2a1a0c',.35);x.lineWidth=w*.03;for(let i=0;i<3;i++){const ax=w*(.2+i*.3),aw=w*.2;x.beginPath();x.moveTo(ax,h);x.lineTo(ax,h*.35);x.arc(ax+aw/2,h*.35,aw/2,Math.PI,0);x.lineTo(ax+aw,h);x.stroke()}}
  const sx=w*(.25+rnd()*.5),sy=h*(.22+rnd()*.2);gr=x.createRadialGradient(sx,sy,0,sx,sy,w*.75);gr.addColorStop(0,rgba(c[3],.95));gr.addColorStop(.35,rgba(c[3],.35));gr.addColorStop(1,rgba(c[3],0));x.fillStyle=gr;x.fillRect(0,0,w,h);
  if(!studio){for(let i=0;i<9;i++){const bx=rnd()*w,by=h*(.15+rnd()*.5),br=w*(.12+rnd()*.22),g2=x.createRadialGradient(bx,by,0,bx,by,br);g2.addColorStop(0,rgba(c[4],.45));g2.addColorStop(1,rgba(c[4],0));x.fillStyle=g2;x.fillRect(0,0,w,h)}}
  for(let i=0;i<26;i++){x.fillStyle=rgba(church?'#ffd98a':'#ffffff',.06+rnd()*.14);x.beginPath();x.arc(rnd()*w,rnd()*h*.7,4+rnd()*w*.03,0,7);x.fill()}
  gr=x.createLinearGradient(0,gy-h*.05,0,h);gr.addColorStop(0,rgba(c[2],0));gr.addColorStop(1,rgba(c[2],.9));x.fillStyle=gr;x.fillRect(0,gy-h*.05,w,h);
  const sc=8,fc=document.createElement('canvas');fc.width=Math.ceil(w/sc);fc.height=Math.ceil(h/sc);const y=fc.getContext('2d');y.scale(1/sc,1/sc);
  const cx=w*(.4+rnd()*.2),s=h*(studio?.6:.5),G=gy+s*.02,gx=cx-s*.065;
  y.fillStyle='#23211f';y.beginPath();y.ellipse(gx,G-s*.92,s*.042,s*.052,0,0,7);y.fill();
  y.beginPath();y.moveTo(gx-s*.085,G-s*.80);y.quadraticCurveTo(gx-s*.06,G-s*.86,gx,G-s*.855);y.quadraticCurveTo(gx+s*.06,G-s*.86,gx+s*.085,G-s*.80);y.lineTo(gx+s*.07,G-s*.46);y.lineTo(gx+s*.05,G);y.lineTo(gx-s*.05,G);y.lineTo(gx-s*.07,G-s*.46);y.closePath();y.fill();
  const bx=cx+s*.055;y.fillStyle='#3a2c22';y.beginPath();y.ellipse(bx,G-s*.845,s*.038,s*.048,0,0,7);y.fill();
  y.fillStyle=rgba('#ffffff',.38);y.beginPath();y.moveTo(bx+s*.01,G-s*.87);y.quadraticCurveTo(bx+s*.2,G-s*.5,bx+s*.26,G);y.lineTo(bx+s*.05,G);y.closePath();y.fill();
  y.fillStyle='#f7f2ea';y.beginPath();y.moveTo(bx-s*.042,G-s*.79);y.quadraticCurveTo(bx,G-s*.81,bx+s*.042,G-s*.79);y.lineTo(bx+s*.03,G-s*.56);y.quadraticCurveTo(bx+s*.16,G-s*.12,bx+s*.21,G);y.lineTo(bx-s*.15,G);y.quadraticCurveTo(bx-s*.09,G-s*.2,bx-s*.03,G-s*.56);y.closePath();y.fill();
  y.fillStyle='#fbfbf6';for(let j=0;j<5;j++){y.beginPath();y.arc(bx-s*.075+Math.cos(j*1.3)*s*.028,G-s*.6+Math.sin(j*1.3)*s*.022,s*.026,0,7);y.fill()}
  x.save();x.globalAlpha=.9;x.imageSmoothingQuality='high';x.drawImage(fc,0,0,w,h);x.restore();
  x.fillStyle=x.createPattern(NOISE,'repeat');x.fillRect(0,0,w,h);
  gr=x.createRadialGradient(w/2,h/2,Math.min(w,h)*.35,w/2,h/2,Math.max(w,h)*.75);gr.addColorStop(0,'rgba(0,0,0,0)');gr.addColorStop(1,'rgba(0,0,0,.22)');x.fillStyle=gr;x.fillRect(0,0,w,h);
  return cv;
}

/* ===== Nguồn ảnh của từng khung ===== */
function slotsOf(sl){return SLOTS[sl.id]||(SLOTS[sl.id]={})}
function srcFor(sl,i,idx){const st=slotsOf(sl)[i];
  if(st&&st.pid){const ph=photos.find(q=>q.id===st.pid);if(ph)return ph.src}
  if(photos.length)return photos[photoIndex(sl,i,photos.length,idx)].src;
  if(S.demo){const d=demos();return d[photoIndex(sl,i,d.length,idx)]}return null}

/* ===== Vẽ ===== */
function rr(ctx,x,y,w,h,r){r=Math.min(r,w/2,h/2);ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath()}
function shapePath(ctx,x,y,w,h,shape,r){ctx.beginPath();
  if(shape==='arch'){const a=w/2;ctx.moveTo(x,y+h);ctx.lineTo(x,y+a);ctx.arc(x+a,y+a,a,Math.PI,0);ctx.lineTo(x+w,y+h);ctx.closePath()}
  else if(shape==='gothic'){const a=Math.min(w*.866,h);ctx.moveTo(x,y+h);ctx.lineTo(x,y+a);ctx.arc(x+w,y+a,w,Math.PI,Math.PI*4/3);ctx.arc(x,y+a,w,Math.PI*5/3,0);ctx.lineTo(x+w,y+h);ctx.closePath()}
  else if(shape==='circle')ctx.ellipse(x+w/2,y+h/2,w/2,h/2,0,0,Math.PI*2);
  else if(r>0)rr(ctx,x,y,w,h,r);else ctx.rect(x,y,w,h)}
function coverGeom(e,src,st){const iw=src.width,ih=src.height,z=st.z||1,s=Math.max(e.w/iw,e.h/ih)*z,dw=iw*s,dh=ih*s,ex=dw-e.w,ey=dh-e.h;
  return{dw,dh,ex,ey,dx:-ex*(.5-(st.ox||0)/2),dy:-ey*(.5-(st.oy||0)/2)}}
function goldStroke(ctx,P,x,y,w,h){const g=ctx.createLinearGradient(x,y,x+w,y+h);g.addColorStop(0,P.gold1);g.addColorStop(.5,P.accent);g.addColorStop(1,P.gold2);return g}

function drawSlot(ctx,e,i,P,o){
  const st=slotsOf(o.slide)[i]||{},src=srcFor(o.slide,i,o.idx);
  ctx.save();ctx.translate(e.x+e.w/2,e.y+e.h/2);if(e.rot)ctx.rotate(e.rot);ctx.translate(-e.w/2,-e.h/2);
  const r=e.bleed||['arch','gothic','circle'].includes(e.shape)?0:(e.r??S.radius);
  if(e.ring){ctx.save();shapePath(ctx,-e.ring,-e.ring,e.w+2*e.ring,e.h+2*e.ring,e.shape,r?r+e.ring:0);ctx.fillStyle=e.ringColor==='bg'?P.bg:goldStroke(ctx,P,0,0,e.w,e.h);ctx.shadowColor='rgba(0,0,0,.18)';ctx.shadowBlur=20;ctx.fill();ctx.restore()}
  shapePath(ctx,0,0,e.w,e.h,e.shape,r);ctx.save();ctx.clip();
  if(src){const G=coverGeom(e,src,st);ctx.drawImage(src,G.dx,G.dy,G.dw,G.dh)}
  else{ctx.fillStyle=P.soft;ctx.fillRect(0,0,e.w,e.h);
    if(o.preview){const s=Math.min(e.w,e.h)*.14,cx=e.w/2,cy=e.h/2-s*.3;ctx.strokeStyle=rgba(P.text,.35);ctx.lineWidth=s*.08;ctx.beginPath();ctx.moveTo(cx-s/2,cy);ctx.lineTo(cx+s/2,cy);ctx.moveTo(cx,cy-s/2);ctx.lineTo(cx,cy+s/2);ctx.stroke();
      ctx.fillStyle=rgba(P.text,.45);ctx.font=`500 ${Math.max(9,s*.3)}px "Be Vietnam Pro"`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('Chạm để thêm ảnh',cx,cy+s*.95)}}
  ctx.restore();
  if(e.frame){shapePath(ctx,0,0,e.w,e.h,e.shape,r);ctx.lineWidth=e.frame;ctx.strokeStyle=goldStroke(ctx,P,0,0,e.w,e.h);ctx.stroke();
    if(e.frame2){const d=e.frame2;shapePath(ctx,-d,-d,e.w+2*d,e.h+2*d,e.shape,r?r+d:0);ctx.lineWidth=e.frame*.4;ctx.stroke()}}
  if(o.preview&&o.sel===i){shapePath(ctx,0,0,e.w,e.h,e.shape,r);ctx.lineWidth=3/o.sc;ctx.strokeStyle='#e5788c';ctx.setLineDash([10/o.sc,6/o.sc]);ctx.stroke();ctx.setLineDash([]);ctx.fillStyle='rgba(229,120,140,.14)';ctx.fill()}
  ctx.restore();
}

function wrap(s,maxW,meas){const out=[];s.split('\n').forEach(par=>{const ws=par.split(/\s+/);let cur='';ws.forEach(w=>{const t=cur?cur+' '+w:w;if(meas(t)>maxW&&cur){out.push(cur);cur=w}else cur=t});out.push(cur)});return out}
function colorOf(c,P){return c==='accent'?P.accent:c==='bg'?P.bg:c==='soft'?P.soft:c&&c[0]==='#'?c:P.text}
function drawText(ctx,e,P){
  let s=e.text;if(s==null||s==='')return;s=String(s).normalize('NFC');if(e.upper)s=s.toLocaleUpperCase('vi');
  const[family,w0]=fam(e.font);let size=e.size*(e.noScale?1:S.tscale);
  const setF=()=>ctx.font=`${e.italic?'italic ':''}${e.weight||w0} ${size}px "${family}"`;setF();
  const meas=t=>ctx.measureText(t).width+(e.ls||0)*size*Math.max(0,[...t].length-1);
  let lines=e.maxW?wrap(s,e.maxW,meas):s.split('\n');
  if(e.fit){const mw=Math.max(...lines.map(meas));if(mw>e.fit){size*=e.fit/mw;setF();if(e.maxW)lines=wrap(s,e.maxW,meas)}}
  if(e.maxH){for(let i=0;i<4&&lines.length*size*(e.lh||1.2)>e.maxH;i++){size*=e.maxH/(lines.length*size*(e.lh||1.2));setF();lines=e.maxW?wrap(s,e.maxW,meas):s.split('\n')}}
  if(e.maxLines&&lines.length>e.maxLines){lines=lines.slice(0,e.maxLines);lines[lines.length-1]=lines[lines.length-1].replace(/[\s,.;—-]*$/,'')+'…'}
  const ls=(e.ls||0)*size,lh=size*(e.lh||1.2),tot=lines.length*lh;
  ctx.save();ctx.translate(e.x,e.y);if(e.rot)ctx.rotate(e.rot);ctx.globalAlpha=e.alpha??1;ctx.textBaseline='middle';ctx.textAlign='left';
  const y0=e.valign==='top'?lh/2:-tot/2+lh/2;
  if(e.shadow){ctx.shadowColor=e.shadow===true?'rgba(0,0,0,.45)':e.shadow;ctx.shadowBlur=size*.3}
  ctx.fillStyle=e.color==='gold'?goldStroke(ctx,P,-size*4,-size,size*8,size*2):colorOf(e.color,P);
  lines.forEach((ln,i)=>{const w=meas(ln);let x=e.align==='center'?-w/2:e.align==='right'?-w:0;const y=y0+i*lh;
    if(!ls)ctx.fillText(ln,x,y);else for(const ch of ln){ctx.fillText(ch,x,y);x+=ctx.measureText(ch).width+ls}});
  ctx.restore();
}

/* ===== Biểu tượng đức tin (vẽ vector) ===== */
function drawSymbol(ctx,kind,x,y,s,col,P){
 ctx.save();ctx.translate(x,y);
 const fill=col==='white'?'#ffffff':goldStroke(ctx,P,-s/2,-s/2,s,s);
 drawReferenceSymbol(ctx,SYMBOLS[kind]?kind:DEFAULT_SYMBOL,0,0,s*.96,fill);
 ctx.restore();
}

const WD=['Chủ Nhật','Thứ Hai','Thứ Ba','Thứ Tư','Thứ Năm','Thứ Sáu','Thứ Bảy'];
function parseDate(s){const n=String(s||'').match(/\d+/g);if(!n||n.length<3)return null;const d=new Date(+n[2],+n[1]-1,+n[0]);return isNaN(d)?null:d}
function weekday(s){const d=parseDate(s);return d?WD[d.getDay()]:''}
function dotDate(s){const n=String(s||'').match(/\d+/g);return n&&n.length>=3?`${n[0].padStart(2,'0')}.${n[1].padStart(2,'0')}.${n[2]}`:s}
function drawRich(ctx,e,P){const segs=e.segs.map(g=>({...g,text:String(g.text||'').normalize('NFC')}));let size=e.size;
  const fontOf=g=>{const[fa,w]=fam(g.font||'times');return`${g.italic?'italic ':''}${g.weight||w} ${size*(g.k||1)}px "${fa}"`};
  const meas=()=>segs.reduce((a,g)=>{ctx.font=fontOf(g);const t=g.upper?g.text.toLocaleUpperCase('vi'):g.text;return a+ctx.measureText(t).width+(e.ls||0)*size*[...t].length},0);
  let w=meas();if(e.fit&&w>e.fit){size*=e.fit/w;w=meas()}
  let x=e.align==='left'?e.x:e.align==='right'?e.x-w:e.x-w/2;ctx.save();ctx.textBaseline='alphabetic';ctx.textAlign='left';
  segs.forEach(g=>{ctx.font=fontOf(g);ctx.fillStyle=colorOf(g.color||e.color,P);const t=g.upper?g.text.toLocaleUpperCase('vi'):g.text;
    if(e.ls){for(const ch of t){ctx.fillText(ch,x,e.y+size*.35);x+=ctx.measureText(ch).width+e.ls*size}}else{ctx.fillText(t,x,e.y+size*.35);x+=ctx.measureText(t).width}});ctx.restore()}
function drawDecor(ctx,e,P,W,H){
  ctx.save();
  switch(e.t){
    case'rich':drawRich(ctx,e,P);break;
    case'rframe':{ctx.strokeStyle=colorOf(e.color,P);ctx.lineWidth=e.lw||2;ctx.globalAlpha=e.alpha??1;ctx.beginPath();rr(ctx,e.x,e.y,e.w,e.h,e.r||0);ctx.stroke();break}
    case'blob':{const gr=ctx.createRadialGradient(e.x,e.y,0,e.x,e.y,e.r);gr.addColorStop(0,rgba(e.color,e.alpha||.5));gr.addColorStop(1,rgba(e.color,0));ctx.fillStyle=gr;ctx.fillRect(e.x-e.r,e.y-e.r,e.r*2,e.r*2);break}
    case'paper':{ctx.globalAlpha=e.alpha||.5;ctx.fillStyle=ctx.createPattern(NOISE,'repeat');ctx.fillRect(0,0,W,H);break}
    case'sym':drawSymbol(ctx,e.kind,e.x,e.y,e.s,e.color,P);break;
    case'div':{const w=e.w,g=goldStroke(ctx,P,e.x-w/2,e.y,w,1);ctx.strokeStyle=e.color==='white'?'#fff':g;ctx.fillStyle=ctx.strokeStyle;ctx.lineWidth=1.6;
      ctx.beginPath();ctx.moveTo(e.x-w/2,e.y);ctx.lineTo(e.x-10,e.y);ctx.moveTo(e.x+10,e.y);ctx.lineTo(e.x+w/2,e.y);ctx.stroke();ctx.beginPath();ctx.moveTo(e.x,e.y-6);ctx.lineTo(e.x+6,e.y);ctx.lineTo(e.x,e.y+6);ctx.lineTo(e.x-6,e.y);ctx.closePath();ctx.fill();break}
    case'line':ctx.strokeStyle=colorOf(e.color,P);ctx.globalAlpha=e.alpha??1;ctx.lineWidth=e.lw||1.5;if(e.dash)ctx.setLineDash(e.dash);ctx.beginPath();ctx.moveTo(e.x1,e.y1);ctx.lineTo(e.x2,e.y2);ctx.stroke();break;
    case'fade':{const hor=e.dir==='right'||e.dir==='left',gr=hor?ctx.createLinearGradient(e.x,0,e.x+e.w,0):ctx.createLinearGradient(0,e.y,0,e.y+e.h),c=colorOf(e.color||'bg',P),a=rgba(c,0),b=rgba(c,e.alpha??1);
      if(e.dir==='down'||e.dir==='right'){gr.addColorStop(0,a);gr.addColorStop(.85,b);gr.addColorStop(1,b)}else{gr.addColorStop(0,b);gr.addColorStop(.15,b);gr.addColorStop(1,a)}ctx.fillStyle=gr;ctx.fillRect(e.x,e.y,e.w,e.h);break}
    case'shade':{const gr=ctx.createLinearGradient(0,e.y,0,e.y+e.h),a=e.alpha??.55;if(e.dir==='down'){gr.addColorStop(0,`rgba(0,0,0,${a})`);gr.addColorStop(1,'rgba(0,0,0,0)')}else if(e.dir==='up'){gr.addColorStop(0,'rgba(0,0,0,0)');gr.addColorStop(1,`rgba(0,0,0,${a})`)}else{gr.addColorStop(0,`rgba(0,0,0,${a})`);gr.addColorStop(1,`rgba(0,0,0,${a})`)}ctx.fillStyle=gr;ctx.fillRect(e.x,e.y,e.w,e.h);break}
    case'vignette':{const gr=ctx.createRadialGradient(W/2,H/2,Math.min(W,H)*.25,W/2,H/2,Math.max(W,H)*.75);gr.addColorStop(0,'rgba(0,0,0,0)');gr.addColorStop(1,`rgba(0,0,0,${e.alpha||.55})`);ctx.fillStyle=gr;ctx.fillRect(0,0,W,H);break}
    case'glow':{const gr=ctx.createRadialGradient(e.x,e.y,0,e.x,e.y,e.r);gr.addColorStop(0,rgba(e.color==='accent'?P.accent:'#ffffff',e.alpha||.25));gr.addColorStop(1,'rgba(255,255,255,0)');ctx.fillStyle=gr;ctx.fillRect(0,0,W,H);break}
    case'rays':{ctx.globalAlpha=e.alpha||.12;ctx.fillStyle=e.color==='accent'?P.accent:'#fff4d6';for(let i=0;i<e.n;i++){const a=Math.PI/2+(i-(e.n-1)/2)*e.spread;ctx.beginPath();ctx.moveTo(e.x,e.y);ctx.lineTo(e.x+Math.cos(a-.035)*e.len,e.y+Math.sin(a-.035)*e.len);ctx.lineTo(e.x+Math.cos(a+.035)*e.len,e.y+Math.sin(a+.035)*e.len);ctx.closePath();ctx.fill()}break}
    case'frame':{const g=goldStroke(ctx,P,e.x,e.y,e.w,e.h);ctx.strokeStyle=g;ctx.lineWidth=e.lw||2;ctx.strokeRect(e.x,e.y,e.w,e.h);const d=e.gap||10;ctx.lineWidth=(e.lw||2)*.45;ctx.strokeRect(e.x+d,e.y+d,e.w-2*d,e.h-2*d);
      const c=e.corner||26;ctx.fillStyle=g;for(const[cx,cy]of[[e.x,e.y],[e.x+e.w,e.y],[e.x,e.y+e.h],[e.x+e.w,e.y+e.h]]){ctx.beginPath();ctx.moveTo(cx,cy-c*.35);ctx.lineTo(cx+c*.35,cy);ctx.lineTo(cx,cy+c*.35);ctx.lineTo(cx-c*.35,cy);ctx.closePath();ctx.fill()}break}
    case'rect':{ctx.globalAlpha=e.alpha??1;ctx.fillStyle=colorOf(e.fill||'soft',P);ctx.beginPath();if(e.r)rr(ctx,e.x,e.y,e.w,e.h,e.r);else ctx.rect(e.x,e.y,e.w,e.h);ctx.fill();break}
    case'gframe':{shapePath(ctx,e.x,e.y,e.w,e.h,e.shape,0);ctx.strokeStyle=goldStroke(ctx,P,e.x,e.y,e.w,e.h);ctx.lineWidth=e.lw||4;ctx.stroke();break}
  }
  ctx.restore();
}

/* tên thánh (chữ in hoa giãn cách) + họ tên (chữ viết tay) — luôn đủ cả hai người */
function names(f,o={}){const z=o.size||60,c=o.color,sc=o.saintColor||c||'accent',amp=o.amp!==false;
  const pair=(st,nm)=>[{text:st,font:'display',upper:1,ls:.28,size:z*.4,color:sc,pad:2,shadow:o.shadow},{text:nm,font:'script',size:z,color:c,lh:1.15,shadow:o.shadow}];
  return[...pair(f.gs,f.gn),...(amp?[{text:'&',font:'script',size:z*.62,color:o.ampColor||sc,pad:0}]:[{gap:z*.3}]),...pair(f.bs,f.bn)]}
const est=(t,size,maxW)=>Math.max(1,Math.ceil(String(t||'').length*size*.47/maxW));
/* xếp dọc các dòng chữ/biểu tượng cho vừa vùng — tự co theo khổ */
function stack(e,x,y0,y1,items,maxW,align='center',kmax=1.7,anchor='center'){
  const hOf=k=>items.map(it=>it.h||(it.sym?it.s*1.25:it.div?28:it.gap?it.gap:it.size*(it.lh||1.3)*(it.wrap?est(it.text,it.size*k,maxW):(it.lines||1))+(it.pad||8)));
  let k=1;for(let n=0;n<3;n++){const tot=hOf(k).reduce((a,b)=>a+b,0);k=clamp(k*Math.pow((y1-y0)/(tot*k),n?.5:1),.35,kmax)}
  const hs=hOf(k).map(h=>h*k),tot=hs.reduce((a,b)=>a+b,0);if(tot>y1-y0){const r=(y1-y0)/tot;k*=r;hs.forEach((h,i)=>hs[i]=h*r)}
  const th=hs.reduce((a,b)=>a+b,0);let y=anchor==='bottom'?y1-th:anchor==='top'?y0:y0+((y1-y0)-th)/2;
  items.forEach((it,i)=>{const h=hs[i],cy=y+h/2;
    if(it.sym)e.push({t:'sym',kind:it.sym,x:align==='left'?x+it.s*k*.5:align==='right'?x-it.s*k*.5:x,y:cy,s:it.s*k,color:it.color||'gold'});
    else if(it.div)e.push({t:'div',x:align==='left'?x+60:align==='right'?x-60:x,y:cy,w:Math.min(maxW*.6,(it.w||220)*Math.min(k,1.3)),color:it.color});
    else if(!it.gap&&it.text)e.push({t:'text',align,x,y:cy,maxW:it.wrap?maxW:undefined,fit:maxW,...it,size:it.size*k});
    y+=h});
}

/* ===== Dựng & render một slide ===== */
const tplById=id=>TPL.find(t=>t.id===id)||INVT.find(t=>t.id===id)||TPL[0];
function layout(W,H,sl){const tpl=tplById(sl.tpl),land=W>H*1.05,m=Math.min(W,H)*.06,g=S.gap,f=texts(),v=verseOf(sl);
  return tpl.b({W,H,m,g,f,v,land,sym:SYMBOLS[sl.sym]?sl.sym:DEFAULT_SYMBOL,P:pal(tpl.pal)})}
function render(ctx,pxW,pxH,o={}){
  const sl=o.slide||curSlide(),idx=o.idx??slideIndex(sl),W=1000,H=1000*pxH/pxW,sc=pxW/W*(o.dpr||1),T0=tplById(sl.tpl),P=pal(T0.pal);
  ctx.setTransform(sc,0,0,sc,0,0);ctx.fillStyle=P.bg;ctx.fillRect(0,0,W,H);
  const els=layout(W,H,sl);let si=0;const slots=[];
  for(const e of els){if(e.t==='img'){drawSlot(ctx,e,si,P,{...o,sc,slide:sl,idx});slots.push({...e,_i:si});si++}
    else if(e.t==='text')drawText(ctx,e,P);else drawDecor(ctx,e,P,W,H)}
  return slots;
}
