'use strict';
/* ===== Mẫu ảnh cho thánh lễ hôn phối =====
   Ảnh là chính, chữ gọn. Mỗi mẫu luôn có tên thánh + họ tên của cả hai người, tự bố cục cho khổ ngang lẫn dọc. */
const I=(x,y,w,h,o={})=>({t:'img',x,y,w,h,...o});
const W1='#ffffff';
const ref=(v,o={})=>({text:v.r,font:'serif',italic:1,size:o.size||24,ls:.04,color:o.color||'accent'});
const quote=(v,size,w,o={})=>{const q='“'+v.t+'”';return{text:q,font:'serif',italic:1,size,wrap:1,lines:est(q,size,w),lh:1.3,...o}};
/* ngày (chữ có chân, giãn nhẹ) + giáo xứ (nghiêng) */
const when=(f,o={})=>{const z=o.size||26;return[{text:f.date,font:'display',size:z,ls:.16,color:o.color,shadow:o.shadow,pad:0},{text:f.parish,font:'serif',italic:1,size:z*.95,color:o.color,shadow:o.shadow}]};
const whenLine=(f,o={})=>({text:`${f.date}  —  ${f.parish}`,font:'serif',italic:1,size:o.size||26,ls:.04,color:o.color,shadow:o.shadow});
const initial=s=>{const w=String(s||'').trim().split(/\s+/);return(w[w.length-1]||'')[0]||''};
const onPhoto=(o={})=>({color:W1,saintColor:W1,ampColor:W1,shadow:true,...o});
function mosaic5(e,x,y,w,h,g){
  if(w>h){const bw=w*.5-g/2,cw=(w-bw-g*2)/2,ch=(h-g)/2;e.push(I(x,y,bw,h));for(let k=0;k<4;k++)e.push(I(x+bw+g+(k%2)*(cw+g),y+Math.floor(k/2)*(ch+g),cw,ch))}
  else{const bh=h*.5-g/2,cw=(w-g)/2,ch=(h-bh-g*2)/2;e.push(I(x,y,w,bh));for(let k=0;k<4;k++)e.push(I(x+(k%2)*(cw+g),y+bh+g+Math.floor(k/2)*(ch+g),cw,ch))}
}

const TPL=[
{id:'waiting',n:'Chờ thánh lễ',d:'Ảnh nền · giờ bắt đầu',b({W,H,m,f,land,sym}){
  const e=[I(0,0,W,H,{bleed:1}),{t:'shade',x:0,y:land?H*.15:H*.35,w:W,h:land?H*.85:H*.65,dir:'up',alpha:.78},{t:'shade',x:0,y:0,w:W,h:H*.25,dir:'down',alpha:.35}],w=land?W*.72:W*.86;
  stack(e,W/2,land?m*.5:H*.4,H-m*.7,[{sym,s:54,color:'white'},{text:f.wait,font:'display',italic:1,size:26,color:W1,shadow:true},{text:f.time,font:'display',size:land?96:120,color:W1,shadow:true,lh:1.05},{div:1,color:'white'},
    ...names(f,onPhoto({size:land?58:52})),{gap:4},whenLine(f,{color:W1,shadow:true,size:24})],w,'center',1,'bottom');
  return e}},
{id:'welcome',n:'Chào mừng',d:'Ảnh lớn khung mảnh',b({W,H,m,f,land,sym}){
  const e=[];let x,y0,y1,pw;
  if(land){e.push(I(m*.5,m*.5,W*.58,H-m,{r:4,frame:2.4,frame2:9}));x=W*.6+(W*.4-m*.5)/2;pw=W*.34;y0=m*.6;y1=H-m*.6}
  else{const ph=H*.58;e.push(I(W*.06,m*.8,W*.88,ph,{r:6,frame:2.4,frame2:10}));x=W/2;pw=W*.86;y0=m*.8+ph+24;y1=H-m*.8}
  stack(e,x,y0,y1,[{sym,s:56},...names(f,{size:land?60:54}),{div:1},...when(f,{size:24})],pw);
  return e}},
{id:'couple',n:'Đôi ảnh tròn',d:'Mỗi người một ảnh',b({W,H,m,f,land,sym}){
  const e=[],one=(cx,y0,y1,d,st,nm,w)=>{e.push(I(cx-d/2,y0,d,d,{shape:'circle',ring:7}));
    stack(e,cx,y0+d+6,y1,[{text:st,font:'display',upper:1,ls:.28,size:22,color:'accent'},{text:nm,font:'script',size:52,lh:1.15}],w)};
  if(land){const d=Math.min(H*.62,W*.33),top=m*.7,bl=H-m*.5;one(W*.27,top,bl-36,d,f.gs,f.gn,W*.42);one(W*.73,top,bl-36,d,f.bs,f.bn,W*.42);
    e.push({t:'sym',kind:sym,x:W/2,y:top+d/2,s:96,color:'gold'});e.push({...whenLine(f,{size:24}),t:'text',x:W/2,y:bl,align:'center',fit:W*.8});return e}
  const mid=150,rowH=(H-2*m-mid)/2,d=Math.min(W*.7,rowH*.72);
  one(W/2,m,m+rowH,d,f.gs,f.gn,W*.86);
  stack(e,W/2,m+rowH,m+rowH+mid,[{sym,s:80},whenLine(f,{size:24})],W*.86);
  one(W/2,H-m-rowH,H-m,d,f.bs,f.bn,W*.86);
  return e}},
{id:'verse',n:'Lời Chúa',d:'Lời Chúa phía trên hoặc bên cạnh ảnh',b({W,H,m,f,v,land,sym}){
  const e=[];
  if(land){
    const pw=W*.55,w=W*.37,x=W*.775;
    e.push(I(0,0,pw,H,{bleed:1}));
    stack(e,x,m*.8,H-m*.8,[{sym,s:48},quote(v,34,w,{maxH:H*.33}),ref(v,{size:21}),{div:1},...names(f,{size:42})],w);
  }else{
    const top=H*.30,w=W*.84;
    e.push(I(0,top,W,H-top,{bleed:1}),{t:'shade',x:0,y:H*.66,w:W,h:H*.34,dir:'up',alpha:.82});
    stack(e,W/2,m*.6,top-m*.6,[{sym,s:46},quote(v,42,w,{maxH:top*.58}),ref(v,{size:22})],w);
    stack(e,W/2,H*.70,H-m*.7,names(f,onPhoto({size:48})),w,'center',1,'bottom');
  }
  return e}},
{id:'panel',n:'Khung kính giữa ảnh',d:'Ảnh nền, thẻ chữ trong mờ',b({W,H,m,f,land,sym}){
  const e=[I(0,0,W,H,{bleed:1})],pw=land?W*.42:W*.78,ph=land?H*.66:H*.4,px=(W-pw)/2,py=land?(H-ph)/2:H-m*1.2-ph;
  e.push({t:'rect',x:px,y:py,w:pw,h:ph,fill:'bg',alpha:.86,r:6},{t:'rframe',x:px+10,y:py+10,w:pw-20,h:ph-20,r:3,lw:1.2,color:'accent',alpha:.8});
  stack(e,W/2,py+26,py+ph-26,[{sym,s:50},...names(f,{size:50}),{div:1,w:120},...when(f,{size:22})],pw*.86);
  return e}},
{id:'collage',n:'Kỷ niệm',d:'Năm ảnh + tên',b({W,H,m,g,f,v,land,sym}){
  const e=[];let cx,y0,y1,w;
  if(land){const aw=W*.7;mosaic5(e,m*.5,m*.5,aw,H-m,g);cx=aw+m*.5+(W-aw-m*.5)/2;w=W-aw-m*1.6;y0=m;y1=H-m}
  else{const ah=H*.68;mosaic5(e,m*.5,m*.5,W-m,ah,g);cx=W/2;w=W*.86;y0=ah+m*.5+14;y1=H-m*.8}
  stack(e,cx,y0,y1,[{sym,s:48},...names(f,{size:land?42:46}),{div:1,w:120},ref(v,{size:20})],w);
  return e}},
{id:'frame',n:'Khung viền trắng',d:'Ảnh toàn khung, viền kép',b({W,H,m,f,land,sym}){
  const o=m*.45,e=[I(0,0,W,H,{bleed:1}),{t:'shade',x:0,y:H*.45,w:W,h:H*.55,dir:'up',alpha:.75},{t:'rframe',x:o,y:o,w:W-2*o,h:H-2*o,lw:2,color:'#ffffff',alpha:.9},{t:'rframe',x:o+12,y:o+12,w:W-2*o-24,h:H-2*o-24,lw:.9,color:'#ffffff',alpha:.75}];
  stack(e,W/2,land?m:H*.5,H-m*1.1,[{sym,s:46,color:'white'},...names(f,onPhoto({size:land?54:52})),{gap:2},whenLine(f,{color:W1,shadow:true,size:22})],land?W*.8:W*.84,'center',1,'bottom');
  return e}},
{id:'duo',n:'Đôi ảnh dọc',d:'Hai ảnh song song',b({W,H,m,g,f,land,sym}){
  const e=[];
  if(land){const pw=W*.3,ph=H-m*1.2,y=m*.6;e.push(I(m*.6,y,pw,ph,{r:4,frame:2.4,frame2:8}));e.push(I(W-m*.6-pw,y,pw,ph,{r:4,frame:2.4,frame2:8}));
    stack(e,W/2,m,H-m,[{sym,s:84},...names(f,{size:50}),{div:1},...when(f,{size:22})],W-2*(m*.6+pw)-60);return e}
  const top=m*.7,ph=H*.62,pw=(W-2*m*.7-g*2)/2;e.push(I(m*.7,top,pw,ph,{r:4,frame:2.4,frame2:8}));e.push(I(W-m*.7-pw,top,pw,ph,{r:4,frame:2.4,frame2:8}));
  e.push({t:'sym',kind:sym,x:W/2,y:top+ph+56,s:78,color:'gold'});
  stack(e,W/2,top+ph+100,H-m*.8,[...names(f,{size:52}),{div:1},whenLine(f,{size:24})],W*.86);
  return e}},
{id:'grid',n:'Sáu khung',d:'Lưới ảnh + dải tên',b({W,H,m,g,f,land,sym}){
  const e=[],o=m*.5,cols=land?3:2,rows=land?2:3,bandH=land?H*.26:H*.2,gw=(W-2*o-(cols-1)*g)/cols,gh=(H-2*o-bandH-(rows-1)*g)/rows;
  const by=land?o+gh+g/2:o+gh*2+g*1.5;let k=0;
  for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){let y=o+r*(gh+g);if(land?r>=1:r>=2)y+=bandH;e.push(I(o+c*(gw+g),y,gw,gh));k++}
  e.push({t:'rect',x:0,y:by,w:W,h:bandH,fill:'bg'});
  if(land){stack(e,W*.27,by+8,by+bandH-8,[{text:f.gs,font:'display',upper:1,ls:.28,size:20,color:'accent'},{text:f.gn,font:'script',size:50}],W*.4);
    e.push({t:'sym',kind:sym,x:W/2,y:by+bandH/2,s:70,color:'gold'});
    stack(e,W*.73,by+8,by+bandH-8,[{text:f.bs,font:'display',upper:1,ls:.28,size:20,color:'accent'},{text:f.bn,font:'script',size:50}],W*.4)}
  else stack(e,W/2,by+10,by+bandH-10,[...names(f,{size:44}),whenLine(f,{size:20})],W*.86);
  return e}},
{id:'monogram',n:'Chữ lồng',d:'Ảnh + chữ cái đầu hai tên',b({W,H,m,f,v,land,sym}){
  const a=initial(f.gn).toLocaleUpperCase('vi'),b=initial(f.bn).toLocaleUpperCase('vi'),e=[];
  const box=(cx,cy,sz)=>{e.push({t:'text',text:a,x:cx-sz*.56,y:cy,font:'display',size:sz,color:'accent',align:'center',noScale:1});e.push({t:'text',text:b,x:cx+sz*.56,y:cy,font:'display',size:sz,color:'accent',align:'center',noScale:1});
    e.push({t:'sym',kind:sym,x:cx,y:cy+sz*.04,s:sz*.5,color:'gold'})};
  if(land){e.push(I(0,0,W*.56,H,{bleed:1}));box(W*.78,H*.28,H*.26);stack(e,W*.78,H*.46,H-m*.8,[...names(f,{size:46}),{div:1},whenLine(f,{size:20})],W*.38);return e}
  e.push(I(0,0,W,H*.55,{bleed:1}));e.push({t:'rect',x:W/2-W*.22,y:H*.55-W*.13,w:W*.44,h:W*.26,fill:'bg',r:W*.13});box(W/2,H*.55,W*.17);
  stack(e,W/2,H*.55+W*.16,H-m*.8,[...names(f,{size:58}),{div:1},whenLine(f,{size:24})],W*.86);
  return e}},
{id:'covenant',n:'Giao ước',d:'Lời Chúa + ảnh nửa khung',b({W,H,m,g,f,v,land,sym}){
  const e=[];
  if(land){const pw=W*.52;e.push(I(W-pw,0,pw,H,{bleed:1}));e.push({t:'fade',x:W-pw,y:0,w:pw*.25,h:H,dir:'left'});const w=W-pw-m*1.8;
    stack(e,m*.9+w/2,m,H-m,[{sym,s:50},quote(v,40,w,{color:'text'}),ref(v,{size:22}),{div:1},...names(f,{size:44})],w);return e}
  const top=H*.44;
  e.push(I(0,top,W,H-top,{bleed:1}));
  stack(e,W/2,m*.7,top-m*.7,[{sym,s:48},quote(v,40,W*.82,{maxH:top*.38}),ref(v,{size:22}),{div:1},...names(f,{size:44})],W*.84);
  return e}},
{id:'sacrament',n:'Bí tích Hôn phối',d:'Trang trọng như thiệp, có ảnh',b({W,H,m,f,v,land,sym}){
  const o=m*.5,e=[{t:'frame',x:o,y:o,w:W-2*o,h:H-2*o,lw:1.8,gap:11,corner:24}];
  if(land){const pw=W*.4,ph=H-o*2-60;e.push(I(o+30,o+30,pw,ph,{r:3}));const cx=o+30+pw+(W-o-30-pw-o-30)/2,w=W-pw-o*2-120;
    stack(e,cx,o+30,H-o-30,[{text:f.title,font:'display',size:22,upper:1,ls:.32,color:'accent'},{sym,s:64},...names(f,{size:52}),{div:1},{text:`${weekday(f.date)}, ${f.date}  ·  ${f.time}`,font:'display',size:22,ls:.1},{text:f.parish,font:'serif',italic:1,size:22}],w);return e}
  const ph=H*.5;e.push(I(o+28,o+28,W-2*o-56,ph,{r:3}));
  stack(e,W/2,o+28+ph+20,H-o-28,[{text:f.title,font:'display',size:24,upper:1,ls:.32,color:'accent'},{sym,s:66},...names(f,{size:56}),{div:1},{text:`${weekday(f.date)}, ${f.date}  ·  ${f.time}`,font:'display',size:24,ls:.1},{text:f.parish,font:'serif',italic:1,size:24}],W*.8);
  return e}},
{id:'poster',n:'Ảnh lớn',d:'Một ảnh toàn khung',b({W,H,m,f,land,sym}){
  const e=[I(0,0,W,H,{bleed:1}),{t:'shade',x:0,y:H*.5,w:W,h:H*.5,dir:'up',alpha:.78}];
  stack(e,W/2,land?m*.5:H*.55,H-m*.6,[...names(f,onPhoto({size:land?56:56})),whenLine(f,{color:W1,shadow:true,size:22})],land?W*.8:W*.9,'center',1,'bottom');
  return e}},
{id:'emblem',n:'Biểu tượng',d:'Không cần ảnh',b({W,H,m,f,v,land,sym}){
  const e=[{t:'glow',x:W/2,y:H*.42,r:Math.max(W,H)*.6,color:'accent',alpha:.16},{t:'frame',x:m*.55,y:m*.55,w:W-1.1*m,h:H-1.1*m,lw:2.4,gap:12,corner:30}],w=land?W*.7:W*.78;
  stack(e,W/2,m*1.3,H-m*1.3,[{text:f.title,font:'display',size:26,upper:1,ls:.35,color:'accent'},{gap:12},{sym,s:land?140:210},{gap:12},...names(f,{size:land?66:56}),{div:1},
    ...when(f,{size:26}),{gap:8},quote(v,24,w,{alpha:.85}),ref(v,{size:20})],w);
  return e}},
{id:'thanks',n:'Cảm tạ',d:'Kết thúc thánh lễ',b({W,H,m,f,land,sym}){
  const e=[],items=w=>[{sym,s:50},{text:f.thanks,font:'script',size:84,color:'accent'},{text:f.thanks2,font:'serif',italic:1,size:25,wrap:1,lines:est(f.thanks2,25,w),lh:1.35},{div:1},...names(f,{size:land?40:36})];
  if(land){e.push(I(0,0,W*.6,H,{bleed:1}));e.push({t:'fade',x:W*.42,y:0,w:W*.18+1,h:H,dir:'right'});const w=W*.36;stack(e,W*.6+(W*.4-m*.4)/2,m*.8,H-m*.8,items(w),w)}
  else{e.push(I(0,0,W,H*.56,{bleed:1}));e.push({t:'fade',x:0,y:H*.38,w:W,h:H*.18+1,dir:'down'});const w=W*.84;stack(e,W/2,H*.5,H-m*.8,items(w),w)}
  return e}},
];

/* ===== Thiệp báo hỷ: một thứ tự nội dung, năm phong cách ===== */
const INV_VERSE={t:'Sự gì Thiên Chúa đã kết hợp, loài người không được phân ly.',r:'Mt 19,6'};
// Group an event into weekday | civil date | hour, with measured cells.
function clockWords(value){const m=String(value||'').trim().match(/^(\d{1,2})[:h.](\d{2})$/i);return m?`${Number(m[1])} GIỜ ${m[2]}`:String(value||'')}
function eventBand(e,W,cy,date,time,{k=1,h=30,color='accent',home=false,prefix=false}={}){
  const left=W*.09,right=W*.91;
  for(const yy of [cy-h,cy+h])e.push({t:'line',x1:left,y1:yy,x2:right,y2:yy,lw:.8*k,color,alpha:.65});
  for(const x of [W*.36,W*.64])e.push({t:'line',x1:x,y1:cy-h*.43,x2:x,y2:cy+h*.43,lw:.8*k,color,alpha:.55});
  const cells=[[weekday(date),W*.225,W*.23,20,home?700:500],[dotDate(date),W*.5,W*.255,34,700],[(prefix?'VÀO LÚC ':'')+clockWords(time),W*.775,W*.23,prefix?18:20,home?700:500]];
  for(const [text,x,fit,size,weight]of cells)e.push({t:'text',text,x,y:cy,align:'center',font:'pf',upper:1,size:size*k,weight,fit,color,noScale:1,event:home?'home':'mass'});
}
const saintCase=value=>String(value||'').normalize('NFC').toLocaleLowerCase('vi').replace(/(^|[\s-])([^\s-])/gu,(_,a,b)=>a+b.toLocaleUpperCase('vi'));
// Five separate compositions share only their content contract and rendering helpers.
function invitation({W,H,f,sym},C){
  const u=H/1414,k=Math.min(W/1000,u),Y=n=>n*u,e=[],photo=!!C.photo;
  const text=(value,yy,size=25,o={})=>e.push({t:'text',text:value,x:W/2,y:Y(yy),align:'center',font:C.body||'cg',size:size*k,noScale:1,upper:1,fit:W*.84,color:C.text,...o});
  const line=(x1,yy,x2,alpha=.5)=>e.push({t:'line',x1:W*x1,y1:Y(yy),x2:W*x2,y2:Y(yy),lw:k,color:C.accent,alpha});
  e.push({t:'rect',x:0,y:0,w:W,h:H,fill:C.bg},{t:'paper',alpha:.1});
  const leaf=(x,yy,size,flip=1)=>e.push({t:'botanical',x:W*x,y:Y(yy),s:size*k,flip,color:C.accent,alpha:C.id==='wine'?.34:.22});
  if(C.id==='cream'){
    e.push({t:'frame',x:W*.045,y:Y(35),w:W*.91,h:H-Y(70),lw:1.1*k,gap:9*k,corner:12*k});
    leaf(.11,150,190);leaf(.89,1260,190,-1);
    line(.35,173,.65);line(.35,966,.65);
  }else if(C.id==='rose'){
    e.push({t:'blob',x:0,y:Y(800),r:W*.65,color:C.accent,alpha:.12},{t:'blob',x:W,y:Y(1360),r:W*.7,color:C.accent,alpha:.14});
    leaf(.08,1020,260);leaf(.94,1040,260,-1);
    e.push({t:'rect',x:W*.1,y:Y(633),w:W*.8,h:Y(75),r:37*k,fill:'#f6e3e7'});
  }else if(C.id==='gold'){
    e.push({t:'frame',x:W*.04,y:Y(30),w:W*.92,h:H-Y(60),lw:1.4*k,gap:12*k,corner:24*k});
    e.push({t:'gframe',x:W*.5-Y(118),y:Y(139),w:Y(236),h:Y(236),shape:'circle',lw:1.3*k});
    leaf(.2,310,180);leaf(.8,310,180,-1);
    for(const cx of [.27,.73])e.push({t:'rframe',x:W*(cx-.205),y:Y(391),w:W*.41,h:Y(196),r:4*k,lw:.7*k,color:C.accent,alpha:.32});
  }else if(C.id==='arch'){
    e.push({t:'rect',x:0,y:0,w:W*.07,h:H,fill:C.accent,alpha:.10},{t:'rect',x:W*.93,y:0,w:W*.07,h:H,fill:C.accent,alpha:.10});
    leaf(.06,770,280);leaf(.94,770,280,-1);
    e.push({t:'rframe',x:W*.10,y:Y(28),w:W*.8,h:H-Y(56),r:W*.38,lw:1.2*k,color:C.accent,alpha:.30});
    line(.28,612,.72);
  }else{
    e.push({t:'rframe',x:W*.035,y:Y(30),w:W*.93,h:H-Y(60),r:2*k,lw:.8*k,color:C.accent,alpha:.6});
    leaf(.12,490,330);leaf(.9,920,330,-1);
    e.push({t:'glow',x:W*.5,y:Y(760),r:W*.7,color:'accent',alpha:.08});
    line(.12,185,.88);line(.12,972,.88);
  }
  if(photo){
    const {py,ph,pw}=C;
    const w=C.id==='gold'?Y(ph):W*pw,x=(W-w)/2;
    e.push(I(x,Y(py),w,Y(ph),{shape:C.id==='gold'?'circle':C.id==='arch'?'arch':undefined,r:C.id==='rose'?18*k:0}));
    if(C.id==='rose')e.push({t:'fade',x,y:Y(py+ph-28),w,h:Y(28),dir:'down',color:C.bg});
  }
  const q=C.q,ft=C.ft;
  text('“'+INV_VERSE.t+'”',q,C.id==='wine'?34:30,{font:'cg',italic:1,upper:0,color:C.accent,maxW:W*(C.id==='arch'?.71:.78),maxH:Y(68),lh:1.25,role:'scripture'});
  text(INV_VERSE.r,q+45,17,{color:C.accent});
  const family=(cx,sa,na,sb,nb,addr)=>{
    text('Ông Bà',ft,22,{x:cx,font:'cg',upper:0,color:C.accent,italic:1,fit:W*.38,role:'family-label'});
    for(const [st,n,dy]of [[sa,na,32],[sb,nb,94]]){
      text(saintCase(st),ft+dy,26,{x:cx,font:'gv',upper:0,color:C.accent,fit:W*.37,role:'parent-saint'});
      text(n,ft+dy+28,21,{x:cx,font:'times',fit:W*.37,role:'parent-name'});
    }
    text(addr,ft+162,18,{x:cx,upper:0,fit:W*.36,maxW:W*.36,maxH:Y(36),lh:1.15,role:'family-address'});
  };
  family(W*.27,f.gfs,f.gfn,f.gms,f.gmn,f.ga);family(W*.73,f.bfs,f.bfn,f.bms,f.bmn,f.ba);
  const notice=C.notice;
  text('Trân trọng báo tin',notice,17,{font:'mont',ls:.12});
  text('Lễ thành hôn',notice+33,C.id==='wine'?42:33,{font:'pf',weight:700,ls:C.id==='rose'?.12:.06,color:C.accent,role:'announcement'});
  text('của con chúng tôi',notice+64,17,{font:'mont',ls:.10});
  const person=(saint,name,rank,yy,cx)=>{
    const ax=W*cx;
    text(saint,yy,21,{x:ax,font:'pf',ls:.10,color:C.accent,role:'saint'});
    text(name,yy+C.nameGap,C.nameSize,{x:ax,font:C.name,italic:['pf','nd'].includes(C.name)?1:0,fit:W*C.nameWidth,color:C.text,ls:C.name==='gv'?.015:0,role:'couple-name'});
    text(rank,yy+C.rankGap,20,{x:ax,font:'cg',upper:0,italic:1,role:'family-rank'});
  };
  person(f.gs,f.gn,f.grank,C.groom,C.gx);
  e.push({t:'sym',kind:sym==='none'?'crossring':sym,x:W*C.sx,y:Y(C.symbol),s:C.symbolSize*k,color:'gold'});
  person(f.bs,f.bn,f.brank,C.bride,C.bx);
  const church=C.church;
  text('Thánh lễ hôn phối được cử hành tại',church,19,{font:'times'});
  text('Thánh Đường '+f.parish,church+34,26,{font:'pf',weight:700,color:C.accent,role:'church'});
  text(f.churchAddress,church+66,19,{upper:0,maxW:W*.78,maxH:Y(32),lh:1.15,role:'church-address'});
  const event=(date,time,cy,home=false)=>{
    if(C.id==='rose')e.push({t:'rect',x:W*.09,y:Y(cy-25),w:W*.82,h:Y(50),fill:'#f6e3e7',r:25*k});
    const from=e.length;
    eventBand(e,W,Y(cy),date,time,{k,h:Y(C.id==='gold'?32:25),color:C.accent,home,prefix:home});
    const band=e.slice(from);
    if(C.id==='rose'||C.id==='arch')for(const a of band)if(a.t==='line')a.alpha=0;
    if(C.id==='gold'){
      for(const a of band)if(a.t==='text'){
        if(a.text===dotDate(date)){a.y=Y(cy+12);a.size=37*k;a.fit=W*.57;}
        else{a.y=Y(cy-19);a.x=a.x<W/2?W*.32:W*.68;a.fit=W*.30;a.size=16*k;}
      }
    }
    if(C.id==='wine')for(const a of band)if(a.t==='text'&&a.text===dotDate(date))a.size=39*k;
  };
  event(f.date,f.time,C.mass);
  text('Hôn lễ được cử hành tại tư gia nam',C.homeLabel,20,{font:'times'});
  event(f.homeDate,f.homeTime,C.home,true);
  const lunar=String(f.homeLunar??f.lunar??'').replace(/^\s*\(?Nhằm ngày\s*/i,'').replace(/\)\s*$/,'');
  text(lunar?'(Nhằm ngày '+lunar+')':'',C.lunar,21,{upper:0,italic:1,role:'lunar-date'});
  return e;
}
const INV_STYLES={
  cream:{id:'cream',bg:'#fffaf0',text:'#443326',accent:'#997444',body:'times',name:'gv',q:108,ft:235,notice:464,groom:585,symbol:747,bride:808,church:980,mass:1115,homeLabel:1192,home:1240,lunar:1313,gx:.5,bx:.5,sx:.5,nameGap:54,rankGap:98,nameSize:64,nameWidth:.83,symbolSize:63},
  rose:{id:'rose',photo:1,bg:'#fff9fa',text:'#713b4c',accent:'#a54a65',name:'ds',q:85,py:152,ph:216,pw:.88,ft:419,notice:647,groom:756,symbol:890,bride:937,church:1061,mass:1179,homeLabel:1235,home:1280,lunar:1335,gx:.5,bx:.5,sx:.5,nameGap:44,rankGap:79,nameSize:57,nameWidth:.83,symbolSize:40},
  gold:{id:'gold',photo:1,bg:'#fffdf7',text:'#493927',accent:'#a08248',name:'pf',q:80,py:151,ph:212,pw:.22,ft:417,notice:641,groom:749,symbol:884,bride:930,church:1055,mass:1182,homeLabel:1237,home:1290,lunar:1345,gx:.43,bx:.57,sx:.5,nameGap:45,rankGap:80,nameSize:56,nameWidth:.72,symbolSize:42},
  arch:{id:'arch',photo:1,bg:'#f0f5f7',text:'#2c4c5e',accent:'#608398',name:'nd',py:43,ph:240,pw:.43,q:333,ft:432,notice:657,groom:758,symbol:887,bride:934,church:1061,mass:1179,homeLabel:1237,home:1282,lunar:1336,gx:.5,bx:.5,sx:.5,nameGap:44,rankGap:78,nameSize:52,nameWidth:.72,symbolSize:40},
  wine:{id:'wine',bg:'#4d182b',text:'#fff3e1',accent:'#dfbf89',name:'gv',q:110,ft:245,notice:475,groom:602,symbol:764,bride:826,church:994,mass:1126,homeLabel:1200,home:1250,lunar:1325,gx:.44,bx:.56,sx:.5,nameGap:54,rankGap:99,nameSize:67,nameWidth:.80,symbolSize:56}
};
const INVT=[
{id:'inv_cream',n:'Ấn tín cổ điển',d:'Không ảnh · thư pháp, khung kép, nhành ô-liu',style:'cream'},
{id:'inv_rose',n:'Dải lụa hồng',d:'Có ảnh · Lời Chúa trên ảnh ngang, dải lịch mềm',style:'rose'},
{id:'inv_gold',n:'Huy hiệu vàng',d:'Có ảnh · huy hiệu tròn, tên lệch nhịp, lịch tầng',style:'gold'},
{id:'inv_arch',n:'Vòm thiên thanh',d:'Có ảnh · vòm đứng, nền xanh, nét chữ thanh',style:'arch'},
{id:'inv_wine',n:'Dạ khúc giao ước',d:'Không ảnh · đỏ vang đậm, ánh vàng, tên so le',style:'wine'},
].map(t=>{const C=INV_STYLES[t.style];return{...t,pal:{bg:C.bg,text:C.text,accent:C.accent},b:ctx=>invitation(ctx,C)}});

/* The liturgical heading and event footer are shared by every slide.
   Reserve their space before composing photos; no text is painted over faces. */
for(const template of TPL){
  const compose=template.b;
  template.b=ctx=>{
    const {W,H,f,v,land}=ctx,header=H*(land?.235:.21),footer=H*.14,bodyH=H-header-footer;
    let raw;
    if(['verse','covenant','thanks'].includes(template.id)){
      raw=[];const m=Math.min(W,bodyH)*.06,isThanks=template.id==='thanks';
      const items=[{sym:ctx.sym,s:54},...(isThanks?[{text:f.thanks,font:'script',size:65,color:'accent'}, {text:f.thanks2,font:'serif',size:23,italic:1,wrap:1,lh:1.3}]:[]),{div:1},...names(f,{size:land?56:49})];
      if(land){
        const right=template.id==='covenant',px=right?W*.47:0,pw=W*.53,cx=right?W*.23:W*.77;
        raw.push(I(px,0,pw,bodyH,{bleed:1}),{t:'fade',x:right?px:px+pw-W*.1,y:0,w:W*.1,h:bodyH,dir:right?'left':'right'});
        stack(raw,cx,m,bodyH-m,items,W*.39);
      }else{
        const photoH=bodyH*(isThanks?.53:.60),py=isThanks?bodyH-photoH:0;
        raw.push(I(0,py,W,photoH,{bleed:1}));
        raw.push({t:'fade',x:0,y:isThanks?py:photoH-bodyH*.08,w:W,h:bodyH*.08,dir:isThanks?'up':'down'});
        stack(raw,W/2,isThanks?m:photoH,isThanks?py-m:bodyH-m,items,W*.84);
      }
    }else raw=compose({...ctx,H:bodyH,m:Math.min(W,bodyH)*.06});
    const redundant=new Set([f.title,f.date,f.parish,v.r,'“'+v.t+'”',`${f.date}  —  ${f.parish}`,`${weekday(f.date)}, ${f.date}  ·  ${f.time}`]);
    const e=raw.filter(a=>a.t!=='text'||!redundant.has(a.text));
    for(const a of e){if(a.y!==undefined)a.y+=header;if(a.y1!==undefined)a.y1+=header;if(a.y2!==undefined)a.y2+=header;}
    // Fade full-bleed photos into the surrounding paper, retaining editable slots.
    if(e.some(a=>a.t==='img'&&Math.abs(a.y-header)<1&&a.w>W*.48)){
      const fade=Math.min(H*.035,24);
      for(const a of e.filter(a=>a.t==='img'&&Math.abs(a.y-header)<1&&a.w>W*.48))
        e.push({t:'fade',x:a.x,y:a.y,w:a.w,h:fade,dir:'up'},{t:'fade',x:a.x,y:a.y+a.h-fade,w:a.w,h:fade,dir:'down'});
    }
    const stagger=['verse','covenant','sacrament','thanks'].includes(template.id);
    const z=Math.min(W,H),titleSize=z*(land?.042:.036),qSize=z*(land?.032:.029),w=W*(land?(stagger?.56:.78):.84);
    e.push({t:'text',text:'THÁNH LỄ HÔN PHỐI',x:W/2,y:H*.045,align:'center',font:'display',size:titleSize,ls:.13,color:'accent',fit:W*.88,noScale:1});
    e.push({t:'text',text:'“'+v.t+'”',x:W/2,y:header*.53,align:'center',font:'serif',italic:1,size:qSize,color:'text',maxW:w,fit:w,maxH:header*.43,lh:1.24,lineShift:stagger?W*.014:0,noScale:1});
    e.push({t:'text',text:v.r,x:W/2,y:header*.88,align:'center',font:'serif',size:z*.021,color:'accent',noScale:1});
    e.push({t:'text',text:f.parish,x:W/2,y:H-footer*.77,align:'center',font:'pf',size:z*.031,weight:700,fit:W*.87,color:'accent',noScale:1});
    eventBand(e,W,H-footer*.31,f.date,f.time,{k:z/950,h:footer*.23});
    for(const a of e)if(a.t==='text'&&a.text!=='“'+v.t+'”'){a.upper=1;if([f.gn,f.bn].includes(a.text))a.font='ds';}
    return e;
  };
}
