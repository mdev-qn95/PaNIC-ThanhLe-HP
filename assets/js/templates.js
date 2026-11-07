'use strict';
/* ===== Mẫu ảnh cho thánh lễ hôn phối =====
   Ảnh là chính, chữ gọn. Mỗi mẫu luôn có tên thánh + họ tên của cả hai người, tự bố cục cho khổ ngang lẫn dọc. */
const I=(x,y,w,h,o={})=>({t:'img',x,y,w,h,...o});
const W1='#ffffff';
/* ngày (chữ có chân, giãn nhẹ) + giáo xứ (nghiêng) */
const when=(f,o={})=>{const z=o.size||26;return[{text:f.date,font:'display',size:z,ls:.16,color:o.color,shadow:o.shadow,pad:0},{text:f.parish,font:'serif',italic:1,size:z*.95,color:o.color,shadow:o.shadow}]};
const whenLine=(f,o={})=>({text:`${f.date}  —  ${f.parish}`,font:'serif',italic:1,size:o.size||26,ls:.04,color:o.color,shadow:o.shadow});
const onPhoto=(o={})=>({color:W1,saintColor:W1,ampColor:W1,shadow:true,...o});
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
{id:'verse',n:'Lời Chúa',d:'Câu Kinh Thánh trên ảnh',b({W,H,m,f,v,land,sym}){
  const e=[I(0,0,W,H,{bleed:1}),{t:'shade',x:0,y:land?H*.1:H*.3,w:W,h:land?H*.9:H*.7,dir:'up',alpha:.8}],w=land?W*.72:W*.84;
  stack(e,W/2,land?m*.5:H*.38,H-m*.7,[{sym,s:60,color:'white'},{div:1,color:'white'},...names(f,onPhoto({size:land?46:44}))],w,'center',1,'bottom');
  return e}},
{id:'panel',n:'Khung kính giữa ảnh',d:'Ảnh nền, thẻ chữ trong mờ',b({W,H,m,f,land,sym}){
  const e=[I(0,0,W,H,{bleed:1})],pw=land?W*.42:W*.78,ph=land?H*.66:H*.4,px=(W-pw)/2,py=land?(H-ph)/2:H-m*1.2-ph;
  e.push({t:'rect',x:px,y:py,w:pw,h:ph,fill:'bg',alpha:.86,r:6},{t:'rframe',x:px+10,y:py+10,w:pw-20,h:ph-20,r:3,lw:1.2,color:'accent',alpha:.8});
  stack(e,W/2,py+26,py+ph-26,[{sym,s:50},...names(f,{size:50}),{div:1,w:120},...when(f,{size:22})],pw*.86);
  return e}},
{id:'frame',n:'Khung viền trắng',d:'Ảnh toàn khung, viền kép',b({W,H,m,f,land,sym}){
  const o=m*.45,e=[I(0,0,W,H,{bleed:1}),{t:'shade',x:0,y:H*.45,w:W,h:H*.55,dir:'up',alpha:.75},{t:'rframe',x:o,y:o,w:W-2*o,h:H-2*o,lw:2,color:'#ffffff',alpha:.9},{t:'rframe',x:o+12,y:o+12,w:W-2*o-24,h:H-2*o-24,lw:.9,color:'#ffffff',alpha:.75}];
  stack(e,W/2,land?m:H*.5,H-m*1.1,[{sym,s:46,color:'white'},...names(f,onPhoto({size:land?54:52})),{gap:2},whenLine(f,{color:W1,shadow:true,size:22})],land?W*.8:W*.84,'center',1,'bottom');
  return e}},
{id:'covenant',n:'Giao ước',d:'Lời Chúa + ảnh nửa khung',b({W,H,m,g,f,v,land,sym}){
  const e=[];
  if(land){const pw=W*.52;e.push(I(W-pw,0,pw,H,{bleed:1}));e.push({t:'fade',x:W-pw,y:0,w:pw*.25,h:H,dir:'left'});const w=W-pw-m*1.8;
    stack(e,m*.9+w/2,m,H-m,[{sym,s:50},{div:1},...names(f,{size:44})],w);return e}
  const ph=H*.5;e.push(I(0,0,W,ph,{bleed:1}));e.push({t:'fade',x:0,y:ph*.7,w:W,h:ph*.3+1,dir:'down'});
  stack(e,W/2,ph+10,H-m*.9,[{sym,s:54},{div:1},...names(f,{size:46})],W*.84);
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
    ...when(f,{size:26})],w);
  return e}},
{id:'thanks',n:'Cảm tạ',d:'Kết thúc thánh lễ',b({W,H,m,f,land,sym}){
  const e=[],items=w=>[{sym,s:50},{text:f.thanks,font:'script',size:84,color:'accent'},{text:f.thanks2,font:'serif',italic:1,size:25,wrap:1,lines:est(f.thanks2,25,w),lh:1.35},{div:1},...names(f,{size:land?40:36})];
  if(land){e.push(I(0,0,W*.6,H,{bleed:1}));e.push({t:'fade',x:W*.42,y:0,w:W*.18+1,h:H,dir:'right'});const w=W*.36;stack(e,W*.6+(W*.4-m*.4)/2,m*.8,H-m*.8,items(w),w)}
  else{e.push(I(0,0,W,H*.56,{bleed:1}));e.push({t:'fade',x:0,y:H*.38,w:W,h:H*.18+1,dir:'down'});const w=W*.84;stack(e,W/2,H*.5,H-m*.8,items(w),w)}
  return e}},
];

/* Lời Chúa luôn ở đầu ảnh, tách khỏi vùng ảnh và nội dung bên dưới.
   Đo cùng quy tắc với drawText để trích dẫn sát câu ngay cả khi đổi font/cỡ chữ. */
let scriptureMeasureContext;
function scriptureHeader(W,H,v){
  const ctx=scriptureMeasureContext||(scriptureMeasureContext=document.createElement('canvas').getContext('2d'));
  const z=Math.min(W,H),top=z*.08,width=W*.84;
  const q={t:'text',role:'scripture',text:v.t?`“${v.t}”`:'',x:W/2,y:top,align:'center',valign:'top',font:'serif',italic:1,size:z*.041,maxW:width,fit:width,maxH:z*.17,lh:1.3,color:'text'};
  const qh=measureTextBlock(ctx,q)?.tot||0;
  const r={t:'text',role:'scripture-reference',text:v.r,x:W/2,y:top+qh+(qh?z*.008:0),align:'center',valign:'top',font:'serif',italic:1,size:z*.023,fit:width,maxH:z*.06,lh:1.2,color:'accent'};
  const rh=measureTextBlock(ctx,r)?.tot||0;
  return{items:[q,r],height:qh||rh?r.y+rh+z*.05:z*.04};
}
for(const tpl of TPL){
  const body=tpl.b;
  tpl.b=options=>{
    const {W,H,v}=options,header=scriptureHeader(W,H,v),h=H-header.height;
    const items=body({...options,H:h,m:Math.min(W,h)*.06});
    return[...header.items,...items.map(item=>{
      const shifted={...item};
      for(const key of ['y','y1','y2'])if(typeof shifted[key]==='number')shifted[key]+=header.height;
      return shifted;
    })];
  };
}

/* ===== Hai mẫu thiệp mời ===== */
function invKit(W,H){const U=H/1414,X=W/1000,fs=k=>k*Math.min(U,X),y=k=>k*U,e=[];
  const T=(text,x,yy,o={})=>e.push({t:'text',text,x,y:yy,align:'center',font:'times',noScale:1,fit:W*.86,...o,size:fs(o.size||26)});
  const R=(segs,x,yy,size,o={})=>e.push({t:'rich',segs,x,y:yy,size:fs(size),align:'center',fit:W*.42,...o});
  const L=(x1,yy,x2,o={})=>e.push({t:'line',x1,y1:yy,x2,y2:yy,lw:o.lw||1.4,color:o.color,alpha:o.alpha??1,dash:o.dash});
  return{e,U,X,fs,y,T,R,L}}


function invRose({W,H,f,v,sym}){
  const K=invKit(W,H),{e,T,R,L,y,fs}=K,C={text:'#3a1f27',rose:'#b3243f',soft:'#d9768a'};
  e.push({t:'rect',x:0,y:0,w:W,h:H,fill:'#fffafb'},{t:'blob',x:W*.05,y:H*.62,r:W*.55,color:'#f6b6c3',alpha:.4},{t:'blob',x:W*.98,y:H*.9,r:W*.6,color:'#f4a9b8',alpha:.4},{t:'paper',alpha:.2});
  const px=W*.07,pw=W*.86,ph=y(490),py=y(50);e.push(I(px,py,pw,ph,{r:W*.03}));e.push({t:'rframe',x:px+fs(12),y:py+fs(12),w:pw-fs(24),h:ph-fs(24),r:W*.02,lw:fs(1.6),color:'#ffffff',alpha:.85});
  const cy=py+ph;e.push({t:'rect',x:W/2-fs(52),y:cy-fs(52),w:fs(104),h:fs(104),r:fs(52),fill:'#fffafb'});e.push({t:'sym',kind:sym,x:W/2,y:cy,s:fs(70),color:'gold'});
  T(`“${v.t}”  ${v.r}`,W/2,y(615),{font:'cg',italic:1,size:24,color:C.soft,fit:W*.84});
  const fam=(cx,lab,a,b,c,d,addr)=>{T(lab,cx,y(660),{font:'mont',size:15,upper:1,ls:.3,color:C.rose,fit:W*.4});
    R([{text:a+' ',font:'cg',italic:1},{text:b,font:'pf'}],cx,y(694),24,{color:C.text,fit:W*.42});R([{text:c+' ',font:'cg',italic:1},{text:d,font:'pf'}],cx,y(724),24,{color:C.text,fit:W*.42});
    T(String(addr||'').replace(/\s+-\s+/,', '),cx,y(754),{font:'cg',italic:1,size:19,color:'#8a6670',fit:W*.42})};
  fam(W*.27,'Nhà trai',f.gfs,f.gfn,f.gms,f.gmn,f.ga);fam(W*.73,'Nhà gái',f.bfs,f.bfn,f.bms,f.bmn,f.ba);
  e.push({t:'line',x1:W/2,y1:y(650),x2:W/2,y2:y(765),lw:fs(1),color:C.rose,alpha:.35});
  T(`${f.inv1} ${f.inv2}`,W/2,y(805),{font:'mont',size:15,upper:1,ls:.26,color:C.text,fit:W*.86});
  const person=(s,n,r,yy)=>{T(s,W/2,yy,{font:'mont',size:16,upper:1,ls:.36,color:C.rose});T(n,W/2,yy+y(72),{font:'gv',size:80,color:C.rose,fit:W*.84});T(r,W/2,yy+y(132),{font:'cg',italic:1,size:22,color:'#8a6670'})};
  person(f.gs,f.gn,f.grank,y(850));T('&',W/2,y(1020),{font:'gv',size:46,color:C.soft});person(f.bs,f.bn,f.brank,y(1048));
  const by=y(1238);L(W*.12,by-y(34),W*.88,{color:C.rose,lw:fs(1.2)});L(W*.12,by+y(34),W*.88,{color:C.rose,lw:fs(1.2)});
  e.push({t:'line',x1:W*.36,y1:by-y(22),x2:W*.36,y2:by+y(22),lw:fs(1),color:C.rose,alpha:.6},{t:'line',x1:W*.64,y1:by-y(22),x2:W*.64,y2:by+y(22),lw:fs(1),color:C.rose,alpha:.6});
  T(weekday(f.date),W*.24,by,{font:'mont',size:17,upper:1,ls:.22,color:C.text,fit:W*.22});T(dotDate(f.date),W/2,by,{font:'pf',size:40,color:C.rose,fit:W*.26});
  T(String(f.time||'').replace(':',' giờ '),W*.76,by,{font:'mont',size:17,upper:1,ls:.22,color:C.text,fit:W*.22});
  T(f.inv3,W/2,y(1300),{font:'cg',italic:1,size:22,color:'#8a6670'});T('Thánh đường '+f.parish,W/2,y(1333),{font:'pf',size:30,color:C.text});
  if(f.lunar)T(f.lunar,W/2,y(1372),{font:'cg',italic:1,size:20,color:'#8a6670'});
  return e}


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
  T(f.inv1,W/2,y(770),{font:'cg',italic:1,size:30,color:C.mute});T(f.inv2,W/2,y(808),{font:'pf',size:19,upper:1,ls:.22,color:C.text});
  const person=(s,n,r,yy)=>{T(s,W/2,yy,{font:'gv',size:42,color:C.gold});T(n,W/2,yy+y(54),{font:'pf',size:42,upper:1,ls:.06,color:C.text,fit:W*.84});T(r,W/2,yy+y(96),{font:'cg',italic:1,size:22,color:C.mute})};
  person(f.gs,f.gn,f.grank,y(856));T('&',W/2,y(992),{font:'gv',size:42,color:C.gold});person(f.bs,f.bn,f.brank,y(1048));
  const dt=parseDate(f.date),dd=dt?String(dt.getDate()).padStart(2,'0'):'',mm=dt?`Tháng ${String(dt.getMonth()+1).padStart(2,'0')} · ${dt.getFullYear()}`:f.date,by=y(1205);
  L(W*.18,by-y(26),W*.4,{color:C.gold,lw:fs(1)});L(W*.18,by+y(26),W*.4,{color:C.gold,lw:fs(1)});L(W*.6,by-y(26),W*.82,{color:C.gold,lw:fs(1)});L(W*.6,by+y(26),W*.82,{color:C.gold,lw:fs(1)});
  T(weekday(f.date),W*.29,by,{font:'pf',size:20,upper:1,ls:.16,color:C.text,fit:W*.2});T(String(f.time||'').replace(':',' giờ '),W*.71,by,{font:'pf',size:20,upper:1,ls:.16,color:C.text,fit:W*.2});
  T(dd,W/2,by-y(6),{font:'pf',size:96,color:C.gold});T(mm,W/2,by+y(62),{font:'cg',size:22,upper:1,ls:.2,color:C.text});
  T(`${f.inv3} Thánh đường ${f.parish}`,W/2,y(1308),{font:'cg',italic:1,size:24,color:C.text,fit:W*.84});
  if(f.lunar)T(`(${f.lunar})`,W/2,y(1340),{font:'cg',italic:1,size:20,color:C.mute,fit:W*.84});
  return e}


const INVT=[
{id:'inv_rose',n:'Trắng hồng hiện đại',d:'Ảnh lớn · dải ngày kẻ chỉ',pal:{bg:'#fffafb',text:'#2e1a21',accent:'#b3243f'},b:invRose},
{id:'inv_gold',n:'Viền vàng sang trọng',d:'Ảnh tròn · khối lịch',pal:{bg:'#fffdf8',text:'#2a2118',accent:'#a8823f'},b:invGold},
];
