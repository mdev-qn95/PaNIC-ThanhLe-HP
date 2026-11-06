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
  else{const ah=H*.62,top=m+54;stack(e,W/2,m*.2,top-8,[ref(v,{size:20})],W*.84);mosaic5(e,m*.5,top,W-m,ah,g);cx=W/2;w=W*.86;y0=ah+top+14;y1=H-m*.8}
  stack(e,cx,y0,y1,[{sym,s:48},...names(f,{size:land?42:46}),{div:1,w:120},...(land?[ref(v,{size:20})]:[])],w);
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
  else{const top=H*.50;e.push(I(0,top,W,H-top,{bleed:1}));const w=W*.84;stack(e,W/2,m*.7,top-m*.7,items(w),w)}
  return e}},
];

/* ===== Thiệp mời tham dự thánh lễ hôn phối — 5 bố cục khác nhau ===== */
const splitAddr=a=>{const p=String(a||'').split(/\s+-\s+/);return[(p[0]||'').trim(),p.slice(1).join(' - ')]};
function invKit(W,H){const U=H/1414,X=W/1000,fs=k=>k*Math.min(U,X),y=k=>k*U,e=[];
  const T=(text,x,yy,o={})=>e.push({t:'text',text,x,y:yy,align:'center',font:'times',noScale:1,fit:W*.86,...o,size:fs(o.size||26)});
  const R=(segs,x,yy,size,o={})=>e.push({t:'rich',segs,x,y:yy,size:fs(size),align:'center',fit:W*.42,...o});
  const L=(x1,yy,x2,o={})=>e.push({t:'line',x1,y1:yy,x2,y2:yy,lw:o.lw||1.4,color:o.color,alpha:o.alpha??1,dash:o.dash});
  return{e,U,X,fs,y,T,R,L}}

/* Gia đình hai bên: giữ đủ tên thánh, họ tên cha mẹ và hai dòng địa chỉ. */
function invFamilies(K,W,f,top,C){
  const {T,R,y}=K;
  const one=(cx,label,sa,na,sb,nb,addr)=>{
    T(label,cx,y(top),{font:'mont',size:15,ls:.2,upper:1,color:C.accent,fit:W*.4});
    const parent=(saint,name,yy)=>R([{text:saint+' ',font:'cg',italic:1},{text:name,font:'times',weight:400}],cx,y(yy),25,{color:C.text,fit:W*.4});
    parent(sa,na,top+37);parent(sb,nb,top+73);
    const [first,last]=splitAddr(addr);
    T(first,cx,y(top+112),{font:'cg',size:21,color:C.mute,fit:W*.4});
    if(last)T(last,cx,y(top+140),{font:'cg',size:20,color:C.mute,fit:W*.4});
  };
  one(W*.27,'Nhà trai',f.gfs,f.gfn,f.gms,f.gmn,f.ga);
  one(W*.73,'Nhà gái',f.bfs,f.bfn,f.bms,f.bmn,f.ba);
}
function invVerse(K,W,v,top,C){
  const {T,y,fs}=K;
  T(`“${v.t}”`,W/2,y(top),{font:'cg',italic:1,size:25,color:C.mute,maxW:W*.8,maxH:fs(74),lh:1.25,fit:W*.8});
  T(v.r,W/2,y(top+59),{font:'cg',size:19,color:C.accent,ls:.06});
}
/* Mỗi khối lịch luôn mang tên sự kiện; thiệp mời cả hai dùng hai cột độc lập. */
function invEvents(K,W,f,top,height,C){
 const {T,y,fs}=K,events=invitationEvents(f),two=events.length===2,accent=C.accent||C.rose||C.gold,mute=C.mute||C.soft||C.text;
 events.forEach((event,i)=>{
  const x=two?W*(i?.73:.27):W/2,w=two?W*.4:W*.82,at=k=>y(top+height*k),meta={eventId:event.id,scope:'event',fit:w};
  T(event.title,x,at(.055),{...meta,font:'mont',size:two?16:18,upper:1,ls:.07,color:accent});
  T(event.venue,x,at(.235),{...meta,font:'pf',size:two?23:29,color:C.text});
  if(event.address)T(event.address,x,at(.40),{...meta,font:'times',size:two?16:19,color:mute,maxW:w,maxH:y(height*.14),lh:1.25});
  T(dotDate(event.date),x,at(.595),{...meta,font:'pf',size:two?30:36,color:accent});
  T([event.time,weekday(event.date)].filter(Boolean).join(' · '),x,at(.77),{...meta,font:'mont',size:two?18:22,color:C.text});
  if(event.lunar)T(event.lunar,x,at(.93),{...meta,font:'times',italic:1,size:two?15:18,color:mute,maxW:w,maxH:y(height*.11),lh:1.2});
 });
}

/* 1 · Giấy ngà: chữ serif chủ đạo, dấu ấn đức tin và nhịp chữ cân đối; không có ảnh. */
function invCream({W,H,f,v,sym}){
  const K=invKit(W,H),{e,T,L,y,fs}=K,C={text:'#302c28',accent:'#8a643b',mute:'#51473d'};
  e.push({t:'rect',x:0,y:0,w:W,h:H,fill:'#fffaf1'},
    {t:'rframe',x:W*.045,y:y(35),w:W*.91,h:H-y(70),r:fs(3),lw:fs(1.2),color:'#b49a75'},
    {t:'sym',kind:sym,x:W/2,y:y(100),s:fs(70),color:'gold'});
  T(invitePurpose().title,W/2,y(176),{font:'mont',size:22,upper:1,ls:.15,color:C.accent});
  T(f.inv1,W/2,y(230),{font:'times',italic:1,size:26,color:C.mute});
  T(f.inv2,W/2,y(271),{font:'mont',size:17,upper:1,ls:.06,color:C.text});
  const person=(saint,name,rank,yy)=>{
    T(saint,W/2,y(yy),{font:'mont',size:18,upper:1,ls:.16,color:C.accent});
    T(name,W/2,y(yy+56),{font:'pf',size:54,color:C.text,fit:W*.82});
    T(rank,W/2,y(yy+101),{font:'times',italic:1,size:23,color:C.mute});
  };
  person(f.gs,f.gn,f.grank,330);
  T('&',W/2,y(478),{font:'pf',italic:1,size:37,color:C.accent});
  person(f.bs,f.bn,f.brank,533);
  L(W*.18,y(680),W*.82,{color:'#b49a75',lw:fs(1)});
  invEvents(K,W,f,711,249,C);
  L(W*.18,y(979),W*.82,{color:'#b49a75',lw:fs(1)});
  invFamilies(K,W,f,1017,C);
  T(`“${v.t}”`,W/2,y(1221),{font:'times',italic:1,size:22,color:C.mute,maxW:W*.8,maxH:fs(64),lh:1.3});
  T(v.r,W/2,y(1277),{font:'times',size:18,color:C.accent});
  T('Trân trọng kính mời',W/2,y(1341),{font:'pf',italic:1,size:30,color:C.accent});
  return e}

/* 2 · Trắng hồng hiện đại — ảnh lớn trên đầu, dải ngày tháng kẻ chỉ, chữ không chân + chữ bay */
function invRose({W,H,f,v,sym}){
  const K=invKit(W,H),{e,T,R,L,y,fs}=K,C={text:'#3a1f27',rose:'#b3243f',soft:'#d9768a'};
  e.push({t:'rect',x:0,y:0,w:W,h:H,fill:'#fffafb'},{t:'blob',x:W*.05,y:H*.62,r:W*.55,color:'#f6b6c3',alpha:.4},{t:'blob',x:W*.98,y:H*.9,r:W*.6,color:'#f4a9b8',alpha:.4},{t:'paper',alpha:.2});
  const px=W*.07,pw=W*.86,ph=y(390),py=y(150);e.push(I(px,py,pw,ph,{r:W*.03}));e.push({t:'rframe',x:px+fs(12),y:py+fs(12),w:pw-fs(24),h:ph-fs(24),r:W*.02,lw:fs(1.6),color:'#ffffff',alpha:.85});
  const cy=py+ph;e.push({t:'rect',x:W/2-fs(52),y:cy-fs(52),w:fs(104),h:fs(104),r:fs(52),fill:'#fffafb'});e.push({t:'sym',kind:sym,x:W/2,y:cy,s:fs(70),color:'gold'});
  invVerse(K,W,v,45,{mute:'#8a6670',accent:C.rose});
  const fam=(cx,lab,a,b,c,d,addr)=>{T(lab,cx,y(660),{font:'mont',size:15,upper:1,ls:.3,color:C.rose,fit:W*.4});
    R([{text:a+' ',font:'cg',italic:1},{text:b,font:'pf'}],cx,y(694),24,{color:C.text,fit:W*.42});R([{text:c+' ',font:'cg',italic:1},{text:d,font:'pf'}],cx,y(724),24,{color:C.text,fit:W*.42});
    T(String(addr||'').replace(/\s+-\s+/,', '),cx,y(754),{font:'cg',italic:1,size:19,color:'#8a6670',fit:W*.42})};
  fam(W*.27,'Nhà trai',f.gfs,f.gfn,f.gms,f.gmn,f.ga);fam(W*.73,'Nhà gái',f.bfs,f.bfn,f.bms,f.bmn,f.ba);
  e.push({t:'line',x1:W/2,y1:y(650),x2:W/2,y2:y(765),lw:fs(1),color:C.rose,alpha:.35});
  T(`${f.inv1} ${f.inv2}`,W/2,y(805),{font:'mont',size:15,upper:1,ls:.26,color:C.text,fit:W*.86});
  const person=(s,n,r,yy)=>{T(s,W/2,yy,{font:'mont',size:16,upper:1,ls:.36,color:C.rose});T(n,W/2,yy+y(50),{font:'gv',size:68,color:C.rose,fit:W*.84});T(r,W/2,yy+y(90),{font:'cg',italic:1,size:21,color:'#8a6670'})};
  person(f.gs,f.gn,f.grank,y(835));T('&',W/2,y(972),{font:'gv',size:36,color:C.soft});person(f.bs,f.bn,f.brank,y(1000));
  invEvents(K,W,f,1150,224,{...C,accent:C.rose,mute:'#8a6670'});
  return e}

/* 3 · Trắng viền vàng sang trọng — ảnh tròn giữa thiệp, khối lịch ngày lớn, chữ Playfair + Cormorant */
function invGold({W,H,f,v,sym}){
  const K=invKit(W,H),{e,T,R,L,y,fs}=K,C={text:'#2a2118',gold:'#a8823f',mute:'#7a6a55'};
  e.push({t:'rect',x:0,y:0,w:W,h:H,fill:'#fffdf8'},{t:'glow',x:W/2,y:H*.3,r:W*.9,color:'accent',alpha:.08},{t:'frame',x:W*.04,y:H*.03,w:W*.92,h:H*.94,lw:2.4,gap:14,corner:30});
  T(`“${v.t}”`,W/2,y(105),{font:'cg',italic:1,size:28,color:C.mute,fit:W*.8});T(v.r,W/2,y(140),{font:'cg',italic:1,size:20,color:C.gold});
  const fam=(cx,lab,a,b,c,d,addr)=>{T(lab,cx,y(195),{font:'cg',size:20,upper:1,ls:.3,color:C.gold,fit:W*.38});
    T(a,cx,y(232),{font:'cg',italic:1,size:22,color:C.mute});T(b,cx,y(262),{font:'pf',size:22,upper:1,ls:.06,color:C.text,fit:W*.38});
    T(c,cx,y(298),{font:'cg',italic:1,size:22,color:C.mute});T(d,cx,y(328),{font:'pf',size:22,upper:1,ls:.06,color:C.text,fit:W*.38});
    T(String(addr||'').replace(/\s+-\s+/,', '),cx,y(366),{font:'cg',italic:1,size:19,color:C.mute,fit:W*.38})};
  fam(W*.28,'Nhà trai',f.gfs,f.gfn,f.gms,f.gmn,f.ga);fam(W*.72,'Nhà gái',f.bfs,f.bfn,f.bms,f.bmn,f.ba);
  e.push({t:'line',x1:W/2,y1:y(190),x2:W/2,y2:y(250),lw:fs(1),color:C.gold,alpha:.6},{t:'line',x1:W/2,y1:y(318),x2:W/2,y2:y(378),lw:fs(1),color:C.gold,alpha:.6});
  e.push({t:'sym',kind:sym,x:W/2,y:y(284),s:fs(52),color:'gold'});
  const d=fs(300),cy=y(570);e.push(I(W/2-d/2,cy-d/2,d,d,{shape:'circle',ring:fs(8)}));e.push({t:'gframe',x:W/2-d/2-fs(20),y:cy-d/2-fs(20),w:d+fs(40),h:d+fs(40),shape:'circle',lw:fs(1.2)});
  T(f.inv1,W/2,y(770),{font:'cg',italic:1,size:30,color:C.mute});T(f.inv2,W/2,y(796),{font:'pf',size:19,upper:1,ls:.22,color:C.text});
  const person=(s,n,r,yy)=>{T(s,W/2,yy,{font:'gv',size:42,color:C.gold});T(n,W/2,yy+y(54),{font:'pf',size:42,upper:1,ls:.06,color:C.text,fit:W*.84});T(r,W/2,yy+y(96),{font:'cg',italic:1,size:22,color:C.mute})};
  person(f.gs,f.gn,f.grank,y(858));T('&',W/2,y(998),{font:'gv',size:36,color:C.gold});person(f.bs,f.bn,f.brank,y(1048));
  invEvents(K,W,f,1180,184,{...C,accent:C.gold});
  return e}

/* 4 · Vòm ánh sáng: một ảnh vòm lớn, đôi tên cạnh ảnh, gia đình và lịch lễ bên dưới. */
function invArch({W,H,f,v,sym}){
  const K=invKit(W,H),{e,T,L,y,fs}=K,C={text:'#25392f',accent:'#75815b',mute:'#687266'};
  e.push({t:'rect',x:0,y:0,w:W,h:H,fill:'#f3f5ed'},{t:'paper',alpha:.16},
    {t:'rframe',x:W*.035,y:y(32),w:W*.93,h:H-y(64),r:fs(6),lw:fs(1),color:'#aab398'});
  e.push(I(W*.075,y(220),W*.4,y(450),{shape:'arch',ring:fs(5)}));
  const cx=W*.73;
  e.push({t:'sym',kind:sym,x:cx,y:y(154),s:fs(73),color:'gold'});
  const person=(st,name,rank,yy)=>{
    T(st,cx,y(yy),{font:'mont',size:15,upper:1,ls:.18,color:C.accent,fit:W*.4});
    T(name,cx,y(yy+55),{font:'cg',size:46,color:C.text,fit:W*.39});
    T(rank,cx,y(yy+96),{font:'cg',italic:1,size:21,color:C.mute,fit:W*.4});
  };
  person(f.gs,f.gn,f.grank,235);T('&',cx,y(382),{font:'gv',size:42,color:C.accent});person(f.bs,f.bn,f.brank,423);
  T(invitePurpose().title,cx,y(589),{font:'mont',size:15,upper:1,ls:.12,color:C.accent,fit:W*.38});
  invVerse(K,W,v,65,C);
  T(f.inv1,W/2,y(819),{font:'gv',size:40,color:C.accent});
  T(f.inv2,W/2,y(863),{font:'mont',size:17,upper:1,ls:.13,color:C.text});
  invFamilies(K,W,f,925,C);L(W*.16,y(1110),W*.84,{color:C.accent,lw:fs(.8)});
  invEvents(K,W,f,1144,220,C);
  return e}

/* 5 · Đỏ vang giao ước: ấn đức tin, đôi tên lớn và dải lịch; không có ảnh. */
function invWine({W,H,f,v,sym}){
  const K=invKit(W,H),{e,T,L,y,fs}=K,C={text:'#4b2631',accent:'#8a3d50',mute:'#8a7275'};
  e.push({t:'rect',x:0,y:0,w:W,h:H,fill:'#fff8f3'},{t:'paper',alpha:.12},
    {t:'rframe',x:W*.036,y:y(34),w:W*.928,h:H-y(68),r:fs(2),lw:fs(2.2),color:C.accent});
  T(f.inv1,W/2,y(87),{font:'mont',size:19,upper:1,ls:.24,color:C.accent});
  T(f.inv2,W/2,y(132),{font:'cg',italic:1,size:29,color:C.mute});
  e.push({t:'sym',kind:sym,x:W/2,y:y(224),s:fs(91),color:'gold'});
  const person=(st,name,rank,yy)=>{
    T(st,W/2,y(yy),{font:'mont',size:17,upper:1,ls:.26,color:C.accent});
    T(name,W/2,y(yy+60),{font:'cg',size:66,color:C.text,fit:W*.8});
    T(rank,W/2,y(yy+107),{font:'cg',italic:1,size:22,color:C.mute});
  };
  person(f.gs,f.gn,f.grank,320);T('&',W/2,y(470),{font:'gv',size:42,color:C.accent});person(f.bs,f.bn,f.brank,510);
  e.push({t:'blob',x:W/2,y:y(820),r:W*.46,color:'#f4e6e5',alpha:.7});
  invEvents(K,W,f,700,272,C);
  invVerse(K,W,v,1025,C);L(W*.25,y(1114),W*.75,{color:C.accent,lw:fs(.8)});
  invFamilies(K,W,f,1150,C);
  return e}

const INVT=[
{id:'inv_cream',n:'Giấy ngà thanh lịch',d:'Không ảnh · serif tinh tế',pal:{bg:'#fbf7ee',text:'#32291f',accent:'#9d7a43'},b:invCream},
{id:'inv_rose',n:'Trắng hồng hiện đại',d:'Ảnh lớn · dải ngày kẻ chỉ',pal:{bg:'#fffafb',text:'#2e1a21',accent:'#b3243f'},b:invRose},
{id:'inv_gold',n:'Viền vàng sang trọng',d:'Ảnh tròn · khối lịch',pal:{bg:'#fffdf8',text:'#2a2118',accent:'#a8823f'},b:invGold},
{id:'inv_arch',n:'Vòm ánh sáng',d:'Có ảnh · xanh ô-liu',pal:{bg:'#f3f5ed',text:'#25392f',accent:'#75815b'},b:invArch},
{id:'inv_wine',n:'Đỏ vang giao ước',d:'Không ảnh · chữ lớn',pal:{bg:'#fff8f3',text:'#4b2631',accent:'#8a3d50'},b:invWine},
];
